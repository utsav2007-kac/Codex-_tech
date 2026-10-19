import React from 'react';

export const GradientMesh: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`} aria-hidden="true">
      {/* Right Top Warm Orange Glow - Kept strictly behind the 3D scene (right side) */}
      <div
        className="absolute -top-[10%] -right-[5%] w-[42vw] h-[42vw] max-w-[550px] max-h-[550px] rounded-full filter blur-[60px] opacity-18 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #F25C2A 0%, rgba(242, 92, 42, 0) 70%)',
          animation: 'pulse 8s ease-in-out infinite',
        }}
      />
      {/* Right Center Soft Blue Ambient Orb */}
      <div
        className="absolute top-[25%] -right-[8%] w-[45vw] h-[45vw] max-w-[580px] max-h-[580px] rounded-full filter blur-[70px] opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #1F6AA5 0%, rgba(31, 106, 165, 0) 70%)',
          animation: 'pulse 10s ease-in-out infinite 1s',
        }}
      />
      {/* Right Bottom Soft Navy/Amber Depth */}
      <div
        className="absolute bottom-[5%] right-[10%] w-[32vw] h-[32vw] max-w-[420px] max-h-[420px] rounded-full filter blur-[60px] opacity-12 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #12304D 0%, rgba(18, 48, 77, 0) 70%)',
        }}
      />
      {/* Subtle recurring X-person motif watermark (3% opacity) on the right */}
      <div
        className="absolute top-1/2 right-[15%] -translate-y-1/2 w-80 h-80 opacity-[0.03] bg-no-repeat bg-contain pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/logo.svg)',
        }}
      />
    </div>
  );
};
