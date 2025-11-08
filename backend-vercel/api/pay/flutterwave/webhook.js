const { setCors, handleOptions } = require('../../../lib/cors');
const { ensureSchema, updateTransactionFromVerify } = require('../../../lib/db');
const { sendReceiptEmail } = require('../../../lib/mail');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  setCors(req, res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const FLW_WEBHOOK_SECRET = process.env.FLW_WEBHOOK_SECRET || process.env.FLW_SECRET_HASH;
    const sig = req.headers['verif-hash'] || req.headers['verif_hash'];
    if (!FLW_WEBHOOK_SECRET || !sig || sig !== FLW_WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    const payload = req.body?.data || req.body;
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
      console.warn('Webhook persist/email failed', e);
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error', details: String(e) });
  }
};
