import React from 'react';

/**
 * GradientMesh Component
 * Light Wash for Hero Section:
 * - Soft orange #F15A34 (10% alpha, upper right)
 * - Soft blue #DCEBFA (70% alpha, lower left)
 * - Edge feathered to transparent (no visible rectangle edge)
 * - Zero watermark, zero dark maroon/navy blobs
 */
export const GradientMesh: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
      style={{
        maskImage: 'radial-gradient(closest-side, #000 60%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(closest-side, #000 60%, transparent 100%)',
      }}
    >
      {/* Soft Blue Tint (Lower Left / Center of Right Column) */}
      <div
        className="absolute top-[18%] -right-[8%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full filter blur-[90px] opacity-[0.20] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #DCEBFA 0%, rgba(220, 235, 250, 0) 70%)',
        }}
      />
      {/* Soft Orange Glow (Upper Right) */}
      <div
        className="absolute -top-[12%] -right-[6%] w-[38vw] h-[38vw] max-w-[500px] max-h-[500px] rounded-full filter blur-[80px] opacity-[0.10] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #F15A34 0%, rgba(241, 90, 52, 0) 70%)',
        }}
      />
    </div>
  );
};
