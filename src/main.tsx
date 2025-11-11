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

import { ClassSw } from '@local/classes/class-sw';

import leoProfanity from 'leo-profanity';

leoProfanity.loadDictionary('en');
leoProfanity.loadDictionary('ru');

export const swService = new ClassSw();

try {
  swService.init();
} catch (e) {
  console.warn('SW init failed', e);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
