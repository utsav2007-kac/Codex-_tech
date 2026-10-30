import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, hash, search } = useLocation();

  // Capture ?ref= referral code parameter across the app and persist in sessionStorage
  useEffect(() => {
    try {
      const params = new URLSearchParams(search);
      const refCode = params.get('ref');
      if (refCode && refCode.trim().length > 0) {
        sessionStorage.setItem('cx_referral_code', refCode.trim());
      }
    } catch {}
  }, [search]);

  // Enforce manual scroll restoration across browser refreshes and history navigation
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Clear any residual scroll positions from sessionStorage
    try {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('scroll_pos_')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch {}
  }, []);

  useEffect(() => {
    // If a hash anchor is provided in the URL (e.g. #contact), navigate smoothly to it
    if (hash) {
      const target = document.getElementById(hash.replace('#', ''));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Always reset to the very top (0, 0) immediately on reload and route navigation
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }

    // Secondary check shortly after render to ensure no late layout shifts or component mounts move scroll
    const timer = setTimeout(() => {
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        if (window.__lenis) {
          window.__lenis.scrollTo(0, { immediate: true });
        }
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
};

