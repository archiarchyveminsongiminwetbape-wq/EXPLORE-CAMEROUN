import * as React from 'react';
import { paymentService } from '@/services/paymentService';
import { PaymentData } from '@/config/payment';

interface PaymentButtonProps {
  amount: number;
  currency?: string;
  phone?: string;
  email?: string;
  name?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  onSuccess?: (txRef: string) => void;
  onError?: (error: string) => void;
}

export default function PaymentButton({
  amount,
  currency = 'XAF',
  phone,
  email,
  name,
  description,
  className = '',
  children,
  onSuccess,
  onError,
}: PaymentButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handlePayment = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const paymentData: PaymentData = {
        amount,
        currency,
        phone,
        email,
        name,
        description,
      };

      const result = await paymentService.initiateLygosPayment(paymentData);

      if (result.success && result.paymentUrl) {
        // Sauvegarder la référence de transaction dans le localStorage
        if (result.tx_ref) {
          localStorage.setItem('current_tx_ref', result.tx_ref);
        }

        // Appeler le callback de succès si fourni
        if (onSuccess && result.tx_ref) {
          onSuccess(result.tx_ref);
        }

        // Rediriger vers la page de paiement Lygos
        paymentService.redirectToPayment(result.paymentUrl, result.tx_ref);
      } else {
        throw new Error(result.error || 'Erreur lors de l\'initialisation du paiement');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur paiement:', errorMessage);
      
      if (onError) {
        onError(errorMessage);
      } else {
        alert(`Erreur: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Traitement...' : children}
    </button>
  );
}
