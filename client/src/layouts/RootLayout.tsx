import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LoaderCurtain } from '../components/motion/LoaderCurtain';
import { PrismWipe } from '../components/motion/PrismWipe';
import { CustomCursor } from '../components/motion/CustomCursor';
import { ChatWidget } from '../components/ui/ChatWidget';
import { StickyMobileCTA } from '../components/ui/StickyMobileCTA';
import { FloatingWhatsApp } from '../components/ui/FloatingWhatsApp';
import { CookieConsent } from '../components/ui/CookieConsent';
import { ConsultationModal } from '../components/forms/ConsultationModal';
import { useLenisScroll } from '../hooks/useLenisScroll';
const UnifiedGlobalCanvas3D = React.lazy(() =>
  import('../components/3d/UnifiedGlobalCanvas3D').then((m) => ({ default: m.UnifiedGlobalCanvas3D }))
);
import { ScrollProgressBar } from '../components/ui/ScrollProgressBar';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const RootLayout: React.FC = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [loadGlobalCanvas, setLoadGlobalCanvas] = useState(false);
  const [loadDeferredWidgets, setLoadDeferredWidgets] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Initialize smooth scroll & ScrollTrigger lifecycle
  useLenisScroll();

  useEffect(() => {
    // Defer global background canvas and non-hero widgets until hero entrance finishes (after 1s)
    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          setLoadGlobalCanvas(true);
          setLoadDeferredWidgets(true);
        }, { timeout: 2000 });
      } else {
        setLoadGlobalCanvas(true);
        setLoadDeferredWidgets(true);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-orange-500/20 selection:text-orange-600">
      {/* Scroll Progress Bar & Desktop Rail Indicator */}
      <ScrollProgressBar />

      {/* Unified Global 3D Canvas (Deferred after hero entrance for 60 FPS zero-shift) */}
      {loadGlobalCanvas && (
        <ErrorBoundary fallback={null}>
          <React.Suspense fallback={null}>
            <UnifiedGlobalCanvas3D />
          </React.Suspense>
        </ErrorBoundary>
      )}
      {/* Skip to Content Accessibility Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-orange-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg"
      >
        Skip to main content
      </a>

      {/* E1 Session Loader Curtain */}
      <LoaderCurtain />

      {/* E2 Route Prism Wipe */}
      <PrismWipe locationKey={location.pathname} />

      {/* E15 Custom Desktop Cursor */}
      <CustomCursor />

      {/* Global Navbar (Fixed pill across all public routes, never moves, never shrinks) */}
      <Navbar
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        <Outlet context={{ onOpenConsultation: () => setIsConsultationOpen(true) }} />
      </main>

      {/* Global Footer (E13 Curtain) */}
      <Footer />

      {/* Interactive Global Elements (Deferred after Hero Entrance for 0 Long Tasks) */}
      {loadDeferredWidgets && (
        <>
          <ChatWidget onOpenConsultation={() => setIsConsultationOpen(true)} />
          <StickyMobileCTA onOpenConsultation={() => setIsConsultationOpen(true)} />
          <FloatingWhatsApp />
          <CookieConsent />
        </>
      )}

      {/* Global Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
  );
};
