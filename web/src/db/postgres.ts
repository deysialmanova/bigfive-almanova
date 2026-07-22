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
      'Aviso: Nenhuma variável POSTGRES_URL foi encontrada nas variáveis de ambiente.'
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

export async function ensureUserResultsTableExists() {
  const p = getPgPool();
  const client = await p.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_results (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        result JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error('Erro ao garantir existência da tabela user_results no Postgres:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function saveUserResultToPostgres({
  id,
  name,
  email,
  phone,
  result
}: {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  result: any;
}) {
  try {
    await ensureUserResultsTableExists();

    const p = getPgPool();
    const client = await p.connect();
    try {
      const resultJson = JSON.stringify(result);
      const phoneVal = phone || null;

      await client.query(
        `
        INSERT INTO user_results (id, name, email, phone, result, created_at)
        VALUES ($1, $2, $3, $4, $5::jsonb, NOW())
        ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            result = EXCLUDED.result;
        `,
        [id, name, email, phoneVal, resultJson]
      );

      console.log(`[Postgres] Resultado de ${name} (${email}) salvo com sucesso na tabela user_results!`);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[Postgres] Falha ao salvar resultado no banco de dados:', error);
    throw error;
  }
}
