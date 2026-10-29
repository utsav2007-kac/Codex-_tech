import React, { useState, useEffect } from 'react';

interface OfficeClockProps {
  timeZone: string;
  cityName: string;
  countryCode: string;
  badgeTint: 'sky' | 'butter';
}

export const OfficeClock: React.FC<OfficeClockProps> = ({
  timeZone,
  cityName,
  countryCode,
  badgeTint,
}) => {
  const [timeState, setTimeState] = useState(() => {
    const now = new Date();
    return getTimeComponents(now, timeZone);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeState(getTimeComponents(now, timeZone));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeZone]);

  function getTimeComponents(date: Date, tz: string) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      }).formatToParts(date);

      let h = 0;
      let m = 0;
      let s = 0;
      for (const p of parts) {
        if (p.type === 'hour') h = parseInt(p.value, 10);
        if (p.type === 'minute') m = parseInt(p.value, 10);
        if (p.type === 'second') s = parseInt(p.value, 10);
      }

      // Format human digital string
      const digitalString = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(date);

      // Business hours check (e.g. 8:00 to 19:00 local time)
      const isBusinessHours = h >= 8 && h < 19;

      return { hour: h, minute: m, second: s, digitalString, isBusinessHours };
    } catch {
      return {
        hour: 9,
        minute: 0,
        second: 0,
        digitalString: '09:00:00 AM',
        isBusinessHours: true,
      };
    }
  }

  const { hour, minute, second, digitalString, isBusinessHours } = timeState;

  // Clock Hand Angles
  const secondAngle = (second / 60) * 360;
  const minuteAngle = (minute / 60) * 360 + (second / 60) * 6;
  const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30;

  const tintStyles =
    badgeTint === 'sky'
      ? {
          bg: 'bg-[#E8F2FF]',
          border: 'border-[#BFDBFE]',
          dialBg: '#F0F7FF',
          hourHand: '#1D4ED8',
          minuteHand: '#2563EB',
          accent: '#2563EB',
        }
      : {
          bg: 'bg-[#FFF4D6]',
          border: 'border-[#FDE68A]',
          dialBg: '#FFFAEB',
          hourHand: '#C2410C',
          minuteHand: '#F25C2A',
          accent: '#C2410C',
        };

  return (
    <div className="flex items-center gap-3.5">
      {/* Analog SVG Clock Dial (72px) */}
      <div className="relative w-16 h-16 shrink-0" aria-label={`Current analog clock for ${cityName}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
          {/* Outer Ring */}
          <circle
            cx="50"
            cy="50"
            r="47"
            fill={tintStyles.dialBg}
            stroke="#CBD5E1"
            strokeWidth="3"
          />

          {/* Hour Markers (12, 3, 6, 9 bold, others fine) */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
            const isCardinal = deg % 90 === 0;
            return (
              <line
                key={deg}
                x1="50"
                y1={isCardinal ? '9' : '11'}
                x2="50"
                y2="15"
                stroke={isCardinal ? '#0F172A' : '#94A3B8'}
                strokeWidth={isCardinal ? '2.5' : '1.2'}
                strokeLinecap="round"
                transform={`rotate(${deg} 50 50)`}
              />
            );
          })}

          {/* Hour Hand */}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="26"
            stroke={tintStyles.hourHand}
            strokeWidth="3.5"
            strokeLinecap="round"
            transform={`rotate(${hourAngle} 50 50)`}
          />

          {/* Minute Hand */}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="18"
            stroke={tintStyles.minuteHand}
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${minuteAngle} 50 50)`}
          />

          {/* Second Hand */}
          <line
            x1="50"
            y1="58"
            x2="50"
            y2="15"
            stroke="#EF4444"
            strokeWidth="1.2"
            strokeLinecap="round"
            transform={`rotate(${secondAngle} 50 50)`}
          />

          {/* Center Pin */}
          <circle cx="50" cy="50" r="3.5" fill="#0F172A" />
          <circle cx="50" cy="50" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Clock Details & Digital Display */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-heading font-bold text-sm text-[#0F172A]">
            {cityName}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
            {countryCode}
          </span>
        </div>

        <span className="font-mono text-xs font-bold text-[#0F172A] tracking-tight tabular-nums">
          {digitalString}
        </span>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isBusinessHours ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
            }`}
          />
          <span className="text-[10px] text-slate-500 font-medium">
            {isBusinessHours ? 'Active Office Hours' : 'After Hours (Queued)'}
          </span>
        </div>
      </div>
    </div>
  );
};
