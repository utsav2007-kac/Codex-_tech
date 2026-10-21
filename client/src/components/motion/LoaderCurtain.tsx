import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoaderCurtain: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on first visit per session
    const hasVisited = sessionStorage.getItem('codex_visited_curtain');
    if (!hasVisited) {
      setIsVisible(true);
      sessionStorage.setItem('codex_visited_curtain', 'true');
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSkip = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="curtain-container"
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, delay: 0.35, ease: 'easeOut' }}
        >
          {/* Left Panel */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: '-102%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="absolute inset-y-0 left-0 w-[52%] bg-navy-900 border-0 outline-none ring-0 shadow-none pointer-events-none"
          />

          {/* Right Panel */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: '102%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="absolute inset-y-0 right-0 w-[52%] bg-navy-900 border-0 outline-none ring-0 shadow-none pointer-events-none"
          />

          {/* Center Logo Draw & Brand Reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-64 h-24 mb-4 flex items-center justify-center">
              <img src="/assets/logo-white.svg" alt="Codex Tech-IT" className="w-full h-auto object-contain" />
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 140 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="h-1 bg-gradient-to-r from-orange-500 to-blue-600 rounded-full"
            />
            <p className="mt-3 text-xs uppercase tracking-widest text-slate-400 font-semibold font-heading">
              We Deliver Jobs Faster
            </p>

            <button
              onClick={handleSkip}
              className="mt-6 text-xs text-slate-400 hover:text-white transition-colors underline underline-offset-4 focus:outline-none"
            >
              Skip intro
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
