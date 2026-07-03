import { title } from '@/components/primitives';

export default function ResultPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 text-center">
      <h1 className={title()}>Resultado temporariamente indisponível</h1>

      <p className="mt-6 text-lg">
        Estamos preparando uma nova experiência de devolutiva dos resultados.
      </p>
    </div>
  );
}
