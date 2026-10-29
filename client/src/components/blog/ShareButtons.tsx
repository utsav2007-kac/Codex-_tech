import React, { useState } from 'react';
import { Copy, Check, Linkedin, Twitter, MessageCircle, Mail } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
      color: 'hover:text-[#0A66C2] hover:bg-[#0A66C2]/10'
    },
    {
      name: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Twitter,
      color: 'hover:text-slate-900 hover:bg-slate-100'
    },
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: MessageCircle,
      color: 'hover:text-[#25D366] hover:bg-[#25D366]/10'
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=Check%20out%20this%20article:%20${encodedUrl}`,
      icon: Mail,
      color: 'hover:text-orange-600 hover:bg-orange-50'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
      <h3 className="font-bold text-slate-900 text-sm mb-3">Share this article</h3>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Link copied' : 'Copy article link'}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy link</span>
            </>
          )}
        </button>

        {shareLinks.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${item.name}`}
              className={`p-2 rounded-lg border border-slate-200 text-slate-500 transition-colors flex items-center justify-center ${item.color}`}
            >
              <Icon className="w-4 h-4" />
            </a>
          );
        })}
      </div>
    </div>
  );
};
