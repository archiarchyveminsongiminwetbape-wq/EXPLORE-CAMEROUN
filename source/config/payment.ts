// Configuration des paiements
export const PAYMENT_CONFIG = {
  LYGOS_PAYMENT_URL: 'https://pay.lygosapp.com/link/ae004d7c-a01d-439a-bddd-3551e672adf4',
  API_BASE: import.meta.env?.VITE_API_BASE || 'http://localhost:3001',
  CALLBACK_URL: `${window.location.origin}/payment-callback`,
  SUCCESS_URL: `${window.location.origin}/payment-success`,
  CANCEL_URL: `${window.location.origin}/payment-cancel`
};

// Types pour les paiements
export interface PaymentData {
  amount: number;
  currency?: string;
  phone?: string;
  email?: string;
  name?: string;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  tx_ref?: string;
  message?: string;
  error?: string;
}
