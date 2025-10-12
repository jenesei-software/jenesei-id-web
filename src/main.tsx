import React from 'react';
import ReactDOM from 'react-dom/client';
import '@local/core/i18n/index.ts';
import App from '@local/app';

import '@fontsource/inter/100.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/900.css';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import '@fontsource/roboto-mono/100.css';
import '@fontsource/roboto-mono/300.css';
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import '@fontsource/roboto-mono/700.css';

import leoProfanity from 'leo-profanity';

import { registerSW } from 'virtual:pwa-register';

leoProfanity.loadDictionary('en');
// leoProfanity.loadDictionary('ru');

export const updateSW = registerSW({
  onNeedRefresh() {
    fetch('/build-info.txt')
      .then((res) => res.text())
      .then((text) => {
        try {
          const versionLine = text.split('\n').find((l) => l.startsWith('version:'));
          const version = versionLine?.split(':')[1].trim() ?? 'unknown';

          localStorage.setItem('sw-need-refresh', 'true');
          localStorage.setItem('sw-new-version', version);
        } catch {
          localStorage.setItem('sw-need-refresh', 'true');
          localStorage.setItem('sw-new-version', 'unknown');
        }
      })
      .catch(() => {
        localStorage.setItem('sw-need-refresh', 'true');
        localStorage.setItem('sw-new-version', 'unknown');
      });
  },
  onOfflineReady() {
    localStorage.setItem('sw-offline-ready', 'true');
    localStorage.setItem('sw-need-refresh', 'false');
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
