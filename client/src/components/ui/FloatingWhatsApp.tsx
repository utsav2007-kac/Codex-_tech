import React from 'react';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '../../config/site';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href={siteConfig.contact.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-30 p-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow-lg hover:shadow-emerald-700/30 transition-transform active:scale-95 flex items-center justify-center group"
      aria-label="Chat with Codex Tech-IT on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
        Chat with us
      </span>
    </a>
  );
};
