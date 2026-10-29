import React, { Suspense } from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Routes, Route } from 'react-router-dom';
import * as helmetModule from 'react-helmet-async';
const HelmetProvider = (helmetModule as any).HelmetProvider || (helmetModule as any).default?.HelmetProvider || (helmetModule as any).default;
import { RootLayout } from './layouts/RootLayout';
import { Home } from './pages/Home';
import { ScrollToTop } from './components/layout/ScrollToTop';

const RouteFallback: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
  </div>
);

// Dedicated SSR entry that renders the REAL RootLayout + Home synchronously
export function renderHome() {
  const helmetContext = {};

  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location="/">
        <ScrollToTop />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </Suspense>
      </StaticRouter>
    </HelmetProvider>
  );

  return { html };
}
