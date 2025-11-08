import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Pied de page';
import { Button } from '@/components/interface utilisateur/button';
import { Input } from '@/components/interface utilisateur/input';
import { useCart } from '@/crochets/utiliser-panier';

export default function PayMTN() {
  const { totalXaf } = useCart();
  const [phone, setPhone] = React.useState('');
  const [amount, setAmount] = React.useState<string>(() => String(totalXaf || ''));
  const [processing, setProcessing] = React.useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await fetch('http://localhost:3001/api/pay/flutterwave/init', {
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
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-semibold mb-4">Paiement MTN Mobile Money</h1>
        <form onSubmit={onSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm mb-1">Numéro MTN</label>
            <Input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="67x xxx xxx" />
          </div>
          <div>
            <label className="block text-sm mb-1">Montant (XAF)</label>
            <Input type="number" required value={amount} readOnly />
          </div>
          <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600" disabled={processing}>
            {processing ? 'Traitement...' : 'Payer'}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
