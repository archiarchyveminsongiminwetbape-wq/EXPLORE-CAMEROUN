import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Pied de page';
import { Button } from '@/components/interface utilisateur/button';
import { Input } from '@/components/interface utilisateur/input';

export default function PayCard() {
  const [number, setNumber] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvc, setCvc] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [email, setEmail] = React.useState('');
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
        body: JSON.stringify({ amount: Number(amount), email, currency: 'XAF' }),
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
        <h1 className="text-2xl font-semibold mb-4">Paiement par Carte</h1>
        <div className="mb-6">
          <img src="/assets/carte.jpeg" alt="Carte bancaire" className="h-12 w-auto object-contain" />
        </div>
        <form onSubmit={onSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" />
            <p className="text-xs text-gray-500 mt-1">Saisissez votre adresse email exacte.</p>
          </div>
          <div>
            <label className="block text-sm mb-1">Numéro de carte</label>
            <Input required value={number} onChange={(e) => setNumber(e.target.value)} placeholder="4242 4242 4242 4242" />
            <p className="text-xs text-gray-500 mt-1">Entrez le numéro de votre carte tel qu’affiché.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Expiration</label>
              <Input required value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/AA" />
            </div>
            <div>
              <label className="block text-sm mb-1">CVC</label>
              <Input required value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Montant</label>
            <Input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="10000" />
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={processing}>
            {processing ? 'Traitement...' : 'Payer'}
          </Button>
        </form>

        {confirmOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded shadow-lg p-4">
              <div className="text-lg font-semibold mb-2">Confirmer le paiement</div>
              <div className="text-sm text-gray-700 mb-4">
                <div><span className="text-gray-500">Méthode&nbsp;:</span> Carte bancaire</div>
                <div><span className="text-gray-500">Email&nbsp;:</span> {email}</div>
                <div><span className="text-gray-500">Montant&nbsp;:</span> {amount} XAF</div>
                <div className="mt-2 text-xs text-gray-500">Vous serez redirigé vers la page de validation sécurisée du paiement.</div>
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
