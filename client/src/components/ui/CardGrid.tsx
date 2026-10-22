import React from 'react';
import { Scroll3DCard } from '../motion/Scroll3DCard';

export type CardGridColumns = 1 | 2 | 3 | 4 | 'responsive-4' | 'responsive-3' | 'responsive-2';
export type CardGridGap = 'sm' | 'md' | 'lg';

export interface CardGridProps {
  children: React.ReactNode;
  columns?: CardGridColumns;
  gap?: CardGridGap;
  className?: string;
  subgrid?: boolean;
}

const columnClasses: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  'responsive-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  'responsive-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  'responsive-2': 'grid-cols-1 md:grid-cols-2',
};

const gapClasses: Record<CardGridGap, string> = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-6 lg:gap-8',
};

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 'responsive-4',
  gap = 'md',
  className = '',
  subgrid = false,
}) => {
  const colClass = columnClasses[String(columns)] || columnClasses['responsive-4'];
  const gapClass = gapClasses[gap] || gapClasses.md;
  const subgridClass = subgrid ? 'card-grid-subgrid' : '';

  return (
    <div
      className={`grid ${colClass} ${gapClass} items-stretch w-full ${subgridClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export interface CardProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
  wrapperClassName?: string;
  variant?: 'glass' | 'white' | 'slate' | 'navy';
  subgrid?: boolean;
  delay?: number;
}

const variantStyles: Record<string, string> = {
  glass: 'glass-card border border-gray-100/90 shadow-sm hover:border-orange-500/40',
  white: 'bg-white border border-gray-200/80 shadow-sm hover:border-orange-500/30 hover:shadow-md',
  slate: 'bg-slate-50/80 border border-gray-200/90 shadow-sm hover:border-orange-500/30',
  navy: 'bg-navy-900 text-white border border-navy-800 shadow-xl',
};

export const Card: React.FC<CardProps> & {
  Header: React.FC<{ children: React.ReactNode; className?: string }>;
  Title: React.FC<{ children: React.ReactNode; className?: string; as?: 'h2' | 'h3' | 'h4' }>;
  Description: React.FC<{ children: React.ReactNode; className?: string }>;
  Body: React.FC<{ children: React.ReactNode; className?: string }>;
  Footer: React.FC<{ children: React.ReactNode; className?: string }>;
} = ({
  children,
  index = 0,
  className = '',
  wrapperClassName = '',
  variant = 'white',
  subgrid = false,
  delay,
}) => {
  const variantClass = variantStyles[variant] || variantStyles.white;
  const subgridClass = subgrid ? 'card-subgrid-item' : '';

  return (
    <Scroll3DCard
      index={index}
      delay={delay}
      wrapperClassName={`h-full flex flex-col ${wrapperClassName}`.trim()}
      className={`p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between h-full w-full ${variantClass} ${subgridClass} ${className}`.trim()}
    >
      {children}
    </Scroll3DCard>
  );
};

Card.Header = ({ children, className = '' }) => (
  <div className={`card-slot-header mb-4 ${className}`.trim()}>{children}</div>
);

Card.Title = ({ children, className = '', as: Component = 'h3' }) => (
  <Component className={`card-slot-title font-heading font-bold text-base sm:text-lg text-navy-900 mb-2 leading-snug ${className}`.trim()}>
    {children}
  </Component>
);

Card.Description = ({ children, className = '' }) => (
  <p className={`card-slot-desc text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-4 ${className}`.trim()}>
    {children}
  </p>
);

Card.Body = ({ children, className = '' }) => (
  <div className={`flex-1 flex flex-col ${className}`.trim()}>{children}</div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`card-slot-footer mt-auto pt-4 border-t border-gray-100 ${className}`.trim()}>
    {children}
  </div>
);
