import { PropsWithChildren } from 'react';

export type ProviderSWProps = PropsWithChildren;

export interface SWContextProps {
  isOfflineReady: boolean;
  isHasNewVersion: boolean;
  versionCurrent: string | null;
  versionLatest: string | null;
  status?: 'idle' | 'loading' | 'ready' | 'error';
}
