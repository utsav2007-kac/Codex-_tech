import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as pkg from 'react-helmet-async';
const HelmetProvider: any = (pkg as any).HelmetProvider || (pkg as any).default?.HelmetProvider || (pkg as any).default || pkg;

// Import Global Styles
import './styles/index.css';

import { App } from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Enforce browser manual scroll restoration on reload across all devices
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
}

const rootElement = document.getElementById('root')!;

const appNode = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// If SSR content exists in #root on home route, hydrate cleanly to preserve DOM and prevent reload flash
if (window.location.pathname === '/' && rootElement.hasChildNodes() && rootElement.firstElementChild) {
  ReactDOM.hydrateRoot(rootElement, appNode);
} else {
  rootElement.innerHTML = '';
  ReactDOM.createRoot(rootElement).render(appNode);
}
