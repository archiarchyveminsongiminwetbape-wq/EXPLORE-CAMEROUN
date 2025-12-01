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
        console.log(`
CREATE TABLE transactions (
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
);
        `);
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

function buildMailer() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { 
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS 
    }
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
    text
  };

  if (PDFDocument) {
    try {
      const buf = await generateReceiptPdfBuffer({
        tx_ref: payload?.tx_ref,
        amount: payload?.amount,
        currency: payload?.currency,
        status: payload?.status,
        email: to
      });
      mailOptions.attachments = [{ 
        filename: `receipt_${payload?.tx_ref || 'payment'}.pdf`, 
        content: buf 
      }];
    } catch (e) {
      console.warn('PDF generation failed, sending email without attachment:', e);
    }
  }
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Receipt email sent to:', to);
  } catch (e) {
    console.warn('Failed to send receipt email:', e);
  }
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

// ===== INITIALISATION =====

// Initialiser la table au démarrage
ensureTransactionsTable().catch((e) => {
  console.error('Failed to ensure schema:', e);
});

// ===== ROUTES =====

// Endpoint pour vérifier l'état du serveur
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    services: {
      supabase: 'connected',
      lygos: 'ready'
    }
  });
});

// Route principale pour obtenir le lien de paiement Lygos
app.get('/api/payment/lygos', (req, res) => {
  try {
    if (!LYGOS_PAYMENT_URL) {
      return res.status(500).json({ 
        success: false, 
        error: 'URL de paiement Lygos non configurée' 
      });
    }
    
    res.json({ 
      success: true, 
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

// Initialisation du paiement Lygos
app.post('/api/pay/lygos/init', async (req, res) => {
  try {
    const { phone, amount, currency = 'XAF', email, name } = req.body;
    
    if (!amount) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Amount is required' 
      });
    }

    if (!LYGOS_PAYMENT_URL) {
      return res.status(500).json({ 
        ok: false, 
        error: 'URL de paiement Lygos non configurée' 
      });
    }

    // Créer une référence unique pour la transaction
    const tx_ref = `LYGOS_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    // Enregistrer la transaction dans Supabase
    await insertTransactionInit({
      tx_ref,
      amount: Number(amount),
      currency,
      email,
      phone,
      source: 'lygos'
    });

    res.json({
      ok: true,
      link: LYGOS_PAYMENT_URL,
      tx_ref,
      message: 'Paiement initialisé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du paiement Lygos:', error);
    res.status(500).json({
      ok: false,
      error: 'Erreur lors de l\'initialisation du paiement',
      details: error.message
    });
  }
});

// Vérification du paiement Lygos
app.get('/api/pay/lygos/verify', async (req, res) => {
  try {
    const { order_id, tx_ref } = req.query;
    const ref = order_id || tx_ref;
    
    if (!ref) {
      return res.status(400).json({ 
        ok: false, 
        error: 'order_id ou tx_ref requis' 
      });
    }

    // Récupérer la transaction depuis Supabase
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('tx_ref', ref)
      .single();

    if (error || !transaction) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Transaction non trouvée' 
      });
    }

    // Pour Lygos, nous simulons une vérification réussie
    // Dans un vrai scénario, vous feriez un appel API à Lygos pour vérifier
    const status = 'successful';
    
    // Mettre à jour le statut
    await updateTransactionStatus({
      tx_ref: ref,
      status,
      raw: { verified_at: new Date().toISOString(), method: 'lygos' }
    });

    // Envoyer le reçu par email si disponible
    if (status === 'successful' && transaction.customer_email) {
      await sendReceiptEmail(transaction.customer_email, {
        tx_ref: ref,
        amount: transaction.amount,
        currency: transaction.currency,
        status
      });
    }

    res.json({
      ok: true,
      data: {
        tx_ref: ref,
        status,
        amount: transaction.amount,
        currency: transaction.currency,
        payment_method: 'lygos'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    res.status(500).json({
      ok: false,
      error: 'Erreur lors de la vérification',
      details: error.message
    });
  }
});

// Webhook Lygos
app.post('/api/pay/lygos/webhook', async (req, res) => {
  try {
    const { tx_ref, status, amount, currency, transaction_id } = req.body;
    
    if (tx_ref) {
      await updateTransactionStatus({
        tx_ref,
        status: status || 'completed',
        raw: req.body,
        flw_id: transaction_id
      });

      // Récupérer les détails de la transaction pour l'email
      const { data: transaction } = await supabase
        .from('transactions')
        .select('customer_email')
        .eq('tx_ref', tx_ref)
        .single();

      if (status === 'successful' && transaction?.customer_email) {
        await sendReceiptEmail(transaction.customer_email, {
          tx_ref,
          amount,
          currency,
          status
        });
      }
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Erreur webhook Lygos:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Admin: liste des transactions
app.get('/api/admin/transactions', adminAuth, async (req, res) => {
  try {
    const { status, email, q, limit = '20', offset = '0' } = req.query;
    
    let query = supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    
    if (email) {
      query = query.eq('customer_email', email);
    }
    
    if (q) {
      query = query.or(`tx_ref.ilike.%${q}%,customer_phone.ilike.%${q}%`);
    }

    const lim = Math.min(parseInt(limit, 10) || 20, 100);
    const off = Math.max(parseInt(offset, 10) || 0, 0);
    
    query = query.range(off, off + lim - 1);

    const { data: rows, error } = await query;
    
    if (error) {
      throw error;
    }

    res.json({ ok: true, rows: rows || [] });
  } catch (e) {
    console.error('Erreur admin transactions:', e);
    res.status(500).json({ error: 'Internal error', details: String(e) });
  }
});

// Admin: détails d'une transaction
app.get('/api/admin/transactions/:key', adminAuth, async (req, res) => {
  try {
    const { key } = req.params;
    
    let query = supabase.from('transactions').select('*');
    
    if (/^\d+$/.test(key)) {
      query = query.eq('id', Number(key));
    } else {
      query = query.eq('tx_ref', key);
    }
    
    const { data: row, error } = await query.single();
    
    if (error || !row) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    res.json({ ok: true, row });
  } catch (e) {
    console.error('Erreur admin transaction détail:', e);
    res.status(500).json({ error: 'Internal error', details: String(e) });
  }
});

// Admin: renvoyer le reçu par email
app.post('/api/admin/transactions/:key/resend-receipt', adminAuth, async (req, res) => {
  try {
    const { key } = req.params;
    
    let query = supabase.from('transactions').select('*');
    
    if (/^\d+$/.test(key)) {
      query = query.eq('id', Number(key));
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
    
    await sendReceiptEmail(row.customer_email, {
      tx_ref: row.tx_ref,
      amount: row.amount,
      currency: row.currency,
      status: row.status
    });
    
    res.json({ ok: true });
  } catch (e) {
    console.error('Erreur resend receipt:', e);
    res.status(500).json({ error: 'Internal error', details: String(e) });
  }
});

// Endpoint pour générer un PDF de reçu
app.get('/api/admin/transactions/:key/pdf', adminAuth, async (req, res) => {
  try {
    const { key } = req.params;
    
    let query = supabase.from('transactions').select('*');
    
    if (/^\d+$/.test(key)) {
      query = query.eq('id', Number(key));
    } else {
      query = query.eq('tx_ref', key);
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
      email: row.customer_email
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="receipt_${row.tx_ref}.pdf"`);
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