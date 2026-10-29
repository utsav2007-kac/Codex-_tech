import React, { useState } from 'react';

export interface AuthorData {
  id?: number;
  name: string;
  role?: string;
  bio?: string;
  avatar?: string;
}

interface AuthorBoxProps {
  author: AuthorData;
}

export const AuthorBox: React.FC<AuthorBoxProps> = ({ author }) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="my-10 p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-sm">
      {/* Avatar or Fallback Initials */}
      {author.avatar && !imgError ? (
        <img
          src={author.avatar}
          alt={author.name}
          width={72}
          height={72}
          onError={() => setImgError(true)}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-orange-500/20 shadow-sm flex-shrink-0"
        />
      ) : (
        <div
          role="img"
          aria-label={author.name}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-navy-900 to-slate-800 border-2 border-orange-500/30 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-sm"
        >
          {getInitials(author.name)}
        </div>
      )}

      {/* Author Bio */}
      <div className="text-center sm:text-left flex-1">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1">
          <h4 className="text-lg font-bold text-slate-900">{author.name}</h4>
          {author.role && (
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 self-center sm:self-auto">
              {author.role}
            </span>
          )}
        </div>
        <p className="text-slate-600 text-sm leading-relaxed mt-2">
          {author.bio ||
            'Technical advisor and engineering hiring specialist at Codex Tech-IT, guiding senior developers through high-impact career growth.'}
        </p>
      </div>
    </div>
  );
};
