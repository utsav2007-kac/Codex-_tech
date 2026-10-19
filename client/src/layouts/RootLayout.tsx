import React, { useState } from 'react';
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
import { SideScenes } from '../components/3d/SideScenes';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const RootLayout: React.FC = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const location = useLocation();

  // Initialize smooth scroll & ScrollTrigger lifecycle
  useLenisScroll();

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-orange-500/20 selection:text-orange-600">
      {/* Three.js Persistent Dual-Gutter Animations (Left Candidate Helix & Right Hiring Network) */}
      <ErrorBoundary fallback={null}>
        <SideScenes />
      </ErrorBoundary>
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

      {/* Global Announcement Header */}
      <AnnouncementBar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* Global Navbar */}
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        <Outlet context={{ onOpenConsultation: () => setIsConsultationOpen(true) }} />
      </main>

      {/* Global Footer (E13 Curtain) */}
      <Footer />

      {/* Interactive Global Elements */}
      <ChatWidget onOpenConsultation={() => setIsConsultationOpen(true)} />
      <StickyMobileCTA onOpenConsultation={() => setIsConsultationOpen(true)} />
      <FloatingWhatsApp />
      <CookieConsent />

      {/* Global Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
  );
};
