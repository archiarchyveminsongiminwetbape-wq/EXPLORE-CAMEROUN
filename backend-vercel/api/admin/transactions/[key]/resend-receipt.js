const { setCors, handleOptions } = require('../../../../lib/cors');
const { pool, ensureSchema } = require('../../../../lib/db');
const { adminAuth } = require('../../../../lib/auth');
const { sendReceiptEmail } = require('../../../../lib/mail');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  setCors(req, res);
  if (!adminAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    await ensureSchema();
    const { key } = req.query;
    let row;
    if (/^\d+$/.test(key)) {
      row = (await pool.query('SELECT * FROM transactions WHERE id=$1', [Number(key)])).rows[0];
    } else {
      row = (await pool.query('SELECT * FROM transactions WHERE tx_ref=$1', [key])).rows[0];
    }
    if (!row) return res.status(404).json({ error: 'Not found' });
    if (!row.customer_email) return res.status(400).json({ error: 'No customer email on record' });
    await sendReceiptEmail(row.customer_email, {
      tx_ref: row.tx_ref,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
    });
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Internal error', details: String(e) });
  }
};
