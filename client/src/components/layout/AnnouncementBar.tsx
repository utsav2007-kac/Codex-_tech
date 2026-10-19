import React from 'react';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '../../config/site';

interface AnnouncementBarProps {
  onOpenConsultation: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenConsultation }) => {
  return (
    <aside aria-label="Announcement" className="bg-navy-900 border-b border-navy-800 text-white text-xs sm:text-sm py-2 px-4 transition-all">
      <div className="container-custom flex items-center justify-center text-center">
        <button
          onClick={onOpenConsultation}
          className="inline-flex items-center gap-2 font-medium text-slate-300 hover:text-white transition-colors group cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping inline-block" />
          <span>{siteConfig.announcement}</span>
          <ArrowRight className="w-3.5 h-3.5 text-orange-500 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </aside>
  );
};
