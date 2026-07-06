import { getItems, getInfo } from '@bigfive-org/questions';
import { Survey } from './survey';
import { useTranslations } from 'next-intl';
import { saveTest } from '@/actions';
import { unstable_setRequestLocale } from 'next-intl/server';
import TestSetup from './test-setup';

const questionLanguages = getInfo().languages;

interface Props {
  params: { locale: string };
  searchParams: { lang?: string };
}

export default function TestPage({
  params: { locale },
  searchParams: { lang }
}: Props) {
  unstable_setRequestLocale(locale);
  const language =
    lang || (questionLanguages.some((l) => l.id === locale) ? locale : 'pt');
  const questions = getItems(language);
  const t = useTranslations('test');

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <TestSetup />
      
      {/* Cabeçalho Clínico Almanova */}
      <div className="bg-[#871217] text-white py-5 px-4 text-center border-b-4 border-[#FFBA1F] shadow-md">
        <h2 className="text-xl md:text-2xl font-semibold tracking-wide">
          Almanova &bull; Questionário de Personalidade
        </h2>
        <p className="text-[10px] font-bold text-slate-200 mt-1.5 uppercase tracking-widest">
          Terapeuta - Deysi Dias
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 mt-6 bg-white rounded-xl shadow-sm border border-slate-100">
        <p className="text-center text-slate-500 italic mb-6">
          Responda com calma no seu próprio ritmo. Não há limite de tempo.
        </p>
        
        <Survey
          questions={questions}
          nextText={t('next')}
          prevText={t('back')}
          resultsText={t('seeResults')}
          saveTest={saveTest}
          language={language}
        />
      </div>
    </div>
  );
}
