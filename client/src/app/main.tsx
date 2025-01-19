import React from 'react';
import ReactDOM from 'react-dom/client';

import { NotificationProvider } from '@/shared/lib/notifications/context/NotificationContext.tsx';
import { I18NProvider } from '@ayub-begimkulov/i18n';

import { App } from './App.tsx';
import { i18n } from './i18n/i18n.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18NProvider i18n={i18n}>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </I18NProvider>
  </React.StrictMode>,
);
