import { Report, getTestResult } from '@/actions';
import { Snippet } from '@nextui-org/snippet';
import { useTranslations } from 'next-intl';
import { title } from '@/components/primitives';
import { getTranslations } from 'next-intl/server';
import { BarChart } from '@/components/bar-chart';
import { Link } from '@/navigation';
import { ReportLanguageSwitch } from './report-language-switch';
import { Alert } from '@/components/alert';
import { supportEmail } from '@/config/site';
import ShareBar from '@/components/share-bar';
import { DomainTabs } from './domain-tabs';
import { Chip } from '@nextui-org/react';
import { formatId } from '@/lib/helpers';
import { WhatsAppFloatingButton } from './whatsapp-button';

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

const Results = ({ report, showExpanded }: ResultsProps) => {
  const t = useTranslations('results');

  return (
    <div className="pb-20">
      <div className='flex items-center gap-x-4'>
        <div className='flex-grow'>
          <ReportLanguageSwitch
            language={report.language}
            availableLanguages={report.availableLanguages}
          />
        </div>
        <Chip>
          {new Date(report.timestamp).toLocaleDateString('pt-BR', {
            timeZone: 'America/Sao_Paulo'
          })}
        </Chip>
      </div>

      {/* Dados Completos do Respondente (Almanova) */}
      {report.userInfo && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mt-6 mb-2">
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

      <div className='flex mt-5 justify-end w-full gap-x-1 print:hidden'>
        <ShareBar report={report} />
      </div>

      <div className='flex mt-10 border-b border-slate-100 pb-4'>
        <h1 className={`${title()} text-slate-800 font-serif`}>{t('theBigFive')}</h1>
      </div>

      <BarChart max={120} results={report.results} />
      
      <DomainTabs
        results={report.results}
        showExpanded={!!showExpanded}
        scoreText={t('score')}
      />

      <WhatsAppFloatingButton />
    </div>
  );
};
