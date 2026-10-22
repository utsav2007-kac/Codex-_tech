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
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}
    >
      {/* Soft Blue Tint (Lower Left / Center of Right Column) */}
      <div
        className="absolute top-[18%] -right-[8%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full filter blur-[90px] opacity-[0.16] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #DCEBFA 0%, rgba(220, 235, 250, 0) 70%)',
        }}
      />
      {/* Soft Orange Glow (Upper Right - safely padded from top edge to prevent any cutoff) */}
      <div
        className="absolute top-[4%] -right-[6%] w-[38vw] h-[38vw] max-w-[500px] max-h-[500px] rounded-full filter blur-[90px] opacity-[0.08] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #F15A34 0%, rgba(241, 90, 52, 0) 70%)',
        }}
      />
    </div>
  );
};
