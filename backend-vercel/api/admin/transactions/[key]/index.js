const { setCors, handleOptions } = require('../../../../lib/cors');
const { pool, ensureSchema } = require('../../../../lib/db');
const { adminAuth } = require('../../../../lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  setCors(req, res);
  if (!adminAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    await ensureSchema();
    const { key } = req.query; // Vercel provides dynamic param as query.key
    let row;
    if (/^\d+$/.test(key)) {
      row = (await pool.query('SELECT * FROM transactions WHERE id=$1', [Number(key)])).rows[0];
    } else {
      row = (await pool.query('SELECT * FROM transactions WHERE tx_ref=$1', [key])).rows[0];
    }
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ ok: true, row });
  } catch (e) {
    res.status(500).json({ error: 'Internal error', details: String(e) });
  }
};
