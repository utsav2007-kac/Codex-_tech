import React from 'react';
import { motion } from 'framer-motion';

interface TextRevealProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'span';
  className?: string;
  delay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  as: Tag = 'h2',
  className = '',
  delay = 0,
}) => {
  const words = children.split(' ');

  return (
    <Tag className={`inline-block overflow-hidden leading-[1.25] ${className}`}>
      <span className="inline-flex flex-wrap gap-x-[0.28em] overflow-hidden leading-[1.25] pb-1.5 pt-0.5">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden py-0.5 pb-2 leading-[1.25]">
            <motion.span
              className="inline-block pb-0.5"
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: delay + i * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
};
