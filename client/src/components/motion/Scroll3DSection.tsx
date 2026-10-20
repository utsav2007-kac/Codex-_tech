import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export type Scroll3DPreset = 'lift' | 'fade3d' | 'tilt' | 'cinematic' | 'scaleIn';

export interface Scroll3DSectionProps extends Omit<HTMLMotionProps<'section'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  preset?: Scroll3DPreset;
  delay?: number;
  duration?: number;
  amount?: number;
  reverse?: boolean; // defaults to true for reversible animation on scroll
  id?: string;
}

const presets: Record<
  Scroll3DPreset,
  {
    initial: { opacity: number; y: number; rotateX: number; scale: number; z: number };
    whileInView: { opacity: number; y: number; rotateX: number; scale: number; z: number };
  }
> = {
  lift: {
    initial: { opacity: 0, y: 50, rotateX: 10, scale: 0.97, z: -50 },
    whileInView: { opacity: 1, y: 0, rotateX: 0, scale: 1, z: 0 },
  },
  fade3d: {
    initial: { opacity: 0, y: 35, rotateX: 6, scale: 0.98, z: -30 },
    whileInView: { opacity: 1, y: 0, rotateX: 0, scale: 1, z: 0 },
  },
  tilt: {
    initial: { opacity: 0, y: 60, rotateX: 14, scale: 0.95, z: -70 },
    whileInView: { opacity: 1, y: 0, rotateX: 0, scale: 1, z: 0 },
  },
  cinematic: {
    initial: { opacity: 0, y: 40, rotateX: 8, scale: 0.94, z: -90 },
    whileInView: { opacity: 1, y: 0, rotateX: 0, scale: 1, z: 0 },
  },
  scaleIn: {
    initial: { opacity: 0, y: 20, rotateX: 0, scale: 0.92, z: -80 },
    whileInView: { opacity: 1, y: 0, rotateX: 0, scale: 1, z: 0 },
  },
};

export const Scroll3DSection: React.FC<Scroll3DSectionProps> = ({
  children,
  className = '',
  preset = 'lift',
  delay = 0,
  duration = 0.8,
  amount = 0.08,
  reverse = true,
  id,
  style,
  ...rest
}) => {
  const chosen = presets[preset] || presets.lift;

  return (
    <motion.section
      id={id}
      initial={chosen.initial}
      whileInView={chosen.whileInView}
      viewport={{ once: !reverse, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        perspective: '1400px',
        transformStyle: 'preserve-3d',
        transformOrigin: '50% 20%',
        willChange: 'transform, opacity',
        ...style,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.section>
  );
};
