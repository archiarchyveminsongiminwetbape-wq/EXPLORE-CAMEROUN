const { setCors, handleOptions } = require('../lib/cors');
const { pool, ensureSchema, insertTransactionInit, updateTransactionFromVerify } = require('../lib/db');
const { adminAuth } = require('../lib/auth');
const { sendReceiptEmail, generateReceiptPdfBuffer } = require('../lib/mail');

async function parseBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
    });
  });
}

function sendJson(res, code, obj) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(obj));
}

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  setCors(req, res);

  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.replace(/^\/api\/?/, '');
  const slug = path ? path.split('/').filter(Boolean) : [];
  const method = req.method;

  // HEALTH
  if (method === 'GET' && slug.length === 1 && slug[0] === 'health') {
    return sendJson(res, 200, { status: 'ok' });
  }

  // CONFIG
  const LYGOS_BASE = process.env.LYGOS_BASE_URL || 'https://api.lygosapp.com/v1';
  const LYGOS_KEY = process.env.LYGOS_API_KEY;
  const FRONT_URL = process.env.FRONT_URL || 'http://localhost:5173';

  // LYGOS INIT: POST /api/pay/lygos/init
  if (slug[0] === 'pay' && slug[1] === 'lygos' && slug[2] === 'init' && method === 'POST') {
    try {
      if (!LYGOS_KEY) return sendJson(res, 500, { error: 'LYGOS_API_KEY is not configured' });
      const body = await parseBody(req);
      const { amount, currency = 'XAF', email, phone, name, message } = body || {};
      if (!amount) return sendJson(res, 400, { error: 'amount is required' });
      const tx_ref = `EXP_${Date.now()}_${Math.floor(Math.random()*10000)}`;
      try {
        await ensureSchema();
        await insertTransactionInit({ tx_ref, amount: Number(amount), currency, email, phone, source: 'lygos' });
      } catch (e) { console.warn('Failed to insert initial transaction', e); }
      const payload = {
        amount: Number(amount),
        shop_name: 'Explore Cameroun',
        message: message || 'Paiement de commande',
        success_url: `${FRONT_URL}/payment/callback?order_id=${encodeURIComponent(tx_ref)}&status=successful`,
        failure_url: `${FRONT_URL}/payment/callback?order_id=${encodeURIComponent(tx_ref)}&status=failed`,
        order_id: tx_ref,
      };
      const gwResp = await fetch(`${LYGOS_BASE}/gateway`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': LYGOS_KEY },
        body: JSON.stringify(payload),
      });
      const data = await gwResp.json();
      if (!gwResp.ok) return sendJson(res, 400, { error: data?.message || 'Lygos init failed', details: data });
      const link = data?.url || data?.payment_url || data?.link || data?.data?.url || null;
      return sendJson(res, 200, { ok: true, link, order_id: tx_ref, gateway: data });
    } catch (e) {
      return sendJson(res, 500, { error: 'Internal error', details: String(e) });
    }
  }

  // LYGOS VERIFY: GET /api/pay/lygos/verify?order_id=...
  if (slug[0] === 'pay' && slug[1] === 'lygos' && slug[2] === 'verify' && method === 'GET') {
    try {
      if (!LYGOS_KEY) return sendJson(res, 500, { error: 'LYGOS_API_KEY is not configured' });
      const order_id = url.searchParams.get('order_id') || url.searchParams.get('id');
      if (!order_id) return sendJson(res, 400, { error: 'order_id is required' });
      const vResp = await fetch(`${LYGOS_BASE}/gateway/payin/${encodeURIComponent(order_id)}`, {
        headers: { 'api-key': LYGOS_KEY },
      });
      const data = await vResp.json();
      if (!vResp.ok) return sendJson(res, 400, { error: data?.message || 'Lygos verify failed', details: data });
      const payload = data?.data || data;
      const status = (payload?.status || payload?.payment_status || '').toLowerCase();
      const tx_ref = order_id;
      try {
        await ensureSchema();
        await updateTransactionFromVerify({ tx_ref, flw_id: payload?.id || null, status, raw: payload });
        if (['successful', 'success', 'paid'].includes(status)) {
          const email = payload?.customer_email || payload?.email || null;
          if (email) {
            await sendReceiptEmail(email, {
              tx_ref,
              amount: payload?.amount,
              currency: payload?.currency || 'XAF',
              status,
            });
          }
        }
      } catch (e) { console.warn('Persist/email after verify failed', e); }
      return sendJson(res, 200, { ok: true, data: payload });
    } catch (e) {
      return sendJson(res, 500, { error: 'Internal error', details: String(e) });
    }
  }

  // ADMIN LIST: GET /api/admin/transactions
  if (slug[0] === 'admin' && slug[1] === 'transactions' && slug.length === 2 && method === 'GET') {
    if (!adminAuth(req)) return sendJson(res, 401, { error: 'Unauthorized' });
    try {
      await ensureSchema();
      const q = url.searchParams;
      const status = q.get('status');
      const email = q.get('email');
      const search = q.get('q');
      const limit = Math.min(parseInt(q.get('limit') || '20', 10), 100);
      const offset = Math.max(parseInt(q.get('offset') || '0', 10), 0);
      const params = [];
      const wheres = [];
      if (status) { params.push(String(status)); wheres.push(`status = $${params.length}`); }
      if (email) { params.push(String(email)); wheres.push(`customer_email = $${params.length}`); }
      if (search) { const like = `%${search}%`; params.push(like, like); wheres.push(`(tx_ref ILIKE $${params.length-1} OR customer_phone ILIKE $${params.length})`); }
      const whereSql = wheres.length ? `WHERE ${wheres.join(' AND ')}` : '';
      const rows = (await pool.query(
        `SELECT id, tx_ref, flw_id, amount, currency, customer_email, customer_phone, status, source, created_at, updated_at
         FROM transactions ${whereSql}
         ORDER BY created_at DESC
         LIMIT ${limit} OFFSET ${offset}`,
        params
      )).rows;
      return sendJson(res, 200, { ok: true, rows });
    } catch (e) {
      return sendJson(res, 500, { error: 'Internal error', details: String(e) });
    }
  }

  // ADMIN DETAIL: GET /api/admin/transactions/:key
  if (slug[0] === 'admin' && slug[1] === 'transactions' && slug[2] && slug.length === 3 && method === 'GET') {
    if (!adminAuth(req)) return sendJson(res, 401, { error: 'Unauthorized' });
    try {
      await ensureSchema();
      const key = slug[2];
      let row;
      if (/^\d+$/.test(key)) row = (await pool.query('SELECT * FROM transactions WHERE id=$1', [Number(key)])).rows[0];
      else row = (await pool.query('SELECT * FROM transactions WHERE tx_ref=$1', [key])).rows[0];
      if (!row) return sendJson(res, 404, { error: 'Not found' });
      return sendJson(res, 200, { ok: true, row });
    } catch (e) {
      return sendJson(res, 500, { error: 'Internal error', details: String(e) });
    }
  }

  // ADMIN RESEND: POST /api/admin/transactions/:key/resend-receipt
  if (slug[0] === 'admin' && slug[1] === 'transactions' && slug[2] && slug[3] === 'resend-receipt' && method === 'POST') {
    if (!adminAuth(req)) return sendJson(res, 401, { error: 'Unauthorized' });
    try {
      await ensureSchema();
      const key = slug[2];
      let row;
      if (/^\d+$/.test(key)) row = (await pool.query('SELECT * FROM transactions WHERE id=$1', [Number(key)])).rows[0];
      else row = (await pool.query('SELECT * FROM transactions WHERE tx_ref=$1', [key])).rows[0];
      if (!row) return sendJson(res, 404, { error: 'Not found' });
      if (!row.customer_email) return sendJson(res, 400, { error: 'No customer email on record' });
      await sendReceiptEmail(row.customer_email, {
        tx_ref: row.tx_ref,
        amount: row.amount,
        currency: row.currency,
        status: row.status,
      });
      return sendJson(res, 200, { ok: true });
    } catch (e) {
      return sendJson(res, 500, { error: 'Internal error', details: String(e) });
    }
  }

  // ADMIN RECEIPT: GET /api/admin/transactions/:key/receipt
  if (slug[0] === 'admin' && slug[1] === 'transactions' && slug[2] && slug[3] === 'receipt' && method === 'GET') {
    if (!adminAuth(req)) return sendJson(res, 401, { error: 'Unauthorized' });
    try {
      await ensureSchema();
      const key = slug[2];
      let row;
      if (/^\d+$/.test(key)) row = (await pool.query('SELECT * FROM transactions WHERE id=$1', [Number(key)])).rows[0];
      else row = (await pool.query('SELECT * FROM transactions WHERE tx_ref=$1', [key])).rows[0];
      if (!row) return sendJson(res, 404, { error: 'Not found' });
      const buf = await generateReceiptPdfBuffer({
        tx_ref: row.tx_ref,
        amount: row.amount,
        currency: row.currency,
        status: row.status,
        email: row.customer_email,
      });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=receipt_${row.tx_ref}.pdf`);
      return res.end(buf);
    } catch (e) {
      return sendJson(res, 500, { error: 'Internal error', details: String(e) });
    }
  }

  // ADMIN REFUND (mock): POST /api/admin/transactions/:key/refund
  if (slug[0] === 'admin' && slug[1] === 'transactions' && slug[2] && slug[3] === 'refund' && method === 'POST') {
    if (!adminAuth(req)) return sendJson(res, 401, { error: 'Unauthorized' });
    try {
      await ensureSchema();
      const key = slug[2];
      let row;
      if (/^\d+$/.test(key)) row = (await pool.query('SELECT * FROM transactions WHERE id=$1', [Number(key)])).rows[0];
      else row = (await pool.query('SELECT * FROM transactions WHERE tx_ref=$1', [key])).rows[0];
      if (!row) return sendJson(res, 404, { error: 'Not found' });
      return sendJson(res, 200, { ok: true, message: 'Refund requested (mock)' });
    } catch (e) {
      return sendJson(res, 500, { error: 'Internal error', details: String(e) });
    }
  }

  return sendJson(res, 404, { error: 'Not Found' });
};
