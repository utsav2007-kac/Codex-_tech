import React, { useRef, useState, useEffect } from 'react';

export type RevealVariant =
  | '3d-unfold'
  | 'cards-stagger'
  | 'grid-stagger'
  | 'stats'
  | 'testimonials'
  | 'form'
  | 'split-line';

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number; // seconds
  duration?: number; // seconds
  staggerIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'section' | 'article' | 'span' | 'aside' | 'header' | 'footer';
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = '3d-unfold',
  delay = 0,
  duration = 0.65,
  staggerIndex = 0,
  className = '',
  style = {},
  as: Tag = 'div',
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setReducedMotion(true);
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    // Safety timeout: Guarantee element is never stuck hidden if IntersectionObserver misses it
    const safetyTimer = setTimeout(() => {
      setIsVisible(true);
    }, 750);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(safetyTimer);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, []);

  if (reducedMotion) {
    return React.createElement(Tag, { ref, className, style }, children);
  }

  const calculatedDelay = delay + staggerIndex * 0.08;

  // Distinct transform & transition profiles per variant
  const getVariantStyles = (): { initial: React.CSSProperties; active: React.CSSProperties } => {
    switch (variant) {
      case '3d-unfold':
        return {
          initial: {
            opacity: 0,
            transform: 'perspective(1200px) rotateX(16deg) translateZ(-100px) translateY(40px)',
            transformOrigin: 'top center',
            transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s`,
          },
          active: {
            opacity: 1,
            transform: 'perspective(1200px) rotateX(0deg) translateZ(0px) translateY(0px)',
            transformOrigin: 'top center',
            transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s`,
          },
        };

      case 'cards-stagger':
        return {
          initial: {
            opacity: 0,
            transform: 'perspective(1000px) rotateX(12deg) translateY(35px) scale(0.96)',
            transition: `opacity ${duration}s cubic-bezier(0.2, 0.9, 0.3, 1) ${calculatedDelay}s, transform ${duration}s cubic-bezier(0.2, 0.9, 0.3, 1) ${calculatedDelay}s`,
          },
          active: {
            opacity: 1,
            transform: 'perspective(1000px) rotateX(0deg) translateY(0px) scale(1)',
            transition: `opacity ${duration}s cubic-bezier(0.2, 0.9, 0.3, 1) ${calculatedDelay}s, transform ${duration}s cubic-bezier(0.2, 0.9, 0.3, 1) ${calculatedDelay}s`,
          },
        };

      case 'grid-stagger':
        return {
          initial: {
            opacity: 0,
            transform: 'translateY(28px) scale(0.97)',
            transition: `opacity ${duration * 0.9}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s, transform ${duration * 0.9}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s`,
          },
          active: {
            opacity: 1,
            transform: 'translateY(0px) scale(1)',
            transition: `opacity ${duration * 0.9}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s, transform ${duration * 0.9}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s`,
          },
        };

      case 'stats':
        return {
          initial: {
            opacity: 0,
            transform: 'perspective(800px) rotateX(14deg) translateY(24px)',
            transition: `opacity ${duration * 0.8}s ease-out ${calculatedDelay}s, transform ${duration * 0.8}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s`,
          },
          active: {
            opacity: 1,
            transform: 'perspective(800px) rotateX(0deg) translateY(0px)',
            transition: `opacity ${duration * 0.8}s ease-out ${calculatedDelay}s, transform ${duration * 0.8}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s`,
          },
        };

      case 'testimonials':
        return {
          initial: {
            opacity: 0,
            transform: 'perspective(1200px) translateZ(-80px) translateY(30px)',
            transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s`,
          },
          active: {
            opacity: 1,
            transform: 'perspective(1200px) translateZ(0px) translateY(0px)',
            transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s`,
          },
        };

      case 'form':
        return {
          initial: {
            opacity: 0,
            transform: 'translateY(25px) scale(0.98)',
            transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s`,
          },
          active: {
            opacity: 1,
            transform: 'translateY(0px) scale(1)',
            transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s`,
          },
        };

      case 'split-line':
        return {
          initial: {
            opacity: 0,
            transform: 'perspective(800px) rotateX(20deg) translateY(100%)',
            transition: `opacity ${duration * 0.75}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s, transform ${duration * 0.75}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s`,
          },
          active: {
            opacity: 1,
            transform: 'perspective(800px) rotateX(0deg) translateY(0%)',
            transition: `opacity ${duration * 0.75}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s, transform ${duration * 0.75}s cubic-bezier(0.16, 1, 0.3, 1) ${calculatedDelay}s`,
          },
        };
    }
  };

  const currentStyles = isVisible ? getVariantStyles().active : getVariantStyles().initial;

  return React.createElement(
    Tag,
    {
      ref,
      className,
      'data-anim': variant,
      style: {
        ...style,
        ...currentStyles,
        willChange: isVisible ? 'auto' : 'transform, opacity',
      },
    },
    children
  );
};
