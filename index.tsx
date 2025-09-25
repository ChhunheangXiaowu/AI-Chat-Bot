import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from './contexts/i18n';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// We get the stored language to initialize the app with it
const initialLanguage = (localStorage.getItem('gemini-language') as 'en' | 'km') || 'en';

root.render(
  <React.StrictMode>
    <I18nProvider initialLanguage={initialLanguage}>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
