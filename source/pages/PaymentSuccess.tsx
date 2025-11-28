import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Pied de page';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-green-600 text-8xl mb-4">✓</div>
          <h1 className="text-3xl font-bold mb-4 text-green-800">Paiement réussi!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Votre paiement a été traité avec succès. Un reçu vous sera envoyé par email.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
