import { PAYMENT_CONFIG, PaymentData, PaymentResponse } from '@/config/payment';

class PaymentService {
  private apiBase = PAYMENT_CONFIG.API_BASE;

  async initiateLygosPayment(data: PaymentData): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.apiBase}/api/pay/lygos/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          currency: data.currency || 'XAF',
          callback_url: PAYMENT_CONFIG.CALLBACK_URL,
          success_url: PAYMENT_CONFIG.SUCCESS_URL,
          cancel_url: PAYMENT_CONFIG.CANCEL_URL,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Erreur lors de l\'initialisation du paiement');
      }

      return {
        success: true,
        paymentUrl: result.link || PAYMENT_CONFIG.LYGOS_PAYMENT_URL,
        tx_ref: result.tx_ref,
        message: result.message,
      };
    } catch (error) {
      console.error('Erreur initiation paiement:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  async verifyPayment(txRef: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiBase}/api/pay/lygos/verify?tx_ref=${encodeURIComponent(txRef)}`);
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Erreur lors de la vérification');
      }

      return result.data;
    } catch (error) {
      console.error('Erreur vérification paiement:', error);
      throw error;
    }
  }

  redirectToPayment(paymentUrl: string, txRef?: string): void {
    // Construire l'URL avec les paramètres de callback
    const url = new URL(paymentUrl);
    

    if (txRef) {
      url.searchParams.set('tx_ref', txRef);
    }
    

    url.searchParams.set('callback_url', PAYMENT_CONFIG.CALLBACK_URL);
    url.searchParams.set('success_url', PAYMENT_CONFIG.SUCCESS_URL);
    url.searchParams.set('cancel_url', PAYMENT_CONFIG.CANCEL_URL);

    // Rediriger vers la page de paiement Lygos
    window.location.href = url.toString();
  }
}

export const paymentService = new PaymentService();
