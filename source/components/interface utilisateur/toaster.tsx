// File: src/components/toaster.tsx (or similar)

import { useToast } from '@/crochets/utiliser-toast';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport, type ToastActionElement, type ToastProps } from '@/components/interface utilisateur/toast';

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {/* Correction: Use type assertion or define an explicit interface for 'toasts' in '@/hooks/use-toast' 
          to resolve 'id', 'title', etc., having implicit 'any' types. */}
      {toasts.map(function ({ id, title, description, action, ...props }: ToasterToast) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}