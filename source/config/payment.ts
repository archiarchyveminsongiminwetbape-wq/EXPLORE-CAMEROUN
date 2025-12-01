import { PaymentData, PaymentResponse } from '@/types/navigation';

// Validation de l'environnement
const validateEnvironment = (): void => {
  if (typeof window === 'undefined') return; // SSR check
  
  const requiredVars = {
    LYGOS_PAYMENT_URL: 'https://pay.lygosapp.com/link/ae004d7c-a01d-439a-bddd-3551e672adf4',
    API_BASE: import.meta.env?.VITE_API_BASE || 'http://localhost:3001'
  };

  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) {
      console.error(`❌ Variable d'environnement manquante: ${key}`);
    }
  });
};

// Configuration des paiements avec validation
export const PAYMENT_CONFIG = {
  LYGOS_PAYMENT_URL: 'https://pay.lygosapp.com/link/ae004d7c-a01d-439a-bddd-3551e672adf4',
  API_BASE: import.meta.env?.VITE_API_BASE || 'http://localhost:3001',
  get CALLBACK_URL(): string {
    return typeof window !== 'undefined' ? `${window.location.origin}/payment-callback` : '';
  },
  get SUCCESS_URL(): string {
    return typeof window !== 'undefined' ? `${window.location.origin}/payment-success` : '';
  },
  get CANCEL_URL(): string {
    return typeof window !== 'undefined' ? `${window.location.origin}/payment-cancel` : '';
  }
} as const;

// Validation de la configuration
export function validatePaymentConfig(): boolean {
  try {
    validateEnvironment();
    
    if (!PAYMENT_CONFIG.LYGOS_PAYMENT_URL) {
      console.error('❌ LYGOS_PAYMENT_URL non configur��e');
      return false;
    }
    
    if (!PAYMENT_CONFIG.API_BASE) {
      console.error('❌ API_BASE non configurée');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur de validation de la configuration:', error);
    return false;
  }
}

// Types exportés
export type { PaymentData, PaymentResponse };