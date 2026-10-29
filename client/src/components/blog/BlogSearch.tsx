import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface BlogSearchProps {
  value: string;
  onChange: (query: string) => void;
  className?: string;
}

export const BlogSearch: React.FC<BlogSearchProps> = ({ value, onChange, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== value) {
        onChange(searchTerm);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, onChange, value]);

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <label htmlFor="blog-search-input" className="sr-only">
        Search blogs by name
      </label>
      <div className="absolute left-3 pointer-events-none text-slate-400 flex items-center">
        <Search className="w-4 h-4" />
      </div>
      <input
        id="blog-search-input"
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search blogs by name..."
        className="w-full sm:w-72 pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search input"
          className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default BlogSearch;
