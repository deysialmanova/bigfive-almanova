import { Report, getTestResult } from '@/actions';
import { getTranslations } from 'next-intl/server';
import { Alert } from '@/components/alert';
import { supportEmail } from '@/config/site';
import { ResultsClient } from './results-client';

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

  return <ResultsClient report={report} showExpanded={searchParams.showExpanded} />;
}
