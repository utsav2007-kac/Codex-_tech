import React, { useState, useEffect } from 'react';

export const ReadingProgress: React.FC = () => {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setCompletion(Math.min(100, Math.max(0, Number((currentProgress / scrollHeight).toFixed(2)) * 100)));
      }
    };

    window.addEventListener('scroll', updateScrollCompletion, { passive: true });
    updateScrollCompletion();

    return () => {
      window.removeEventListener('scroll', updateScrollCompletion);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Article reading progress"
      aria-valuenow={Math.round(completion)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 w-full h-1 z-[100] bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-orange-500 transition-all duration-75 ease-out"
        style={{ width: `${completion}%` }}
      />
    </div>
  );
};

export default ReadingProgress;
