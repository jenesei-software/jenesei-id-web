import { useEnvironment } from '@local/hooks/use-environment';

import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';

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
  const [versionLatest, setVersionLatest] = useState<SWContextProps['versionLatest']>(getStoredVersion() ?? null);

  useEffect(() => {
    setStatus('loading');

    registerSW({
      immediate: true,
      onNeedRefresh() {
        setIsHasNewVersion(true);
      },
      onOfflineReady() {
        setIsOfflineReady(true);
      },
      onRegisteredSW(_swUrl, _registration) {
        setStatus('ready');
        setStoredVersion(envVersion);
        setVersionLatest(envVersion);
      },
      onRegisterError(err) {
        console.error('SW registration error', err);
        setStatus('error');
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
