import { ReactNode } from 'react';

export type LayoutErrorRouterProps = object;

export interface LayoutErrorBoundaryProps {
  children: ReactNode;
}

export interface LayoutErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
