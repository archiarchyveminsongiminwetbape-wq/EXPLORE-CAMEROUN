import * as React from 'react';

export type ToastActionElement = React.ReactElement | null;

export interface ToastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // keep flexible for other props used by the toast system
  [key: string]: any;
}
