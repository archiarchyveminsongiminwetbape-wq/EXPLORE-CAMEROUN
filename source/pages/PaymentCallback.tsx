import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Pied de page';
import { paymentService } from '@/services/paymentService';

export default function PaymentCallback() {
  const [status, setStatus] = React.useState<string>('processing');
  const [message, setMessage] = React.useState<string>('Vérification en cours...');
  const [details, setDetails] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const txStatus = params.get('status') || params.get('resp') || 'processing';
        const id = params.get('order_id') || params.get('transaction_id') || params.get('tx_ref') || params.get('id');
        
        // Essayer aussi de récupérer depuis le localStorage
        const storedTxRef = localStorage.getItem('current_tx_ref');
        const txRef = id || storedTxRef;
        
        setStatus(txStatus);

        if (txRef) {
          try {
            const paymentData = await paymentService.verifyPayment(txRef);
            
            setDetails(paymentData);
            setMessage('Paiement vérifié avec succès');
            setStatus(paymentData?.status || 'successful');
            
            // Nettoyer le localStorage
            localStorage.removeItem('current_tx_ref');
          } catch (error) {
            console.error('Erreur de vérification:', error);
            setMessage('Échec de la vérification du paiement');
            setStatus('failed');
            setDetails(null);
          }
        } else {
          setMessage('Aucun identifiant de transaction fourni');
          setStatus('error');
        }
      } catch (error) {
        console.error('Erreur générale:', error);
        setMessage('Erreur lors de la vérification du paiement');
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []); // Dépendances vides pour exécuter une seule fois

  const isSuccess = status?.toLowerCase() === 'successful' || status?.toLowerCase() === 'success';
  const isError = status?.toLowerCase() === 'failed' || status?.toLowerCase() === 'error';

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-10 flex-1">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg">Vérification du paiement en cours...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Résultat du paiement</h1>
          
          <div className={`border-2 rounded-lg p-6 ${ 
            isSuccess ? 'border-green-500 bg-green-50' : 
            isError ? 'border-red-500 bg-red-50' : 
            'border-yellow-500 bg-yellow-50' 
          }`}>
            <div className="text-center mb-4">
              {isSuccess && (
                <div className="text-green-600 text-6xl mb-2">✓</div>
              )}
              {isError && (
                <div className="text-red-600 text-6xl mb-2">✗</div>
              )}
              {!isSuccess && !isError && (
                <div className="text-yellow-600 text-6xl mb-2">⏳</div>
              )}
              
              <h2 className={`text-xl font-semibold ${ 
                isSuccess ? 'text-green-800' : 
                isError ? 'text-red-800' : 
                'text-yellow-800' 
              }`}>
                {message}
              </h2>
            </div>

            {details && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Détails de la transaction:</h3>
                <div className="bg-white p-4 rounded border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {details.tx_ref && (
                      <div><strong>Référence:</strong> {details.tx_ref}</div>
                    )}
                    {details.amount && (
                      <div><strong>Montant:</strong> {details.amount} {details.currency || 'XAF'}</div>
                    )}
                    {details.status && (
                      <div><strong>Statut:</strong> {details.status}</div>
                    )}
                    {details.payment_method && (
                      <div><strong>Méthode:</strong> {details.payment_method}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              {isSuccess && (
                <div className="text-green-700">
                  <p className="mb-2">Votre paiement a été traité avec succès!</p>
                  <p className="text-sm">Un reçu vous sera envoyé par email si une adresse a été fournie.</p>
                </div>
              )}
              
              <button
                onClick={() => window.location.href = '/'}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
