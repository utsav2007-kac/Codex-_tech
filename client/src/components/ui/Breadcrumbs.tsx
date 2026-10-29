import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`py-3 text-xs text-slate-500 font-medium ${className}`}>
      <ol className="flex items-center flex-wrap gap-2">
        <li className="flex items-center">
          <Link to="/" className="hover:text-orange-500 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {item.path || item.href ? (
              <Link to={item.path || item.href || '/'} className="hover:text-orange-500 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-navy-900 font-semibold" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
