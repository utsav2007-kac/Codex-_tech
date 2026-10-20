import React from 'react';
import { PhoneCall, Sparkles } from 'lucide-react';

interface StickyMobileCTAProps {
  onOpenConsultation: () => void;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({ onOpenConsultation }) => {
  return (
    <aside aria-label="Mobile Action Bar" className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 shadow-2xl flex items-center gap-3">
      <button
        onClick={onOpenConsultation}
        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-heading font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-elevated transition-transform active:scale-95"
      >
        <PhoneCall className="w-4 h-4" />
        <span>Book Free Consultation</span>
      </button>
      <a
        href="/careers"
        className="bg-navy-900 text-white font-heading font-semibold text-xs py-3 px-3.5 rounded-xl flex items-center gap-1.5 shrink-0"
      >
        <Sparkles className="w-3.5 h-3.5 text-orange-400" />
        <span>View Jobs</span>
      </a>
    </aside>
  );
};
