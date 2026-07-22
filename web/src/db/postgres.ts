import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPgPool(): Pool {
  if (pool) return pool;

  const connectionString =
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

  if (!connectionString) {
    console.warn(
      'Aviso: Nenhuma variável de conexão PostgreSQL (POSTGRES_URL) foi encontrada.'
    );
  }

  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  return pool;
}

export async function ensureLeadsTableExists() {
  const p = getPgPool();
  const client = await p.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(255) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        telefone VARCHAR(100),
        email VARCHAR(255) NOT NULL,
        relatorio_pdf TEXT,
        resultado_sintese JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error('Erro ao garantir existência da tabela leads no banco de dados:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function saveLeadToPostgres({
  id,
  nome,
  email,
  telefone,
  relatorioPdf,
  resultadoSintese
}: {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  relatorioPdf: string;
  resultadoSintese: any;
}) {
  try {
    await ensureLeadsTableExists();

    const p = getPgPool();
    const client = await p.connect();
    try {
      const sinteseJson = JSON.stringify(resultadoSintese);
      const phoneVal = telefone || null;

      await client.query(
        `
        INSERT INTO leads (id, nome, email, telefone, relatorio_pdf, resultado_sintese, created_at)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb, NOW())
        ON CONFLICT (id) DO UPDATE
        SET nome = EXCLUDED.nome,
            email = EXCLUDED.email,
            telefone = EXCLUDED.telefone,
            relatorio_pdf = EXCLUDED.relatorio_pdf,
            resultado_sintese = EXCLUDED.resultado_sintese;
        `,
        [id, nome, email, phoneVal, relatorioPdf, sinteseJson]
      );

      console.log(`[Supabase DB] Lead e Síntese de ${nome} (${email}) salvos com sucesso na tabela 'leads'!`);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[Supabase DB] Falha ao salvar lead na tabela leads:', error);
    throw error;
  }
}
