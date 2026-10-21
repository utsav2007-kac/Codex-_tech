import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollDepthSectionProps {
  children: React.ReactNode;
  className?: string;
  enableDepth?: boolean;
}

export const ScrollDepthSection: React.FC<ScrollDepthSectionProps> = ({
  children,
  className = '',
  enableDepth = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableDepth) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 1024;
    if (prefersReducedMotion || isMobile) return;

    const el = containerRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    const ctx = gsap.context(() => {
      // Scrub animation through viewport
      gsap.fromTo(
        inner,
        {
          rotateX: 8,
          translateZ: -60,
          scale: 0.98,
          opacity: 0.85,
        },
        {
          rotateX: 0,
          translateZ: 0,
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            end: 'top 30%',
            scrub: 0.8,
            onLeaveBack: () => {
              gsap.set(inner, { clearProps: 'transform,opacity' });
            },
            onUpdate: (self) => {
              // When section is centered and at rest in focus, release transform so text is 100% crisp
              if (self.progress > 0.45 && self.progress < 0.85) {
                inner.style.transform = 'none';
              }
            },
          },
        }
      );
    }, el);

    return () => {
      ctx.revert();
    };
  }, [enableDepth]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full [perspective:1200px] overflow-visible ${className}`}
    >
      <div
        ref={innerRef}
        className="w-full [transform-style:preserve-3d] will-change-transform"
      >
        {children}
      </div>
    </div>
  );
};
