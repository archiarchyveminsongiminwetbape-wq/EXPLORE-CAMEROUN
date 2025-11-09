import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Pied de page';
import { Button } from '@/components/interface utilisateur/button';
import { Input } from '@/components/interface utilisateur/input';
import { useCart } from '@/crochets/utiliser-panier';

export default function PayOrange() {
  const { totalXaf } = useCart();
  const [phone, setPhone] = React.useState('');
  const [amount, setAmount] = React.useState<string>(() => String(totalXaf || ''));
  const [processing, setProcessing] = React.useState(false);
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3001';
  const [confirmOpen, setConfirmOpen] = React.useState(false);
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
        window.location.href = data.link;
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
        <h1 className="text-2xl font-semibold mb-4">Paiement Orange Money</h1>
        <div className="mb-6">
          <img src="/assets/orange.jpeg" alt="Orange Money" className="h-16 w-auto object-contain" />
        </div>
        <form onSubmit={onSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm mb-1">Numéro Orange</label>
            <Input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="69x xxx xxx" />
            <p className="text-xs text-gray-600 mt-1">Saisissez votre numéro Orange Money exact.</p>
          </div>
          <div>
            <label className="block text-sm mb-1">Montant (XAF)</label>
            <Input type="number" required value={amount} readOnly />
            <p className="text-xs text-gray-600 mt-1">Vérifiez le montant total de votre panier avant de valider.</p>
          </div>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={processing}>
            {processing ? 'Traitement...' : 'Payer'}
          </Button>
        </form>

        {confirmOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded shadow-lg p-4">
              <div className="text-lg font-semibold mb-2">Confirmer le paiement</div>
              <div className="text-sm text-gray-700 mb-4">
                <div><span className="text-gray-500">Opérateur&nbsp;:</span> Orange Money</div>
                <div><span className="text-gray-500">Téléphone&nbsp;:</span> {phone}</div>
                <div><span className="text-gray-500">Montant&nbsp;:</span> {amount} XAF</div>
                <div className="mt-2 text-xs text-gray-500">Vous serez redirigé vers la page de validation sécurisée pour composer votre code secret.</div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>Annuler</Button>
                <Button onClick={confirmPayment} disabled={processing}>{processing ? 'Redirection...' : 'Confirmer'}</Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
