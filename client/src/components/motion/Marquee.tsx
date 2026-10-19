import React from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number; // seconds
  direction?: 'left' | 'right';
  className?: string;
  pauseOnHover?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  speed = 25,
  direction = 'left',
  className = '',
  pauseOnHover = true,
}) => {
  return (
    <div className={`group overflow-hidden flex select-none ${className}`}>
      <div
        className="flex shrink-0 items-center gap-8 group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className="flex shrink-0 items-center gap-8 group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        {children}
      </div>
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0%); }
          to { transform: translateX(-100%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-100%); }
          to { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
};
