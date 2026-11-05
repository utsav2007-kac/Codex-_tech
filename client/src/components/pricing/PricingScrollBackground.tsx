import React from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export const PricingScrollBackground: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Multi-tier parallax scroll mappings
  const orb1Y = useTransform(scrollY, [0, 1000], [0, 140]);
  const orb2Y = useTransform(scrollY, [0, 1000], [0, -180]);
  const ringRotate = useTransform(scrollY, [0, 1000], [0, 45]);
  const meshScale = useTransform(scrollY, [0, 1000], [1, 1.15]);

  if (shouldReduceMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-blue-500/10 rounded-full filter blur-[110px]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* 3D Parallax Orb 1 (Warm Orange) */}
      <motion.div
        style={{ y: orb1Y, scale: meshScale }}
        className="absolute -top-20 right-[15%] w-[550px] h-[550px] bg-gradient-to-br from-orange-400/15 via-orange-500/10 to-transparent rounded-full filter blur-[100px] will-change-transform"
      />

      {/* 3D Parallax Orb 2 (Sky Blue) */}
      <motion.div
        style={{ y: orb2Y }}
        className="absolute top-[400px] -left-20 w-[480px] h-[480px] bg-gradient-to-tr from-blue-500/12 via-indigo-400/8 to-transparent rounded-full filter blur-[110px] will-change-transform"
      />

      {/* Floating 3D Depth Geometric Ring */}
      <motion.div
        style={{ rotate: ringRotate, y: orb1Y }}
        className="absolute top-28 right-[8%] w-48 h-48 border border-orange-300/30 rounded-full opacity-60 hidden lg:block will-change-transform"
      >
        <div className="absolute inset-4 border border-dashed border-blue-400/20 rounded-full" />
      </motion.div>

      {/* Floating Small Depth Pill */}
      <motion.div
        style={{ rotate: ringRotate, y: orb2Y }}
        className="absolute top-[520px] left-[5%] w-32 h-16 border border-slate-300/40 rounded-full opacity-40 hidden lg:block will-change-transform"
      />
    </div>
  );
};

