import { useEnvironment } from '@local/hooks/use-environment';

import { createContext, FC, useContext, useEffect, useMemo, useState } from 'react';

import { registerSW } from 'virtual:pwa-register';
import { ProviderSWProps, SWContextProps } from '.';

const SWContext = createContext<SWContextProps | null>(null);

export const useSW = () => {
  const context = useContext(SWContext);
  if (!context) throw new Error('useSW must be used within ProviderSW');
  return context;
};

const STORAGE_KEY = 'app-sw-version';
const getStoredVersion = () => localStorage.getItem(STORAGE_KEY);
const setStoredVersion = (v: string) => localStorage.setItem(STORAGE_KEY, v);

export const ProviderSW: FC<ProviderSWProps> = ({ children }) => {
  const env = useEnvironment();
  const envVersion = useMemo(() => env.version, [env.version]);

  const [status, setStatus] = useState<SWContextProps['status']>('idle');
  const [isHasNewVersion, setIsHasNewVersion] = useState<SWContextProps['isHasNewVersion']>(false);
  const [isOfflineReady, setIsOfflineReady] = useState<SWContextProps['isOfflineReady']>(false);

  const [versionCurrent] = useState<SWContextProps['versionCurrent']>(envVersion ?? null);
  const [versionLatest] = useState<SWContextProps['versionLatest']>(getStoredVersion() ?? null);

  useEffect(() => {
    setStatus('loading');

    registerSW({
      onNeedRefresh() {
        setIsHasNewVersion(true);
      },
      onOfflineReady() {
        setStoredVersion(envVersion);
        setIsOfflineReady(true);
      },
    });
  }, [envVersion]);

  return (
    <SWContext.Provider
      value={{
        status,
        isHasNewVersion,
        isOfflineReady,
        versionCurrent,
        versionLatest,
      }}
    >
      {children}
    </SWContext.Provider>
  );
};
