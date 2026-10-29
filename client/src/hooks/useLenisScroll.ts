import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation, useNavigationType } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function useLenisScroll() {
  const location = useLocation();
  const navType = useNavigationType();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || isTouch) {
      window.__lenis = undefined;
      return;
    }

    let tickerCallback: ((time: number) => void) | null = null;
    let lenisInstance: Lenis | null = null;

    // Defer Lenis smooth scroll initialization until after hero entrance sequence completes (1000ms)
    const initTimer = setTimeout(() => {
      const lenis = new Lenis({
        lerp: 0.09,
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
      });

      // Synchronize Lenis immediately with existing scroll position
      if (window.scrollY > 0) {
        lenis.scrollTo(window.scrollY, { immediate: true });
      }

      lenisInstance = lenis;
      lenisRef.current = lenis;
      window.__lenis = lenis;

      tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }, 1000);

    return () => {
      clearTimeout(initTimer);
      if (lenisInstance) {
        lenisInstance.destroy();
        lenisRef.current = null;
        window.__lenis = undefined;
      }
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
    };
  }, []);

  // On route change: reset scroll position on PUSH, clean previous ScrollTriggers, and refresh
  useEffect(() => {
    if (lenisRef.current) {
      if (navType !== 'POP') {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
      ScrollTrigger.getAll().forEach((st) => st.kill());
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [location.pathname, navType]);
}
