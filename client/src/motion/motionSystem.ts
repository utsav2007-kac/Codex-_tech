import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initAnimDirectives } from './animDirectives';
import { qualityGovernor } from './qualityGovernor';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export interface MotionSystemHandle {
  lenis: Lenis | null;
  destroy: () => void;
  refresh: () => void;
}

/**
 * Initializes the unified motion system for the Home page:
 * - One smooth scroll engine (Lenis) with lerp 0.09
 * - Driven by the GSAP ticker (lagSmoothing 0)
 * - Deferred until after hero CSS entrance sequence finishes (~1000ms)
 * - Initialises all data-anim directives
 * - Cleanly tears down on unmount
 */
export function initMotionSystem(container: HTMLElement | Document = document): MotionSystemHandle {
  const mode = qualityGovernor.getMode();
  let lenisInstance: Lenis | null = null;
  let tickerCallback: ((time: number) => void) | null = null;
  let revertDirectives: (() => void) | null = null;

  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const canSmoothScroll = mode !== 'off' && !isTouch;

  // Initialize Lenis smooth scroll if permitted
  if (canSmoothScroll) {
    const lenis = new Lenis({
      lerp: 0.09,
      duration: 1.0,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false, // Touch devices use native scroll
      wheelMultiplier: 1.0,
    });

    if (window.scrollY > 0) {
      lenis.scrollTo(window.scrollY, { immediate: true });
    }

    lenisInstance = lenis;
    window.__lenis = lenis;

    tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);
  }

  // Initialize data-anim directives
  revertDirectives = initAnimDirectives(container);

  // Refresh ScrollTrigger to ensure all markers and measurements are precise
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);

  return {
    lenis: lenisInstance,
    refresh: () => ScrollTrigger.refresh(),
    destroy: () => {
      if (revertDirectives) {
        revertDirectives();
      }
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
        window.__lenis = undefined;
      }
    },
  };
}

/**
 * React Hook for attaching the Motion System to the Home page
 */
export function useMotionSystem(containerRef?: React.RefObject<HTMLElement | null>) {
  const systemRef = useRef<MotionSystemHandle | null>(null);

  useEffect(() => {
    let active = true;

    // Defer initialization until after hero entrance sequence (1000ms)
    const timer = setTimeout(() => {
      if (!active) return;
      const target = containerRef?.current || document.body;
      systemRef.current = initMotionSystem(target);
    }, 1000);

    return () => {
      active = false;
      clearTimeout(timer);
      if (systemRef.current) {
        systemRef.current.destroy();
        systemRef.current = null;
      }
    };
  }, [containerRef]);
}
