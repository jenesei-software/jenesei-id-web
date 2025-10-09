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
  const appVersion = useMemo(() => env.version, [env.version]);

  const [status, setStatus] = useState<SWContextProps['status']>('idle');
  const [isHasNewVersion, setIsHasNewVersion] = useState<SWContextProps['isHasNewVersion']>(false);
  const [isOfflineReady, setIsOfflineReady] = useState<SWContextProps['isOfflineReady']>(false);
  const [versionCurrent, setVersionCurrent] = useState<SWContextProps['versionCurrent']>(
    getStoredVersion() ?? appVersion,
  );
  const [versionLatest, setVersionLatest] = useState<SWContextProps['versionLatest']>(null);

  const [updateSW, setUpdateSW] = useState<((reload?: boolean) => void) | null>(null);

  useEffect(() => {
    setStatus('loading');

    const sw = registerSW({
      immediate: true,
      onNeedRefresh() {
        setIsHasNewVersion(true);
      },
      onOfflineReady() {
        setIsOfflineReady(true);
      },
      onRegisteredSW(swUrl, registration) {
        setStatus('ready');
        if (registration?.active) {
          const swVersion =
            new URL(swUrl, location.origin).searchParams.get('__WB_REVISION__') ?? Date.now().toString();
          setStoredVersion(swVersion);
          setVersionLatest(swVersion);
          if (swVersion !== appVersion) setIsHasNewVersion(true);
          setVersionCurrent(appVersion);
        }
      },
      onRegisterError(err) {
        console.error('SW registration error', err);
        setStatus('error');
      },
    });

    setUpdateSW(() => sw);
  }, [appVersion]);

  const onUpdate = useCallback(() => {
    if (updateSW) updateSW(true);
  }, [updateSW]);

  return (
    <SWContext.Provider
      value={{
        status,
        isHasNewVersion,
        isOfflineReady,
        onUpdate,
        versionCurrent,
        versionLatest,
      }}
    >
      {children}
    </SWContext.Provider>
  );
};
