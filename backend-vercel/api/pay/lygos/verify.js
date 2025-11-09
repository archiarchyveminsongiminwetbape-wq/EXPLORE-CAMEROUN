const { setCors, handleOptions } = require('../../../lib/cors');
const { ensureSchema, updateTransactionFromVerify } = require('../../../lib/db');
const { sendReceiptEmail } = require('../../../lib/mail');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  setCors(req, res);
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const API_KEY = process.env.LYGOS_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: 'LYGOS_API_KEY is not configured' });
    const BASE = process.env.LYGOS_BASE_URL || 'https://api.lygosapp.com/v1';

    const order_id = req.query.order_id || req.query.id;
    if (!order_id) return res.status(400).json({ error: 'order_id is required' });

    const resp = await fetch(`${BASE}/gateway/payin/${encodeURIComponent(order_id)}`, {
      headers: { 'api-key': API_KEY },
    });
    const data = await resp.json();
    if (!resp.ok) return res.status(400).json({ error: data?.message || 'Lygos verify failed', details: data });

    const payload = data?.data || data;
    // Normaliser le statut
    const status = (payload?.status || payload?.payment_status || '').toLowerCase();
    const tx_ref = order_id;

    try {
      await ensureSchema();
      await updateTransactionFromVerify({ tx_ref, flw_id: payload?.id || null, status, raw: payload });
      if (status === 'successful' || status === 'success' || status === 'paid') {
        const email = payload?.customer_email || payload?.email || undefined;
        if (email) {
          await sendReceiptEmail(email, {
            tx_ref,
            amount: payload?.amount,
            currency: payload?.currency || 'XAF',
            status,
          });
        }
      }
    } catch (e) {
      console.warn('Persist/email after Lygos verify failed', e);
    }

    return res.status(200).json({ ok: true, data: payload });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error', details: String(e) });
  }
};
