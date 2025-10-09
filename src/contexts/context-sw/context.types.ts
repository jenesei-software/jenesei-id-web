import { PropsWithChildren } from 'react';

export type ProviderSWProps = PropsWithChildren;

export interface SWContextProps {
  onUpdate: () => void;
  isOfflineReady: boolean;
  isHasNewVersion: boolean;
  versionCurrent: string | null;
  versionLatest: string | null;
}
