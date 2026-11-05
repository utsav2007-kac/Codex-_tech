import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Interactive3DPricingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  isFeatured?: boolean;
}

export const Interactive3DPricingCard: React.FC<Interactive3DPricingCardProps> = ({
  children,
  className = '',
  delay = 0,
  isFeatured = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [glare, setGlare] = useState({ opacity: 0, x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxTilt = isFeatured ? 8 : 7;
    const rotX = ((y - centerY) / centerY) * -maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    setTilt({
      rotateX: Number(rotX.toFixed(2)),
      rotateY: Number(rotY.toFixed(2)),
      scale: 1.02,
    });

    setGlare({
      opacity: 0.2,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
    setGlare({ opacity: 0, x: 50, y: 50 });
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, rotateX: 10, scale: 0.95 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
      }}
      className={`w-full flex flex-col h-full ${className}`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: shouldReduceMotion
            ? 'none'
            : `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.scale}, ${tilt.scale}, 1)`,
          transition: 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease',
          transformStyle: 'preserve-3d',
        }}
        className={`relative overflow-hidden rounded-3xl flex flex-col flex-1 transition-all duration-300 ${
          isFeatured
            ? 'border-2 border-[#C2410C] shadow-xl hover:shadow-2xl hover:shadow-orange-500/20 md:-translate-y-2'
            : 'border border-[#E2E8F0] shadow-sm hover:shadow-xl'
        } bg-white`}
      >
        {/* Specular Interactive 3D Glare */}
        {!shouldReduceMotion && (
          <div
            className="pointer-events-none absolute -inset-full transition-opacity duration-300 z-30"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 60%)`,
            }}
          />
        )}

        {/* Ambient Subtle Shimmer Rim on Featured Card */}
        {isFeatured && !shouldReduceMotion && (
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-orange-500/10 via-transparent to-blue-500/10 opacity-70 z-0" />
        )}

        <div className="relative z-10 flex flex-col flex-1">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

