const { setCors, handleOptions } = require('../../lib/cors');

module.exports = (req, res) => {
  if (handleOptions(req, res)) return;
  setCors(req, res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { number, expiry, cvc, amount, email } = req.body || {};
  if (!number || !expiry || !cvc || !amount) return res.status(400).json({ error: 'number, expiry, cvc, amount are required' });
  return res.status(200).json({ ok: true, method: 'card', message: `Paiement carte de ${amount} validé pour ${email || 'client'}` });
};
