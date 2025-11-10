import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Pied de page';
import { Button } from '@/components/interface utilisateur/button';
import { Input } from '@/components/interface utilisateur/input';
import { useCart } from '@/crochets/utiliser-panier';
import { useI18n } from '@/crochets/utiliser-i18n';

export default function PayOrange() {
  const { totalXaf } = useCart();
  const { t } = useI18n();
  const [phone, setPhone] = React.useState('');
  const [amount, setAmount] = React.useState<string>(() => String(totalXaf || ''));
  const [processing, setProcessing] = React.useState(false);
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3001';
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const phoneValid = /^\d{9}$/.test(phone.trim());
  const amountValid = Number(amount) > 0;
  const canSubmit = phoneValid && amountValid && !processing;
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };
  const confirmPayment = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/api/pay/lygos/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: Number(amount), currency: 'XAF' }),
      });
      const data = await res.json();
      if (data?.ok && data?.link) {
        window.open(data.link, '_blank', 'noopener');
        return;
      }
      alert(data?.error || 'Impossible d’initier le paiement');
    } catch (e) {
      alert('Erreur de paiement');
    } finally {
      setProcessing(false);
      setConfirmOpen(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-semibold mb-4">{t('pay_orange_title')}</h1>
        <div className="mb-6">
          <img src="/assets/orange.jpeg" alt="Orange Money" className="h-16 w-auto object-contain" />
        </div>
        <form onSubmit={onSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm mb-1">{t('label_phone_orange')}</label>
            <Input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="69x xxx xxx" />
            <p className="text-xs text-gray-600 mt-1">{t('help_phone_orange')}</p>
            {!phoneValid && phone.length > 0 && (
              <p className="text-xs text-red-600 mt-1">{t('error_phone_invalid')}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">{t('label_amount_xaf')}</label>
            <Input type="number" required value={amount} readOnly />
            <p className="text-xs text-gray-600 mt-1">{t('help_amount_cart')}</p>
          </div>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50" disabled={!canSubmit}>
            {processing ? t('common_processing') : t('common_pay')}
          </Button>
        </form>

        {confirmOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded shadow-lg p-4">
              <div className="text-lg font-semibold mb-2">{t('confirm_title')}</div>
              <div className="text-sm text-gray-700 mb-4">
                <div><span className="text-gray-500">{t('operator_label')}&nbsp;</span> Orange Money</div>
                <div><span className="text-gray-500">{t('phone_label')}&nbsp;</span> {phone}</div>
                <div><span className="text-gray-500">{t('amount_label')}&nbsp;</span> {amount} XAF</div>
                <div className="mt-2 text-xs text-gray-700">{t('confirm_explainer_orange')}</div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>{t('btn_cancel')}</Button>
                <Button onClick={confirmPayment} disabled={processing}>{processing ? t('common_processing') : t('btn_confirm')}</Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
