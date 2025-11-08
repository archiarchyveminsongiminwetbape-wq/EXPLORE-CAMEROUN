const { setCors, handleOptions } = require('../../../lib/cors');
const { ensureSchema, insertTransactionInit } = require('../../../lib/db');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  setCors(req, res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
    if (!FLW_SECRET_KEY) return res.status(500).json({ error: 'FLW_SECRET_KEY is not configured' });
    const FRONT_URL = process.env.FRONT_URL || 'http://localhost:5173';

    const { amount, currency = 'XAF', email, phone, name } = req.body || {};
    if (!amount) return res.status(400).json({ error: 'amount is required' });

    const tx_ref = `EXP_${Date.now()}_${Math.floor(Math.random()*10000)}`;

    try {
      await ensureSchema();
      await insertTransactionInit({ tx_ref, amount: Number(amount), currency, email, phone, source: 'flutterwave' });
    } catch (e) {
      console.warn('Failed to insert initial transaction', e);
    }

    const body = {
      tx_ref,
      amount: Number(amount),
      currency,
      redirect_url: `${FRONT_URL}/payment/callback`,
      customer: {
        email: email || 'client@example.com',
        phonenumber: phone || undefined,
        name: name || 'Client',
      },
      customizations: {
        title: 'Explore Cameroun',
        description: 'Paiement de commande',
      },
    };

    const resp = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
      },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!resp.ok) return res.status(400).json({ error: data?.message || 'Flutterwave init failed', details: data });
    return res.status(200).json({ ok: true, link: data?.data?.link, tx_ref });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error', details: String(e) });
  }
};
