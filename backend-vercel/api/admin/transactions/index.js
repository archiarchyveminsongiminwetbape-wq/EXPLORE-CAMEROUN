const { setCors, handleOptions } = require('../../../lib/cors');
const { pool, ensureSchema } = require('../../../lib/db');
const { adminAuth } = require('../../../lib/auth');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  setCors(req, res);
  if (!adminAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    await ensureSchema();
    const { status, email, q, limit = '20', offset = '0' } = req.query || {};
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
    res.status(200).json({ ok: true, rows });
  } catch (e) {
    res.status(500).json({ error: 'Internal error', details: String(e) });
  }
};
