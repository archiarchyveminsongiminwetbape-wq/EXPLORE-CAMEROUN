const { setCors, handleOptions } = require('../../lib/cors');

module.exports = (req, res) => {
  if (handleOptions(req, res)) return;
  setCors(req, res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { phone, amount } = req.body || {};
  if (!phone || !amount) return res.status(400).json({ error: 'phone and amount are required' });
  return res.status(200).json({ ok: true, method: 'mtn', message: `Paiement MTN de ${amount} XAF initié pour ${phone}` });
};
