import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isExternal?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  isExternal = false,
  className = '',
  children,
  onClick,
  ...props
}) => {
  const btnRef = useRef<HTMLElement | null>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const baseStyles = 'relative inline-flex items-center justify-center font-heading font-semibold rounded-xl tracking-tight transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm sm:text-base px-5 py-2.5 gap-2',
    lg: 'text-base sm:text-lg px-7 py-3.5 gap-2.5',
  }[size];

  const variantStyles = {
    primary: 'bg-[#C2410C] hover:bg-[#9A3412] text-white shadow-elevated focus:ring-orange-600 border border-orange-600/30',
    secondary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-600 border border-blue-500/30',
    outline: 'bg-white hover:bg-slate-50 text-[#0F172A] border-[1.5px] border-[#0F172A] shadow-sm hover:shadow focus:ring-[#0F172A]',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-800 focus:ring-slate-300',
    white: 'bg-white hover:bg-gray-50 text-navy-900 shadow-md focus:ring-white border border-gray-200',
  }[variant];

  const handlePointerDown = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const rippleElements = ripples.map((r) => (
    <span
      key={r.id}
      className="absolute bg-white/30 rounded-full pointer-events-none animate-ping"
      style={{
        left: r.x,
        top: r.y,
        width: 120,
        height: 120,
        transform: 'translate(-50%, -50%)',
      }}
    />
  ));

  const combinedClass = `${baseStyles} ${sizeStyles} ${variantStyles} ${className}`;

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClass}
          onMouseDown={handlePointerDown}
        >
          {children}
          {rippleElements}
        </a>
      );
    }
    return (
      <Link to={href} className={combinedClass} onMouseDown={handlePointerDown}>
        {children}
        {rippleElements}
      </Link>
    );
  }

  return (
    <button
      className={combinedClass}
      onClick={onClick}
      onMouseDown={handlePointerDown}
      {...props}
    >
      {children}
      {rippleElements}
    </button>
  );
};
