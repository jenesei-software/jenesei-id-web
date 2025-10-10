import { PropsWithChildren } from 'react';

export type ProviderPWAProps = PropsWithChildren;

export interface PWAContextProps {
  isOfflineReady: boolean;
  isUpdateAvailable: boolean;
  updateApp: () => void;
}
