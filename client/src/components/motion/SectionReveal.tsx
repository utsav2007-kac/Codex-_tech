import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export type Reveal3DVariant =
  | 'tiltUp'
  | 'tiltDown'
  | 'tiltLeft'
  | 'tiltRight'
  | 'depthZoom'
  | 'flip3D';

export interface SectionRevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: Reveal3DVariant;
  amount?: number;
  reverse?: boolean; // defaults to true for bidirectional scrolling
  perspective?: number;
}

const variantStyles: Record<
  Reveal3DVariant,
  {
    initial: { opacity: number; x?: number; y?: number; rotateX?: number; rotateY?: number; scale?: number; z?: number };
    visible: { opacity: number; x?: number; y?: number; rotateX?: number; rotateY?: number; scale?: number; z?: number };
  }
> = {
  tiltUp: {
    initial: { opacity: 0, y: 45, rotateX: 12, scale: 0.96, z: -60 },
    visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, z: 0 },
  },
  tiltDown: {
    initial: { opacity: 0, y: -45, rotateX: -12, scale: 0.96, z: -60 },
    visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, z: 0 },
  },
  tiltLeft: {
    initial: { opacity: 0, x: -50, rotateY: -10, scale: 0.96, z: -50 },
    visible: { opacity: 1, x: 0, rotateY: 0, scale: 1, z: 0 },
  },
  tiltRight: {
    initial: { opacity: 0, x: 50, rotateY: 10, scale: 0.96, z: -50 },
    visible: { opacity: 1, x: 0, rotateY: 0, scale: 1, z: 0 },
  },
  depthZoom: {
    initial: { opacity: 0, scale: 0.91, z: -100 },
    visible: { opacity: 1, scale: 1, z: 0 },
  },
  flip3D: {
    initial: { opacity: 0, y: 35, rotateX: 18, scale: 0.95 },
    visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, z: 0 },
  },
};

export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  variant = 'tiltUp',
  amount = 0.12,
  reverse = true,
  perspective = 1200,
  style,
  ...rest
}) => {
  const chosenVariant = variantStyles[variant] || variantStyles.tiltUp;

  return (
    <motion.div
      initial={chosenVariant.initial}
      whileInView={chosenVariant.visible}
      viewport={{ once: !reverse, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        transformOrigin: variant === 'tiltDown' ? 'bottom center' : 'top center',
        willChange: 'transform, opacity',
        ...style,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
