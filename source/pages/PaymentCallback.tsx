import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Pied de page';

export default function PaymentCallback() {
  const [status, setStatus] = React.useState<string>('processing');
  const [message, setMessage] = React.useState<string>('Vérification en cours...');
  const [details, setDetails] = React.useState<any>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const txStatus = params.get('status') || params.get('resp') || 'processing';
    const id = params.get('transaction_id') || params.get('id');
    setStatus(txStatus);

    if (id) {
      fetch(`http://localhost:3001/api/pay/flutterwave/verify?transaction_id=${encodeURIComponent(id)}`)
        .then(async (r) => ({ ok: r.ok, data: await r.json() }))
        .then(({ ok, data }) => {
          if (!ok || !data?.ok) {
            setMessage(data?.error || 'Échec de vérification');
            setDetails(data);
            return;
          }
          const flwData = data.data?.data || data.data;
          setDetails(flwData);
          setMessage('Paiement vérifié');
          setStatus(flwData?.status || 'successful');
        })
        .catch(() => {
          setMessage('Erreur lors de la vérification');
        });
    } else {
      setMessage('Aucun identifiant de transaction fourni');
      setStatus('error');
    }
  }, []);

  const ok = status?.toLowerCase() === 'successful' || status?.toLowerCase() === 'success';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-2xl font-semibold mb-4">Retour de paiement</h1>
        <div className={`border rounded p-4 ${ok ? 'border-green-500' : 'border-red-500'}`}>
          <div className="text-lg font-medium mb-2">{message}</div>
          {details && (
            <pre className="text-xs overflow-auto bg-gray-50 p-3 rounded max-h-96">{JSON.stringify(details, null, 2)}</pre>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
