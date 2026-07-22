'use server';

import { connectToDatabase } from '@/db';
import { saveLeadToPostgres } from '@/db/postgres';
import { ObjectId } from 'mongodb';
import { B5Error, DbResult, Feedback } from '@/types';
import calculateScore from '@bigfive-org/score';
import nodemailer from 'nodemailer';
import generateResult, {
  getInfo,
  Language,
  Domain
} from '@bigfive-org/results';
import { getItems } from '@bigfive-org/questions';

const collectionName = process.env.DB_COLLECTION || 'results';
const resultLanguages = getInfo().languages;

export type Report = {
  id: string;
  timestamp: number;
  availableLanguages: Language[];
  language: string;
  results: Domain[];
  userInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
};

export async function getTestResult(
  id: string,
  language?: string
): Promise<Report | undefined> {
  'use server';
  try {
    // 1. Tenta tratar o 'id' como um payload codificado em Base64URL
    if (id.length > 24) {
      try {
        const decodedString = Buffer.from(
          id.replace(/-/g, '+').replace(/_/g, '/'),
          'base64'
        ).toString('utf8');
        const data = JSON.parse(decodedString);
        
        if (data && data.scores && data.lang) {
          const questions = getItems(data.lang);
          const answers = questions.map((q, index) => {
            const score = Number(data.scores[index]) || 3;
            return {
              id: q.id,
              score,
              domain: q.domain,
              facet: q.facet
            };
          });

          const selectedLanguage = language || data.lang;
          const scores = calculateScore({ answers: answers as any });
          const results = generateResult({ lang: selectedLanguage, scores });

          return {
            id,
            timestamp: data.date || Date.now(),
            availableLanguages: resultLanguages,
            language: selectedLanguage,
            results,
            userInfo: data.user
          };
        }
      } catch (e) {
        console.warn('Id is longer than 24 chars but failed to decode as Base64 payload. Falling back to DB...', e);
      }
    }

    // 2. Se for um ObjectId válido de 24 caracteres hex, tenta buscar no banco (retrocompatibilidade)
    if (ObjectId.isValid(id)) {
      const query = { _id: new ObjectId(id) };
      const db = await connectToDatabase();
      const collection = db.collection(collectionName);
      const report = await collection.findOne(query);
      if (!report) {
        console.error(`The test results with id ${id} are not found!`);
        throw new B5Error({
          name: 'NotFoundError',
          message: `The test results with id ${id} is not found in the database!`
        });
      }
      const selectedLanguage =
        language ||
        (!!resultLanguages.find((l) => l.id == report.lang) ? report.lang : 'en');
      const scores = calculateScore({ answers: report.answers });
      const results = generateResult({ lang: selectedLanguage, scores });
      return {
        id: report._id.toString(),
        timestamp: report.dateStamp,
        availableLanguages: resultLanguages,
        language: selectedLanguage,
        results,
        userInfo: report.userInfo
      };
    }

    throw new B5Error({
      name: 'NotFoundError',
      message: `The test results with id ${id} are not valid or not found!`
    });
  } catch (error) {
    console.error('Error in getTestResult Server Action:', error);
    if (error instanceof B5Error) {
      throw error;
    }
    throw new Error('Something wrong happend. Failed to get test result!');
  }
}

export async function saveTest(testResult: DbResult) {
  'use server';
  try {
    // 1. Gera um payload compacto com as respostas ordenadas conforme a lista de questões
    const questions = getItems(testResult.lang);
    const scores = questions
      .map((q) => {
        const ans = testResult.answers.find((a) => a.id === q.id);
        return ans ? ans.score : 3;
      })
      .join('');

    const payloadObj = {
      lang: testResult.lang,
      time: testResult.timeElapsed,
      date: new Date(testResult.dateStamp).getTime(),
      scores,
      user: testResult.userInfo
    };

    const base64Payload = Buffer.from(JSON.stringify(payloadObj), 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // 2. Prepara a síntese dos fatores (SEM salvar as 120 respostas individuais)
    const calculatedScores = calculateScore({ answers: testResult.answers as any });
    const domainResults = generateResult({ lang: testResult.lang, scores: calculatedScores });

    const resultadoSintese = {
      lang: testResult.lang,
      tempoDecorridoSegundos: testResult.timeElapsed,
      fatores: domainResults.map((domain) => ({
        dominio: domain.domain,
        titulo: domain.title,
        pontuacao: domain.score,
        contagem: domain.count,
        textoPontuacao: domain.scoreText,
        descricaoCurta: domain.shortDescription
      }))
    };

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bigfive-almanova.vercel.app';
    const relatorioPdf = `${appUrl}/result/${base64Payload}`;

    // Salva na tabela leads no Supabase/Postgres
    await saveLeadToPostgres({
      id: base64Payload,
      nome: testResult.userInfo?.name || 'Não informado',
      email: testResult.userInfo?.email || 'Não informado',
      telefone: testResult.userInfo?.phone || null,
      relatorioPdf,
      resultadoSintese
    }).catch((err) => {
      console.error('Erro ao salvar lead no Supabase Postgres:', err);
    });

    // 3. Dispara o envio de e-mail de forma assíncrona com o payload no link de visualização
    sendTestResultEmail(testResult, base64Payload).catch(console.error);

    return { id: base64Payload };
  } catch (error) {
    console.error(error);
    throw new B5Error({
      name: 'SavingError',
      message: 'Failed to process test result!'
    });
  }
}

export type FeebackState = {
  message: string;
  type: 'error' | 'success';
};

export async function saveFeedback(
  prevState: FeebackState,
  formData: FormData
): Promise<FeebackState> {
  'use server';
  const feedback: Feedback = {
    name: String(formData.get('name')),
    email: String(formData.get('email')),
    message: String(formData.get('message'))
  };
  try {
    const db = await connectToDatabase();
    const collection = db.collection('feedback');
    await collection.insertOne({ feedback });
    return {
      message: 'Sent successfully!',
      type: 'success'
    };
  } catch (error) {
    return {
      message: 'Error sending feedback!',
      type: 'error'
    };
  }
}

async function sendTestResultEmail(testResult: DbResult, id: string) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || 'no-reply@almanova.com.br';

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn('Configuração SMTP incompleta. Pulando o envio de e-mail de resultados.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  const name = testResult.userInfo?.name || 'Não informado';
  const email = testResult.userInfo?.email || 'Não informado';
  const phone = testResult.userInfo?.phone || 'Não informado';
  const date = new Date(testResult.dateStamp).toLocaleString('pt-BR');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bigfive-almanova.vercel.app';
  const reportUrl = `${appUrl}/result/${id}`;

  const mailOptions = {
    from: `"Almanova Big Five" <${smtpFrom}>`,
    to: 'almanova@outlook.com.br',
    subject: `[Almanova Big Five] Novo Teste Respondido: ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #871217; border-bottom: 2px solid #FFBA1F; padding-bottom: 10px; margin-top: 0;">Novo Teste de Personalidade Respondido</h2>
        
        <p style="color: #333; font-size: 15px; line-height: 1.5;">Um novo teste Big Five foi finalizado. Veja os detalhes da respondente abaixo:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 15px;">
          <tr>
            <td style="padding: 10px 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%; color: #555;">Nome:</td>
            <td style="padding: 10px 8px; border-bottom: 1px solid #eee; color: #333;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">E-mail:</td>
            <td style="padding: 10px 8px; border-bottom: 1px solid #eee; color: #333;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">WhatsApp/Tel:</td>
            <td style="padding: 10px 8px; border-bottom: 1px solid #eee; color: #333;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Data/Hora:</td>
            <td style="padding: 10px 8px; border-bottom: 1px solid #eee; color: #333;">${date}</td>
          </tr>
        </table>
        
        <div style="margin-top: 35px; text-align: center;">
          <a href="${reportUrl}" target="_blank" style="background-color: #871217; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; box-shadow: 0 4px 6px rgba(135,18,23,0.15);">
            Visualizar Relatório Completo
          </a>
        </div>
        
        <p style="font-size: 11px; color: #888; margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 15px;">
          Este é um e-mail automático gerado pelo sistema Big Five Almanova.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log(`E-mail com resultado de ${name} enviado com sucesso para almanova@outlook.com.br`);
}
