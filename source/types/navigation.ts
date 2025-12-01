import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

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

export interface TransactionDetails {
  tx_ref: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  customer_email?: string;
  customer_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}
