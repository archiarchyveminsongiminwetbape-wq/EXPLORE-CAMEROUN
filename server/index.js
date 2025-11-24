const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
let PDFDocument;
try { PDFDocument = require('pdfkit'); } catch (_) { PDFDocument = null; }

dotenv.config({ path: path.resolve(__dirname, '.env') });

// (refund endpoint is defined below after app initialization)

// (PDF admin endpoint moved to bottom before app.listen)

// (moved PDF receipt endpoint to after initialization)
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const PORT = process.env.PORT || 3001;
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY;
const FRONT_URL = process.env.FRONT_URL || 'http://localhost:5173';
const FLW_WEBHOOK_SECRET = process.env.FLW_WEBHOOK_SECRET || process.env.FLW_SECRET_HASH;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

// PostgreSQL pool
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT) || 5432,
});

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

// Simple admin auth (optional): when ADMIN_TOKEN is set, require header x-admin-token
function adminAuth(req, res, next) {
  if (!ADMIN_TOKEN) return next();
  const token = req.headers['x-admin-token'];
  if (token && token === ADMIN_TOKEN) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

ensureSchema().catch((e) => {
  console.error('Failed to ensure schema', e);
});

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

function buildMailer() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function sendReceiptEmail(to, payload) {
  const transporter = buildMailer();
  if (!transporter || !to) return;
  const subject = `Reçu de paiement - ${payload?.tx_ref || ''}`;
  const text = `Merci pour votre paiement.\n\nRéférence: ${payload?.tx_ref}\nMontant: ${payload?.amount} ${payload?.currency}\nStatut: ${payload?.status}\n`;
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  };
  if (PDFDocument) {
    try {
      const buf = await generateReceiptPdfBuffer({
        tx_ref: payload?.tx_ref,
        amount: payload?.amount,
        currency: payload?.currency,
        status: payload?.status,
        email: to,
      });
      mailOptions.attachments = [{ filename: `receipt_${payload?.tx_ref || 'payment'}.pdf`, content: buf }];
    } catch (e) {
      console.warn('PDF generation failed, sending email without attachment', e);
    }
  }
  await transporter.sendMail(mailOptions);
}

async function generateReceiptPdfBuffer(info) {
  return new Promise((resolve, reject) => {
    if (!PDFDocument) return reject(new Error('pdfkit not available'));
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).text('Reçu de paiement', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Référence: ${info.tx_ref || ''}`);
    doc.text(`Montant: ${info.amount || ''} ${info.currency || ''}`);
    doc.text(`Statut: ${info.status || ''}`);
    if (info.email) doc.text(`Client: ${info.email}`);
    doc.moveDown();
    const now = new Date();
    doc.text(`Date: ${now.toLocaleString()}`);
    doc.moveDown();
    doc.text('Merci pour votre confiance.', { align: 'left' });

    doc.end();
  });
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Route pour obtenir le lien de paiement Lygos
app.get('/api/payment/lygos', (req, res) => {
  try {
    // URL de paiement Lygos fournie
    const paymentUrl = 'https://pay.lygosapp.com/link/ae004d7c-a01d-439a-bddd-3551e672adf4';
    
    // Vous pouvez ajouter ici une logique supplémentaire si nécessaire, comme :
    // - Vérification d'authentification
    // - Enregistrement de la transaction dans la base de données
    // - Personnalisation du lien en fonction des paramètres de la requête
    
    res.json({ 
      success: true, 
      paymentUrl: paymentUrl,
      message: 'Lien de paiement généré avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la génération du lien de paiement:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la génération du lien de paiement',
      details: error.message 
    });
  }
});

// Mock payment endpoints
app.post('/api/pay/mtn', (req, res) => {
  const { phone, amount } = req.body || {};
  if (!phone || !amount) return res.status(400).json({ error: 'phone and amount are required' });
  return res.json({ ok: true, method: 'mtn', message: `Paiement MTN de ${amount} XAF initié pour ${phone}` });
});

app.post('/api/pay/orange', (req, res) => {
  const { phone, amount } = req.body || {};
  if (!phone || !amount) return res.status(400).json({ error: 'phone and amount are required' });
  return res.json({ ok: true, method: 'orange', message: `Paiement Orange Money de ${amount} XAF initié pour ${phone}` });
});

app.post('/api/pay/card', (req, res) => {
  const { number, expiry, cvc, amount, email } = req.body || {};
  if (!number || !expiry || !cvc || !amount) return res.status(400).json({ error: 'number, expiry, cvc, amount are required' });
  return res.json({ ok: true, method: 'card', message: `Paiement carte de ${amount} validé pour ${email || 'client'}` });
});

// Flutterwave Hosted Checkout (Cameroon, XAF)
app.post('/api/pay/flutterwave/init', async (req, res) => {
  try {
    if (!FLW_SECRET_KEY) return res.status(500).json({ error: 'FLW_SECRET_KEY is not configured' });
    const { amount, currency = 'XAF', email, phone, name } = req.body || {};
    if (!amount) return res.status(400).json({ error: 'amount is required' });
    const tx_ref = `EXP_${Date.now()}_${Math.floor(Math.random()*10000)}`;
    // Persist initial intent
    try {
      await insertTransactionInit({ tx_ref, amount: Number(amount), currency, email, phone, source: 'flutterwave' });
    } catch (e) {
      console.warn('Failed to insert initial transaction', e);
    }
    const body = {
      tx_ref,
      amount: Number(amount),
      currency,
      redirect_url: `${FRONT_URL}/payment/callback`,
      customer: {
        email: email || 'client@example.com',
        phonenumber: phone || undefined,
        name: name || 'Client',
      },
      customizations: {
        title: 'Explore Cameroun',
        description: 'Paiement de commande',
      },
    };
    const resp = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
      },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!resp.ok) return res.status(400).json({ error: data?.message || 'Flutterwave init failed', details: data });
    return res.json({ ok: true, link: data?.data?.link, tx_ref });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error', details: String(e) });
  }
});

// Admin: list transactions with filters and pagination
app.get('/api/admin/transactions', adminAuth, async (req, res) => {
  try {
    const { status, email, q, limit = '20', offset = '0' } = req.query;
    const params = [];
    const wheres = [];
    if (status) { params.push(String(status)); wheres.push(`status = $${params.length}`); }
    if (email) { params.push(String(email)); wheres.push(`customer_email = $${params.length}`); }
    if (q) {
      const like = `%${q}%`;
      params.push(like, like);
      wheres.push(`(tx_ref ILIKE $${params.length-1} OR customer_phone ILIKE $${params.length})`);
    }
    const whereSql = wheres.length ? `WHERE ${wheres.join(' AND ')}` : '';
    const lim = Math.min(parseInt(limit, 10) || 20, 100);
    const off = Math.max(parseInt(offset, 10) || 0, 0);
    const rows = (await pool.query(
      `SELECT id, tx_ref, flw_id, amount, currency, customer_email, customer_phone, status, source, created_at, updated_at
       FROM transactions ${whereSql}
       ORDER BY created_at DESC
       LIMIT ${lim} OFFSET ${off}`,
      params
    )).rows;
    res.json({ ok: true, rows });
  } catch (e) {
    res.status(500).json({ error: 'Internal error', details: String(e) });
  }
});

// Verify Flutterwave transaction by id
app.get('/api/pay/flutterwave/verify', async (req, res) => {
  try {
    if (!FLW_SECRET_KEY) return res.status(500).json({ error: 'FLW_SECRET_KEY is not configured' });
    const id = req.query.transaction_id || req.query.id;
    if (!id) return res.status(400).json({ error: 'transaction_id is required' });
    const url = `https://api.flutterwave.com/v3/transactions/${id}/verify`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
    });
    const data = await resp.json();
    if (!resp.ok) return res.status(400).json({ error: data?.message || 'Flutterwave verify failed', details: data });
    const payload = data?.data || data;
    const tx_ref = payload?.tx_ref;
    const flw_id = payload?.id;
    const status = (payload?.status || '').toLowerCase();
    try {
      await updateTransactionFromVerify({ tx_ref, flw_id, status, raw: payload });
      if (status === 'successful') {
        await sendReceiptEmail(payload?.customer?.email || payload?.customer?.email_address, {
          tx_ref,
          amount: payload?.amount,
          currency: payload?.currency,
          status,
        });
      }
    } catch (e) {
      console.warn('Failed to persist or email after verify', e);
    }
    return res.json({ ok: true, data: payload });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error', details: String(e) });
  }
});

app.get('/api/admin/transactions/:key', adminAuth, async (req, res) => {
  try {
    const { key } = req.params;
    let row;
    if (/^\d+$/.test(key)) {
      row = (await pool.query(`SELECT * FROM transactions WHERE id=$1`, [Number(key)])).rows[0];
    } else {
      row = (await pool.query(`SELECT * FROM transactions WHERE tx_ref=$1`, [key])).rows[0];
    }
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, row });
  } catch (e) {
    res.status(500).json({ error: 'Internal error', details: String(e) });
  }
});

// Admin: resend receipt email
app.post('/api/admin/transactions/:key/resend-receipt', adminAuth, async (req, res) => {
  try {
    const { key } = req.params;
    let row;
    if (/^\d+$/.test(key)) {
      row = (await pool.query(`SELECT * FROM transactions WHERE id=$1`, [Number(key)])).rows[0];
    } else {
      row = (await pool.query(`SELECT * FROM transactions WHERE tx_ref=$1`, [key])).rows[0];
    }
    if (!row) return res.status(404).json({ error: 'Not found' });
    if (!row.customer_email) return res.status(400).json({ error: 'No customer email on record' });
    await sendReceiptEmail(row.customer_email, {
      tx_ref: row.tx_ref,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Internal error', details: String(e) });
  }
});

// Flutterwave Webhook
app.post('/api/pay/flutterwave/webhook', async (req, res) => {
  try {
    const sig = req.headers['verif-hash'] || req.headers['verif_hash'];
    if (!FLW_WEBHOOK_SECRET || !sig || sig !== FLW_WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    const event = req.body?.event;
    const payload = req.body?.data || req.body;
    const tx_ref = payload?.tx_ref;
    const flw_id = payload?.id;
    const status = (payload?.status || '').toLowerCase();
    try {
      await updateTransactionFromVerify({ tx_ref, flw_id, status, raw: payload });
      if (status === 'successful') {
        await sendReceiptEmail(payload?.customer?.email || payload?.customer?.email_address, {
          tx_ref,
          amount: payload?.amount,
          currency: payload?.currency,
          status,
        });
      }
    } catch (e) {
      console.warn('Webhook persist/email failed', e);
    }
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error', details: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
