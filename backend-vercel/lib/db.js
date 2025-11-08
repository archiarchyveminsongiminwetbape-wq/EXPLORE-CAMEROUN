const { Pool } = require('pg');

let pool = global.__pgPool;
if (!pool) {
  pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT) || 5432,
    ssl: process.env.PGSSL ? { rejectUnauthorized: false } : undefined,
  });
  global.__pgPool = pool;
}

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      tx_ref TEXT UNIQUE,
      flw_id BIGINT,
      amount NUMERIC(18,2),
      currency TEXT,
      customer_email TEXT,
      customer_phone TEXT,
      status TEXT,
      source TEXT,
      raw JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `);
}

async function insertTransactionInit({ tx_ref, amount, currency, email, phone, source }) {
  await pool.query(
    `INSERT INTO transactions (tx_ref, amount, currency, customer_email, customer_phone, status, source)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (tx_ref) DO NOTHING`,
    [tx_ref, amount, currency, email || null, phone || null, 'initialized', source || 'checkout']
  );
}

async function updateTransactionFromVerify({ tx_ref, flw_id, status, raw }) {
  await pool.query(
    `UPDATE transactions SET flw_id=$2, status=$3, raw=$4, updated_at=now() WHERE tx_ref=$1`,
    [tx_ref, flw_id || null, status, raw]
  );
}

module.exports = { pool, ensureSchema, insertTransactionInit, updateTransactionFromVerify };
