'use server';

import { connectToDatabase } from '@/db';
import { ObjectId } from 'mongodb';
import { B5Error, DbResult, Feedback } from '@/types';
import calculateScore from '@bigfive-org/score';
import nodemailer from 'nodemailer';
import generateResult, {
  getInfo,
  Language,
  Domain
} from '@bigfive-org/results';

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
    phone: string;
  };
};

export async function getTestResult(
  id: string,
  language?: string
): Promise<Report | undefined> {
  'use server';
  try {
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
  } catch (error) {
    if (error instanceof B5Error) {
      throw error;
    }
    throw new Error('Something wrong happend. Failed to get test result!');
  }
}

export async function saveTest(testResult: DbResult) {
  'use server';
  try {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(testResult);
    
    // Dispara o envio do resultado por e-mail de forma assíncrona
    sendTestResultEmail(testResult, result.insertedId.toString()).catch(console.error);

    return { id: result.insertedId.toString() };
  } catch (error) {
    console.error(error);
    throw new B5Error({
      name: 'SavingError',
      message: 'Failed to save test result!'
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
