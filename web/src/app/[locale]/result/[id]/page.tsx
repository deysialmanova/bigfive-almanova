import { Report, getTestResult } from '@/actions';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { ReportLanguageSwitch } from './report-language-switch';
import { Alert } from '@/components/alert';
import { supportEmail } from '@/config/site';
import { Chip, Button, Accordion, AccordionItem } from '@nextui-org/react';
import { WhatsAppFloatingButton } from './whatsapp-button';
import { RadarChart } from '@/components/radar-chart';
import { Logo } from '@/components/icons';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'results' });
  return {
    title: t('seo.title'),
    description: t('seo.description')
  };
}

interface ResultPageParams {
  params: { id: string };
  searchParams: { lang: string; showExpanded?: boolean };
}

export default async function ResultPage({
  params,
  searchParams
}: ResultPageParams) {
  let report;
  const formattedId = /^[0-9a-fA-F]{24}$/.test(params.id) ? params.id.toLowerCase() : params.id;

  try {
    report = await getTestResult(formattedId, searchParams.lang);
  } catch (error) {
    const isNotFound = error instanceof Error && (error.name === 'NotFoundError' || error.message.includes('not found'));
    if (!isNotFound) {
      throw new Error('Could not retrieve report');
    }
  }

  if (!report)
    return (
      <Alert title='Could not retrieve report'>
        <>
          <p>We could not retrieve the following id {params.id}.</p>
          <p>Please check that it is correct or contact us at {supportEmail}</p>
        </>
      </Alert>
    );

  return <Results report={report} showExpanded={searchParams.showExpanded} />;
}

interface ResultsProps {
  report: Report;
  showExpanded?: boolean;
}

const domainThemes: Record<string, {
  color: string;
  bgClass: string;
  barBg: string;
  barColor: string;
  textClass: string;
  iconBg: string;
  iconText: string;
  letter: string;
}> = {
  O: {
    color: '#7C3AED',
    bgClass: 'bg-violet-50/50 border-violet-100',
    barBg: 'bg-violet-100',
    barColor: '#7C3AED',
    textClass: 'text-violet-900',
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-700',
    letter: 'A' // Abertura
  },
  C: {
    color: '#D97706',
    bgClass: 'bg-amber-50/50 border-amber-100',
    barBg: 'bg-amber-100',
    barColor: '#D97706',
    textClass: 'text-amber-900',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-700',
    letter: 'C' // Conscienciosidade
  },
  E: {
    color: '#EF4444',
    bgClass: 'bg-red-50/50 border-red-100',
    barBg: 'bg-red-100',
    barColor: '#EF4444',
    textClass: 'text-red-900',
    iconBg: 'bg-red-100',
    iconText: 'text-red-700',
    letter: 'E' // Extroversão
  },
  A: {
    color: '#0D9488',
    bgClass: 'bg-teal-50/50 border-teal-100',
    barBg: 'bg-teal-100',
    barColor: '#0D9488',
    textClass: 'text-teal-900',
    iconBg: 'bg-teal-100',
    iconText: 'text-teal-700',
    letter: 'A' // Amabilidade
  },
  N: {
    color: '#475569',
    bgClass: 'bg-slate-50/50 border-slate-100',
    barBg: 'bg-slate-100',
    barColor: '#475569',
    textClass: 'text-slate-900',
    iconBg: 'bg-slate-100',
    iconText: 'text-slate-700',
    letter: 'N' // Neuroticismo
  }
};

const getIntensityBadge = (scoreText: string) => {
  if (!scoreText) return null;
  const text = scoreText.toLowerCase();
  let label = scoreText;
  let bg = 'bg-[#FDF2E9] text-[#B45309]';
  
  if (text === 'high' || text === 'alta') {
    label = 'Alta';
    bg = 'bg-[#FDF2E9] text-[#B45309]';
  } else if (text === 'low' || text === 'baixa') {
    label = 'Baixa';
    bg = 'bg-gray-100 text-gray-700';
  } else if (text === 'neutral' || text === 'média' || text === 'media') {
    label = 'Média';
    bg = 'bg-[#FDF2E9] text-[#B45309]';
  }
  
  return (
    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${bg}`}>
      {label}
    </span>
  );
};

const Results = ({ report, showExpanded }: ResultsProps) => {
  const t = useTranslations('results');

  return (
    <div className="pb-20 max-w-4xl mx-auto px-4">
      {/* Cabeçalho Almanova (Cores da Marca: Amarelo Ouro e Carmim) */}
      <div className="bg-[#FFBA1F] text-[#871217] py-8 px-6 text-center border-b-4 border-[#871217] shadow-md rounded-b-2xl mb-8 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-3">
          <Logo size={42} className="text-[#871217]" />
          <h1 className="text-3xl font-extrabold tracking-wider font-serif">Almanova</h1>
        </div>
        <div className="h-[1px] bg-[#871217]/20 w-1/3 my-1" />
        <h2 className="text-xl md:text-2xl font-bold tracking-wide mt-1">
          {report.userInfo?.name ? `${report.userInfo.name} — Perfil Big Five` : 'Perfil Big Five'}
        </h2>
        <p className="text-xs font-bold text-[#871217]/80 uppercase tracking-widest">
          Resultado do teste
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Chip size="lg" variant="flat" color="warning" className="bg-[#FFBA1F]/10 text-[#871217] border border-[#FFBA1F]/20 font-semibold">
          Data do Teste: {new Date(report.timestamp).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
        </Chip>
        
        <div className="print:hidden">
          <ReportLanguageSwitch
            language={report.language}
            availableLanguages={report.availableLanguages}
          />
        </div>
      </div>

      {/* Dados Completos do Respondente (Almanova) */}
      {report.userInfo && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mb-8">
          <div className="border-l-4 border-[#871217] pl-3 mb-3">
            <h3 className="text-md font-bold text-slate-800 uppercase tracking-wider">Dados da Respondente</h3>
            <p className="text-xs text-slate-400">Dados coletados antes do início do questionário</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mt-4">
            <div>
              <span className="font-semibold text-slate-800">Nome: </span> 
              {report.userInfo.name}
            </div>
            <div>
              <span className="font-semibold text-slate-800">E-mail: </span> 
              {report.userInfo.email}
            </div>
            <div>
              <span className="font-semibold text-slate-800">Telefone / WhatsApp: </span> 
              {report.userInfo.phone}
            </div>
          </div>
        </div>
      )}

      {/* Visão Geral (Radar Chart) */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mb-8 text-center">
        <h3 className="text-lg font-bold text-slate-800 mb-4 tracking-wider uppercase">Visão Geral</h3>
        <RadarChart results={report.results} />
      </div>

      {/* Traços Detalhados */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6 tracking-wider uppercase border-b border-slate-100 pb-2">
          Traços Detalhados
        </h3>
        
        <div className="flex flex-col gap-6">
          {report.results.map((domain) => {
            const theme = domainThemes[domain.domain] || domainThemes.O;
            
            return (
              <div key={domain.domain} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-4">
                {/* Domain Header */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Circle Icon Letter */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${theme.iconBg} ${theme.iconText}`}>
                      {theme.letter}
                    </div>
                    <h4 className="text-xl font-bold text-slate-800">{domain.title}</h4>
                  </div>
                  {getIntensityBadge(domain.scoreText)}
                </div>

                {/* Domain Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {domain.shortDescription}
                </p>

                {/* Score Line */}
                <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mt-1">
                  <span>Pontuação: {domain.score}</span>
                  <span>24–120</span>
                </div>

                {/* Main Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(0, Math.min(100, ((domain.score - 24) / 96) * 100))}%`,
                      backgroundColor: theme.color
                    }}
                  />
                </div>

                {/* Facets Accordion */}
                <Accordion className="px-0">
                  <AccordionItem
                    key="facets"
                    aria-label="Ver facetas detalhadas"
                    title="Ver facetas detalhadas"
                    classNames={{
                      title: "text-xs font-bold text-slate-500 hover:text-[#871217] transition-colors cursor-pointer",
                      trigger: "py-2 border-t border-slate-50 mt-2"
                    }}
                  >
                    <div className="flex flex-col gap-4 mt-2">
                      {domain.facets.map((facet, fIndex) => (
                        <div key={fIndex} className="flex flex-col gap-1">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-slate-700">
                              {domain.domain}{fIndex + 1}: {facet.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 font-semibold">
                                {facet.score}/20
                              </span>
                              {getIntensityBadge(facet.scoreText)}
                            </div>
                          </div>
                          
                          {/* Facet Progress Bar */}
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.max(0, Math.min(100, ((facet.score - 4) / 16) * 100))}%`,
                                backgroundColor: theme.color
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionItem>
                </Accordion>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ações Finais (Centralizadas no rodapé, ocultas na impressão) */}
      <div className="flex justify-center gap-4 mt-12 print:hidden">
        <Button
          size="lg"
          variant="bordered"
          className="bg-white border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 flex items-center gap-2"
          onClick={() => window.print()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
          Baixar PDF
        </Button>
        
        <Button
          as="a"
          href="/test"
          size="lg"
          variant="bordered"
          className="bg-white border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
          </svg>
          Refazer Teste
        </Button>
      </div>

      <WhatsAppFloatingButton />
    </div>
  );
}
