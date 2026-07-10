import { Report, getTestResult } from '@/actions';
import { getTranslations, getMessages } from 'next-intl/server';
import { Alert } from '@/components/alert';
import { supportEmail } from '@/config/site';
import { ResultsClient } from './results-client';
import { NextIntlClientProvider } from 'next-intl';

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
  params: { id: string; locale: string };
  searchParams: { lang: string; showExpanded?: boolean };
}

export default async function ResultPage({
  params: { id, locale },
  searchParams
}: ResultPageParams) {
  let report;
  const formattedId = /^[0-9a-fA-F]{24}$/.test(id) ? id.toLowerCase() : id;

  try {
    report = await getTestResult(formattedId, searchParams.lang);
  } catch (error) {
    console.error('Error fetching report:', error);
    report = undefined;
  }

  if (!report)
    return (
      <Alert title='Could not retrieve report'>
        <>
          <p>We could not retrieve the following id {id}.</p>
          <p>Please check that it is correct or contact us at {supportEmail}</p>
        </>
      </Alert>
    );

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ResultsClient report={report} showExpanded={searchParams.showExpanded} />
    </NextIntlClientProvider>
  );
}
