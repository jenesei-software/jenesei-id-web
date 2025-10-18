import { swService } from '@local/main';

import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';

import { ProviderPWAProps, PWAContextProps } from '.';

const PWAContext = createContext<PWAContextProps | null>(null);

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) throw new Error('usePWA must be used within ProviderPWA');
  return context;
};

export const ProviderPWA: FC<ProviderPWAProps> = ({ children }) => {
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState<string | null>(null);

  useEffect(() => {
    setIsOfflineReady(swService.isOfflineReady);
    setIsUpdateAvailable(swService.isUpdateAvailable);
    setNewVersion(swService.newVersion ?? null);

    const unSubscribe = swService.subscribe(() => {
      setIsOfflineReady(swService.isOfflineReady);
      setIsUpdateAvailable(swService.isUpdateAvailable);
      setNewVersion(swService.newVersion ?? null);
    });

    return () => unSubscribe();
  }, []);

  const updateApp = useCallback(() => {
    try {
      swService.updateApp().catch(() => window.location.reload());
    } catch {
      window.location.reload();
    }
  }, []);

  return (
    <PWAContext.Provider
      value={{
        newVersion,
        updateApp,
        isOfflineReady,
        isUpdateAvailable,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};
