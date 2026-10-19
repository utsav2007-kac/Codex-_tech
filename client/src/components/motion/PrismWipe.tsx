import React from 'react';
import { motion } from 'framer-motion';

interface PrismWipeProps {
  locationKey: string;
}

export const PrismWipe: React.FC<PrismWipeProps> = ({ locationKey }) => {
  const slats = [
    { bg: 'bg-navy-900', delay: 0 },
    { bg: 'bg-orange-500', delay: 0.05 },
    { bg: 'bg-blue-600', delay: 0.1 },
    { bg: 'bg-navy-800', delay: 0.15 },
    { bg: 'bg-orange-600', delay: 0.2 },
  ];

  return (
    <div
      key={`prism-${locationKey}`}
      className="fixed inset-0 z-40 pointer-events-none flex"
      style={{ perspective: '1200px' }}
      aria-hidden="true"
    >
      {slats.map((slat, idx) => (
        <motion.div
          key={idx}
          className={`flex-1 h-full ${slat.bg}`}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{
            rotateY: [90, 0, -90],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.65,
            delay: slat.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  );
};
