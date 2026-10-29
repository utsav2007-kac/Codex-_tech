import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, List } from 'lucide-react';

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TocHeading[];
  isMobile?: boolean;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ headings, isMobile = false }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(!isMobile);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Choose the topmost visible heading
          const topEntry = visibleEntries.reduce((prev, curr) =>
            curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
          );
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.1
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const yOffset = -96; // Space for fixed navbar
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
      if (isMobile) {
        setIsExpanded(false);
      }
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-slate-900 text-base">
          <List className="w-4 h-4 text-orange-500" />
          <span>Table of Contents</span>
        </h3>
        {isMobile && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label="Toggle Table of Contents"
            className="p-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {isExpanded && (
        <ul className="mt-4 space-y-2 border-l border-slate-100 pl-2 text-sm">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <li
                key={heading.id}
                className={`${heading.level === 3 ? 'ml-3' : ''}`}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleClick(e, heading.id)}
                  className={`block py-1 text-xs transition-colors leading-normal ${
                    isActive
                      ? 'text-orange-600 font-bold border-l-2 border-orange-500 -ml-[9px] pl-2 bg-orange-50/50 rounded-r'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
};
