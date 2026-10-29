import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PrismWipeProps {
  locationKey: string;
}

export const PrismWipe: React.FC<PrismWipeProps> = ({ locationKey }) => {
  const isFirstLoad = useRef(true);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return; // Never play on initial page load
    }
    setActiveKey(locationKey);
  }, [locationKey]);

  // Do not play on initial load
  if (!activeKey || isFirstLoad.current) {
    return null;
  }

  const slats = [
    { bg: 'bg-navy-900', delay: 0 },
    { bg: 'bg-orange-500', delay: 0.03 },
    { bg: 'bg-blue-600', delay: 0.06 },
    { bg: 'bg-navy-800', delay: 0.09 },
    { bg: 'bg-orange-600', delay: 0.12 },
  ];

  return (
    <div
      key={`prism-${activeKey}`}
      className="fixed inset-0 z-40 pointer-events-none flex"
      style={{ perspective: '1200px' }}
      aria-hidden="true"
    >
      {slats.map((slat, idx) => (
        <motion.div
          key={idx}
          className={`flex-1 h-full ${slat.bg} pointer-events-none`}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{
            rotateY: [90, 0, -90],
            opacity: [0, 0.85, 0],
          }}
          transition={{
            duration: 0.45,
            delay: slat.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  );
};
