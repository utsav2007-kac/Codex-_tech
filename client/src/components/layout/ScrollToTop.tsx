import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const prevPathRef = useRef(pathname);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isTransitioningRef.current) return;
      try {
        sessionStorage.setItem(`scroll_pos_${pathname}`, window.scrollY.toString());
      } catch {}
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    isTransitioningRef.current = true;

    if (navType === 'POP') {
      try {
        const saved = sessionStorage.getItem(`scroll_pos_${pathname}`);
        const targetY = saved !== null ? parseInt(saved, 10) : 0;
        window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
        if (window.__lenis) {
          window.__lenis.scrollTo(targetY, { immediate: true });
        }
        setTimeout(() => {
          window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
          if (window.__lenis) {
            window.__lenis.scrollTo(targetY, { immediate: true });
          }
          isTransitioningRef.current = false;
        }, 120);
      } catch {
        isTransitioningRef.current = false;
      }
    } else {
      // PUSH: save previous page position before resetting
      try {
        sessionStorage.setItem(`scroll_pos_${prevPathRef.current}`, window.scrollY.toString());
      } catch {}
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      }
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 120);
    }

    prevPathRef.current = pathname;
  }, [pathname, navType]);

  return null;
};

