const { setCors, handleOptions } = require('../../../lib/cors');
const { ensureSchema, updateTransactionFromVerify } = require('../../../lib/db');
const { sendReceiptEmail } = require('../../../lib/mail');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  setCors(req, res);
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
    if (!FLW_SECRET_KEY) return res.status(500).json({ error: 'FLW_SECRET_KEY is not configured' });
    const id = req.query.transaction_id || req.query.id;
    if (!id) return res.status(400).json({ error: 'transaction_id is required' });

    const resp = await fetch(`https://api.flutterwave.com/v3/transactions/${id}/verify`, {
      headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
    });
    const data = await resp.json();
    if (!resp.ok) return res.status(400).json({ error: data?.message || 'Flutterwave verify failed', details: data });

    const payload = data?.data || data;
    const tx_ref = payload?.tx_ref;
    const flw_id = payload?.id;
    const status = (payload?.status || '').toLowerCase();

    try {
      await ensureSchema();
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
      console.warn('Persist/email after verify failed', e);
    }

    return res.status(200).json({ ok: true, data: payload });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error', details: String(e) });
  }
};
