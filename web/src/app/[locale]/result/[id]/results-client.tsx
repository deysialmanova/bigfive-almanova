'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Chip, Button } from '@nextui-org/react';
import { Snippet } from '@nextui-org/snippet';
import { WhatsAppFloatingButton } from './whatsapp-button';
import { BarChart } from '@/components/bar-chart';
import { Logo } from '@/components/icons';
import { ReportLanguageSwitch } from './report-language-switch';
import { Report } from '@/actions';
import { Link } from '@/navigation';

import { DomainTabs } from './domain-tabs';

interface ResultsClientProps {
  report: Report;
  showExpanded?: boolean;
}

export const ResultsClient = ({ report, showExpanded }: ResultsClientProps) => {
  const t = useTranslations('results');
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    try {
      setFormattedDate(
        new Date(report.timestamp).toLocaleDateString('pt-BR', {
          timeZone: 'America/Sao_Paulo'
        })
      );
    } catch (e) {
      try {
        setFormattedDate(new Date(report.timestamp).toLocaleDateString('pt-BR'));
      } catch (err) {
        setFormattedDate('');
      }
    }
  }, [report.timestamp]);

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
          Data do Teste: {formattedDate || '...'}
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

      {/* ID de visualização rápida e Compartilhamento */}
      <div className='text-center mt-6 text-sm text-slate-500'>
        <span className='font-bold text-slate-700'>{t('important')}</span> &nbsp;
        {t('saveResults')} &nbsp;
        <Link href={`/compare/?id=${report.id}`} className='underline font-medium text-[#871217] hover:text-[#720f13]'>
          {t('compare')}
        </Link>{' '}
        &nbsp;
        {t('toOthers')}
      </div>

      <div className='flex mt-4'>
        <Snippet
          hideSymbol
          color='danger'
          className='w-full justify-center'
          size='lg'
        >
          {report.id}
        </Snippet>
      </div>



      {/* Visão Geral (Original Bar Chart) */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm my-8">
        <div className='flex border-b border-slate-100 pb-4 mb-4'>
          <h3 className="text-lg font-bold text-slate-800 tracking-wider uppercase font-serif">
            {t('theBigFive')}
          </h3>
        </div>
        <BarChart max={120} results={report.results} />
      </div>

      {/* Traços Detalhados (Original Domain Tabs) */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mb-8">
        <DomainTabs
          results={report.results}
          showExpanded={!!showExpanded}
          scoreText={t('score')}
        />
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
};
