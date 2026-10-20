import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface Scroll3DCardProps {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  delay?: number;
  maxTilt?: number;
  reverse?: boolean; // reverse animation when scrolling back up
  index?: number;
}

export const Scroll3DCard: React.FC<Scroll3DCardProps> = ({
  children,
  className = '',
  wrapperClassName = '',
  delay = 0,
  maxTilt = 7,
  reverse = true,
  index = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: 50, y: 50 });

  const calculatedDelay = delay || Math.min((index % 4) * 0.08, 0.35);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    setTiltStyle({
      rotateX: Number(rotX.toFixed(2)),
      rotateY: Number(rotY.toFixed(2)),
      scale: 1.02,
    });
    setGlareStyle({
      opacity: 0.18,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ rotateX: 0, rotateY: 0, scale: 1 });
    setGlareStyle({ opacity: 0, x: 50, y: 50 });
  };

  // Separate any grid column / row span classes for the outer motion container
  const rawClasses = className.split(/\s+/).filter(Boolean);
  const layoutClasses: string[] = [];
  const innerClasses: string[] = [];

  for (const cls of rawClasses) {
    if (
      cls.includes('col-span') ||
      cls.includes('col-start') ||
      cls.includes('col-end') ||
      cls.includes('row-span') ||
      cls.includes('row-start') ||
      cls.includes('row-end') ||
      cls.startsWith('col-') ||
      cls.startsWith('sm:col-') ||
      cls.startsWith('md:col-') ||
      cls.startsWith('lg:col-') ||
      cls.startsWith('xl:col-') ||
      cls.startsWith('2xl:col-')
    ) {
      layoutClasses.push(cls);
    } else {
      innerClasses.push(cls);
    }
  }

  const finalWrapperClass = `w-full h-full ${layoutClasses.join(' ')} ${wrapperClassName}`.trim();
  const finalInnerClass = `relative overflow-hidden transition-shadow duration-300 w-full h-full ${innerClasses.join(' ')}`.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, rotateX: 12, z: -40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, z: 0, scale: 1 }}
      viewport={{ once: !reverse, amount: 0.12 }}
      transition={{
        duration: 0.65,
        delay: calculatedDelay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
      }}
      className={finalWrapperClass}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tiltStyle.rotateX}deg) rotateY(${tiltStyle.rotateY}deg) scale3d(${tiltStyle.scale}, ${tiltStyle.scale}, 1)`,
          transition: 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
          transformStyle: 'preserve-3d',
        }}
        className={finalInnerClass}
      >
        {/* Specular glare overlay */}
        <div
          className="pointer-events-none absolute -inset-full transition-opacity duration-300"
          style={{
            opacity: glareStyle.opacity,
            background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 65%)`,
          }}
        />
        {children}
      </div>
    </motion.div>
  );
};
