import { title } from '@/components/primitives';

export default function ComparePage() {
  return (
    <div className="max-w-3xl mx-auto py-16 text-center">
      <h1 className={title()}>Comparação indisponível</h1>

      <p className="mt-6 text-lg">
        Esta funcionalidade foi desativada nesta versão da plataforma.
      </p>
    </div>
  );
}
