const { setCors, handleOptions } = require('../../../lib/cors');
const { ensureSchema, insertTransactionInit } = require('../../../lib/db');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;
  setCors(req, res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const API_KEY = process.env.LYGOS_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: 'LYGOS_API_KEY is not configured' });
    const BASE = process.env.LYGOS_BASE_URL || 'https://api.lygosapp.com/v1';
    const FRONT_URL = process.env.FRONT_URL || 'http://localhost:5173';

    const { amount, currency = 'XAF', email, phone, name, message } = req.body || {};
    if (!amount) return res.status(400).json({ error: 'amount is required' });

    // Lygos utilise un order_id; on réutilise notre tx_ref comme order_id
    const tx_ref = `EXP_${Date.now()}_${Math.floor(Math.random()*10000)}`;

    try {
      await ensureSchema();
      await insertTransactionInit({ tx_ref, amount: Number(amount), currency, email, phone, source: 'lygos' });
    } catch (e) {
      console.warn('Failed to insert initial transaction', e);
    }

    const body = {
      amount: Number(amount),
      shop_name: 'Explore Cameroun',
      message: message || 'Paiement de commande',
      success_url: `${FRONT_URL}/payment/callback?order_id=${encodeURIComponent(tx_ref)}&status=successful`,
      failure_url: `${FRONT_URL}/payment/callback?order_id=${encodeURIComponent(tx_ref)}&status=failed`,
      order_id: tx_ref,
    };

    const gwResp = await fetch(`${BASE}/gateway`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      body: JSON.stringify(body),
    });
    const data = await gwResp.json();
    if (!gwResp.ok) return res.status(400).json({ error: data?.message || 'Lygos init failed', details: data });

    // Tenter de déduire le lien de paiement
    const link = data?.url || data?.payment_url || data?.link || data?.data?.url || null;

    return res.status(200).json({ ok: true, link, order_id: tx_ref, gateway: data });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error', details: String(e) });
  }
};
