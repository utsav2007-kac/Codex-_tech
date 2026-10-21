import React, { useState, useEffect, useRef } from 'react';

interface UseCounterOptions {
  end: number;
  duration?: number; // milliseconds
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

/**
 * useCounter
 * Lightweight, zero-dependency, RAF-based number counter.
 * Triggers when the element enters the viewport.
 * Uses tabular-nums rendering to prevent layout shifts.
 */
export function useCounter({
  end,
  duration = 1800,
  prefix = '',
  suffix = '',
  decimals = 0,
}: UseCounterOptions) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setValue(end);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            // Ease out expo: 1 - Math.pow(2, -10 * progress)
            const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = easeOutProgress * end;

            setValue(currentVal);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setValue(end);
            }
          };

          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  const formatted = `${prefix}${decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()}${suffix}`;

  return { ref, value, formatted };
}

/**
 * AnimatedCounter Component
 * Easy-to-use inline component for stats and telemetry
 */
export const AnimatedCounter: React.FC<UseCounterOptions & { className?: string }> = ({
  end,
  duration = 1800,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const { ref, formatted } = useCounter({ end, duration, prefix, suffix, decimals });

  return (
    <span
      ref={ref}
      className={`font-mono tabular-nums ${className}`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {formatted}
    </span>
  );
};
