import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { supabase } from './supabaseClient.js';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const PORT = process.env.PORT || 3001;
const FRONT_URL = process.env.FRONT_URL || 'http://localhost:5173';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const LYGOS_PAYMENT_URL = process.env.LYGOS_PAYMENT_URL || 'https://pay.lygosapp.com/link/ae004d7c-a01d-439a-bddd-3551e672adf4';

// ===== FONCTIONS UTILITAIRES =====

async function ensureTransactionsTable() {
  try {
    const { error } = await supabase.rpc('create_transactions_table_if_not_exists');
const LYGOS_PAYMENT_URL = process.env.LYGOS_PAYMENT_URL || 'https://pay.lygosapp.com/link/ae004d7c-a01d-439a-bddd-3551e672adf4';
    if (error && !error.message.includes('already exists')) {
async function ensureTransactionsTable() {
        .select('id')
    // Essayer de créer la table si elle n'existe pas
    const { error } = await supabase.rpc('create_transactions_table_if_not_exists');
    if (error && !error.message.includes('already exists')) {
      console.warn('Could not ensure transactions table via RPC:', error.message);
      
      // Fallback: essayer de faire une requête simple pour vérifier l'existence
      const { error: testError } = await supabase
        .from('transactions')
        .select('id')
        .limit(1);
      
      if (testError && testError.code === 'PGRST116') {
        console.log('⚠️  La table transactions doit être créée manuellement dans Supabase');
        console.log('Structure requise:');
        console.log(`\nCREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  tx_ref VARCHAR(255) UNIQUE NOT NULL,
  flw_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'XAF',
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  source VARCHAR(50),
  raw JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);\n`);
}

      }
    }
  } catch (e) {
    console.warn('Failed to ensure transactions table:', e.message);
  }
}

// Simple admin auth
function adminAuth(req, res, next) {
  if (!ADMIN_TOKEN) return next();
  const token = req.headers['x-admin-token'];
  if (token && token === ADMIN_TOKEN) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

ensureTransactionsTable().catch((e) => {
  console.error('Failed to ensure schema', e);
});

async function insertTransactionInit({ tx_ref, amount, currency, email, phone, source }) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .upsert({
        tx_ref,
        amount: Number(amount),
        currency: currency || 'XAF',
        customer_email: email || null,
        customer_phone: phone || null,
        status: 'initialized',
        source: source || 'lygos',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'tx_ref'
      })
      .select()
      .single();
    console.warn('Failed to insert transaction init', e);
    
    if (error) {
      console.warn('Failed to insert transaction:', error);
      return null;
    }
    return data;
  } catch (e) {
    console.warn('Failed to insert transaction init:', e);
    return null;
  }
}

async function updateTransactionStatus({ tx_ref, status, raw, flw_id }) {
  try {
    const updateData = {
      status,
      })
      updated_at: new Date().toISOString()
    };
    
    if (raw) updateData.raw = raw;
    if (flw_id) updateData.flw_id = flw_id;

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('tx_ref', tx_ref)
      .select()
      .single();
    
    if (error) {
      console.warn('Failed to update transaction:', error);
      return null;
    }
    return data;
  } catch (e) {
    console.warn('Failed to update transaction status:', e);
    return null;
  }
  }
}

function buildMailer() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { 
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS 
    },
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    }
  });
}

async function sendReceiptEmail(to, payload) {
  const transporter = buildMailer();
  if (!transporter || !to) return;
  const text = `Merci pour votre paiement.\\n\\nRéférence: ${payload?.tx_ref}\\nMontant: ${payload?.amount} ${payload?.currency}\\nStatut: ${payload?.status}\\n`;

  const subject = `Reçu de paiement - ${payload?.tx_ref || ''}`;
  const text = `Merci pour votre paiement.\\n\\nRéférence: ${payload?.tx_ref}\\nMontant: ${payload?.amount} ${payload?.currency}\\nStatut: ${payload?.status}\\n`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text
    text,
    text
  };

  if (PDFDocument) {
    try {
      const buf = await generateReceiptPdfBuffer({
        currency: payload?.currency,
        status: payload?.status,
        email: to
      });
        tx_ref: payload?.tx_ref,
        amount: payload?.amount,
        currency: payload?.currency,
        status: payload?.status,
        status: payload?.status,
    } catch (e) {
      });
        content: buf 
      }];
        status: payload?.status,
    } catch (e) {
      console.warn('PDF generation failed, sending email without attachment:', e);
      });
      mailOptions.attachments = [{ 
        content: buf 
      }];
    } catch (e) {
      console.warn('PDF generation failed, sending email without attachment', e);
    }
    
  }


  await transporter.sendMail(mailOptions);
      }];
    } catch (e) {
      console.warn('PDF generation failed, sending email without attachment', e);
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
// ===== INITIALISATION =====

// Initialiser la table au démarrage
ensureTransactionsTable().catch((e) => {
  console.error('Failed to ensure schema:', e);
});

// ===== ROUTES =====

// Endpoint pour vérifier l'état du serveur
    doc.moveDown();
  res.json({ 
    status: 'ok',
    services: {
      supabase: 'connected',
      lygos: 'ready'
    }
  });
});

    const now = new Date();
    doc.text(`Date: ${now.toLocaleString()}`);

  try {
    doc.text('Merci pour votre confiance.', { align: 'left' });

    doc.end();
  });
}
      paymentUrl: LYGOS_PAYMENT_URL,
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
  });
app.post('/api/pay/lygos/init', async (req, res) => {
  try {

// Route principale pour obtenir le lien de paiement Lygos
app.get('/api/payment/lygos', (req, res) => {
      return res.status(400).json({ 
        ok: false, 
        error: 'Amount is required' 

  try {
    const { order_id, tx_ref } = req.query;
    const ref = order_id || tx_ref;
      paymentUrl: LYGOS_PAYMENT_URL,
    if (!ref) {
    // Créer une référence unique pour la transaction
    const tx_ref = `LYGOS_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      return res.status(400).json({ 
      raw: { verified_at: new Date().toISOString(), method: 'lygos' }
    });

    await insertTransactionInit({
      tx_ref,
      amount: Number(amount),
      currency,
      .from('transactions')
      .eq('tx_ref', ref)
      await sendReceiptEmail(transaction.customer_email, {
        tx_ref: ref,
        currency: transaction.currency,
        status,
      link: LYGOS_PAYMENT_URL,
    }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du lien de paiement:', error);
    res.status(500).json({ 
      link: LYGOS_PAYMENT_URL,
      tx_ref,
      message: 'Paiement initialisé avec succès'
    });
  } catch (error) {
      success: false, 
        tx_ref: ref,
        status,
    res.status(500).json({
      ok: false,
    });
  }
});

app.post('/api/pay/lygos/init', async (req, res) => {
  try {
    const { phone, amount, currency = 'XAF', email, name } = req.body;

    if (!amount) {
        ok: false, 
        error: 'Amount is required' 
      });
    }
        error: 'Amount is required' 
    // Pour Lygos, nous simulons une vérification réussie
    const { tx_ref, status, amount, currency } = req.body;

    const status = 'successful';

    if (!LYGOS_PAYMENT_URL) {
      return res.status(500).json({ 
        ok: false, 
        error: 'URL de paiement Lygos non configurée' 
      });
    }

    // Créer une référence unique pour la transaction
    const tx_ref = `LYGOS_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // Mettre à jour le statut
    await updateTransactionStatus({
    // Enregistrer la transaction dans Supabase
      status,
      raw: { verified_at: new Date().toISOString(), method: 'lygos' }
    });

    await insertTransactionInit({
      tx_ref,
      amount: Number(amount),
      currency,
      email,
    // Envoyer le reçu par email si disponible
      phone,
      source: 'lygos'
      await sendReceiptEmail(transaction.customer_email, {
        tx_ref: ref,
        currency: transaction.currency,
        status,
    }
    });

    res.json({
      ok: true,
      link: LYGOS_PAYMENT_URL,
      tx_ref,
      message: 'Paiement initialisé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\\'initialisation du paiement Lygos:', error);
        tx_ref: ref,
        status,
    res.status(500).json({
      ok: false,
      error: 'Erreur lors de l\\'initialisation du paiement',
        currency: transaction.currency,
        payment_method: 'lygos'
      }
      details: error.message
    });
        status: status || 'completed',
        raw: req.body
});

});

app.get('/api/pay/lygos/verify', async (req, res) => {
  try {
    const { order_id, tx_ref } = req.query;
    const ref = order_id || tx_ref;
  }

    if (!ref) {
      return res.status(400).json({ 
        ok: false, 
        error: 'order_id ou tx_ref requis' 
      });
    }
    const { tx_ref, status, amount, currency } = req.body;

    // Récupérer la transaction depuis Supabase
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('tx_ref', ref)
      .single();

    if (error || !transaction) {
          status,
          status
        ok: false, 
        error: 'Transaction non trouvée' 
    }

    // Pour Lygos, nous simulons une vérification réussie
    // Dans un vrai scénario, vous feriez un appel API à Lygos pour vérifier
    const status = 'successful';
      query = query.eq('customer_email', email);
    }
  }
});
    await updateTransactionStatus({
      tx_ref: ref,
    const { status, email, q, limit = '20', offset = '0' } = req.query;
    });

    // Envoyer le reçu par email si disponible
    if (status === 'successful' && transaction.customer_email) {
      await sendReceiptEmail(transaction.customer_email, {
        tx_ref: ref,
        amount: transaction.amount,
        currency: transaction.currency,
        status,
        status
      });
    }

    res.json({
      ok: true,
        tx_ref: ref,
      throw error;
    }
        amount: transaction.amount,
    const lim = Math.min(parseInt(limit, 10) || 20, 100);
    const off = Math.max(parseInt(offset, 10) || 0, 0);
        currency: transaction.currency,
    res.json({ ok: true, rows: rows || [] });

    });
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    res.status(500).json({
      ok: false,
      error: 'Erreur lors de la vérification',
    });
  }
    }
  } catch (e) {
        raw: req.body
});
});
// Webhook Lygos
    if (error || !row) {
      // Récupérer les détails de la transaction pour l'email
    const { key } = req.params;


      await updateTransactionStatus({
        tx_ref,
        status: status || 'completed',
        raw: req.body,
      });
      tx_ref: row.tx_ref,
    }
      // Récupérer les détails de la transaction pour l'email
      const { data: transaction } = await supabase
        .from('transactions')
        .select('customer_email')
        .eq('tx_ref', tx_ref)
        .single();

    }

// Admin: renvoyer le reçu par email
app.post('/api/admin/transactions/:key/resend-receipt', adminAuth, async (req, res) => {
  try {
    const { key } = req.params;

    res.json({ ok: true });
  } catch (error) {
    console.error('Erreur webhook Lygos:', error);
    res.status(500).json({ ok: false, error: error.message });
  try {
    } else {
    }
    }
  }


// Admin: liste des transactions
      query = query.or(`tx_ref.ilike.%${q}%,customer_phone.ilike.%${q}%`);
    }
app.get('/api/admin/transactions', adminAuth, async (req, res) => {
  try {
    const { status, email, q, limit = '20', offset = '0' } = req.query;


    let query = supabase
    });
      query = query.eq('status', status);

    const { data: row, error } = await query.single();

    res.json({ ok: true });
  } catch (e) {
      query = query.eq('customer_email', email);
    if (q) {
      query = query.or(`tx_ref.ilike.%${q}%,customer_phone.ilike.%${q}%`);
      throw error;
      amount: row.amount,
  try {

    const lim = Math.min(parseInt(limit, 10) || 20, 100);
    const off = Math.max(parseInt(offset, 10) || 0, 0);

    res.json({ ok: true, rows: rows || [] });

    query = query.range(off, off + lim - 1);


    if (error) {
      throw error;
    } else {
    }
    }

  } catch (e) {
    console.error('Erreur admin transactions:', e);
    res.status(500).json({ error: 'Internal error', details: String(e) });
    const { data: row, error } = await query.single();
      email: row.customer_email,
      email: row.customer_email
});

    if (error || !row) {
// Admin: détails d'une transaction
      return res.status(404).json({ error: 'Not found' });
  } catch (e) {
    }
app.get('/api/admin/transactions/:key', adminAuth, async (req, res) => {
  }
});

// ===== DÉMARRAGE DU SERVEUR =====

app.listen(PORT, () => {
  try {
    const { key } = req.params;

});
    let query = supabase.from('transactions').select('*');

    if (/^\\d+$/.test(key)) {
      query = query.eq('id', Number(key));

    } else {
      query = query.eq('tx_ref', key);
      tx_ref: row.tx_ref,
    }

    const { data: row, error } = await query.single();

    if (error || !row) {
      return res.status(404).json({ error: 'Not found' });
    }

      currency: row.currency,
      status: row.status,
    console.error('Erreur admin transaction détail:', e);
    });

    res.json({ ok: true });
    res.json({ ok: true, row });
  } catch (e) {
// Admin: renvoyer le reçu par email
    console.error('Erreur admin transaction détail:', e);
    res.status(500).json({ error: 'Internal error', details: String(e) });
  }
});

// Admin: renvoyer le reçu par email
app.post('/api/admin/transactions/:key/resend-receipt', adminAuth, async (req, res) => {
  try {
    const { key } = req.params;

    let query = supabase.from('transactions').select('*');

    if (/^\\d+$/.test(key)) {
      query = query.eq('id', Number(key));
  try {
    } else {
      query = query.eq('tx_ref', key);
    }


    const { data: row, error } = await query.single();

    if (error || !row) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (!row.customer_email) {
      return res.status(400).json({ error: 'No customer email on record' });
    }

    if (/^\\d+$/.test(key)) {
      query = query.eq('id', Number(key));
    } else {
      query = query.eq('tx_ref', key);
    }
    await sendReceiptEmail(row.customer_email, {
      tx_ref: row.tx_ref,
      amount: row.amount,
      currency: row.currency,
      status: row.status
    });


    const { data: row, error } = await query.single();

    res.json({ ok: true });
  } catch (e) {
    console.error('Erreur resend receipt:', e);
    if (error || !row) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.status(500).json({ error: 'Internal error', details: String(e) });
  }
});

// Endpoint pour générer un PDF de reçu
app.get('/api/admin/transactions/:key/pdf', adminAuth, async (req, res) => {
      amount: row.amount,
  try {
    const { key } = req.params;

    let query = supabase.from('transactions').select('*');

    if (/^\\d+$/.test(key)) {
      query = query.eq('id', Number(key));
    } else {
      query = query.eq('tx_ref', key);
    });
    }

    const { data: row, error } = await query.single();

    if (error || !row) {
      return res.status(404).json({ error: 'Not found' });
    }


    const pdfBuffer = await generateReceiptPdfBuffer({
      tx_ref: row.tx_ref,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
      email: row.customer_email,
      email: row.customer_email
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=\"receipt_${row.tx_ref}.pdf\"`);
    res.send(pdfBuffer);
  } catch (e) {
    console.error('Erreur PDF generation:', e);
    res.status(500).json({ error: 'Internal error', details: String(e) });
  }
});

// ===== DÉMARRAGE DU SERVEUR =====

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`💳 Lygos payment URL: ${LYGOS_PAYMENT_URL}`);
  console.log(`🌐 Frontend URL: ${FRONT_URL}`);
});
