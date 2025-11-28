import * as React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Pied de page';
import PaymentButton from '@/components/PaymentButton';

export default function PayOrange() {
  const [amount, setAmount] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');

  const handlePaymentSuccess = (txRef: string) => {
    console.log('Paiement initié avec succès:', txRef);
  };

  const handlePaymentError = (error: string) => {
    alert(`Erreur de paiement: ${error}`);
  };

  const isFormValid = amount && parseFloat(amount) > 0 && phone;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Paiement Orange Money</h1>
          
          <div className="mb-6">
            <img 
              src="/assets/orange.png" 
              alt="Orange Money" 
              className="h-16 w-auto object-contain mx-auto"
            />
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Montant (XAF) *
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 5000"
                min="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Numéro Orange *
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 699123456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (optionnel)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet (optionnel)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom complet"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <PaymentButton
              amount={parseFloat(amount) || 0}
              currency="XAF"
              phone={phone}
              email={email || undefined}
              name={name || undefined}
              description="Paiement Orange Money"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                isFormValid
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Payer avec Orange Money
            </PaymentButton>
          </form>

          <div className="mt-6 text-sm text-gray-600">
            <p>• Assurez-vous que votre numéro Orange est actif</p>
            <p>• Vous recevrez une notification pour confirmer le paiement</p>
            <p>• Un reçu vous sera envoyé par email si fourni</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
