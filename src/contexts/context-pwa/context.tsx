import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';

import { ProviderPWAProps, PWAContextProps } from './context.types';
import { registerSW } from 'virtual:pwa-register';

const PWAContext = createContext<PWAContextProps | null>(null);

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) throw new Error('usePWA must be used within ProviderPWA');
  return context;
};

let updateSWFn: (() => void) | null = null;

export const ProviderPWA: FC<ProviderPWAProps> = ({ children }) => {
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState<string | null>(null);

  useEffect(() => {
    const offlineReady = localStorage.getItem('sw-offline-ready') === 'true';
    const needRefresh = localStorage.getItem('sw-need-refresh') === 'true';
    const newVersion = localStorage.getItem('sw-new-version');

    setIsOfflineReady(offlineReady);
    setIsUpdateAvailable(needRefresh);
    setNewVersion(newVersion ?? null);

    let prevOfflineReady = offlineReady;
    let prevNeedRefresh = needRefresh;

    if (needRefresh) return;

    const interval = setInterval(() => {
      const newOfflineReady = localStorage.getItem('sw-offline-ready') === 'true';
      const newNeedRefresh = localStorage.getItem('sw-need-refresh') === 'true';

      setIsOfflineReady(newOfflineReady);
      setIsUpdateAvailable(newNeedRefresh);

      if (newOfflineReady !== prevOfflineReady || newNeedRefresh !== prevNeedRefresh) {
        clearInterval(interval);
      }

      prevOfflineReady = newOfflineReady;
      prevNeedRefresh = newNeedRefresh;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateApp = useCallback(() => {
    if (updateSWFn) {
      localStorage.setItem('sw-need-refresh', 'false');
      localStorage.setItem('sw-offline-ready', 'false');
      updateSWFn();
    } else {
      console.warn('updateSW() called before SW initialized');
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

export const initSW = () => {
  const { update } = registerSW({
    onNeedRefresh() {
    fetch('/build-info.txt')
      .then((res) => res.text())
      .then((text) => {
        const versionLine = text.split('\n').find((l) => l.startsWith('version:'));
        const version = versionLine?.split(':')[1].trim() ?? 'unknown';

        localStorage.setItem('sw-need-refresh', 'true');
        localStorage.setItem('sw-new-version', version);
      });
  },
  onOfflineReady() {
    localStorage.setItem('sw-offline-ready', 'true');
    localStorage.setItem('sw-need-refresh', 'false');
  },
  });

  updateSWFn = update;
};
