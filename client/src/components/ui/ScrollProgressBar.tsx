import React, { useState, useEffect } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
          setScrollProgress(progress);

          // Calculate active section for rail indicator (0 to 4)
          const sectionIdx = Math.min(4, Math.floor((currentScroll / Math.max(1, totalHeight)) * 5));
          setActiveSection(sectionIdx);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. Thin Orange Top Progress Bar (Fixed at very top of screen above navbar) */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 transition-all duration-75 ease-out shadow-[0_0_8px_rgba(241,90,52,0.6)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Subtle Desktop Section Rail Indicator (Right Margin on XL displays) */}
      <nav
        className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col items-center gap-3 z-30 pointer-events-none"
        aria-label="Page scroll position"
      >
        {[0, 1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className={`w-1.5 transition-all duration-300 rounded-full ${
              activeSection === idx
                ? 'h-6 bg-orange-500 shadow-[0_0_8px_rgba(241,90,52,0.8)]'
                : 'h-1.5 bg-slate-300/40'
            }`}
          />
        ))}
      </nav>
    </>
  );
};
