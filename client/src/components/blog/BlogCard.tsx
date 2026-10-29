import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export interface BlogPostCardData {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  cover_alt?: string;
  published_at: string | Date;
  reading_time_min?: number;
}

interface BlogCardProps {
  post: BlogPostCardData;
  subgrid?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, subgrid = false }) => {
  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="h-full">
      <Link
        to={`/blog/${post.slug}`}
        className={`group flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-transform duration-200 hover:-translate-y-1 overflow-hidden h-full ${
          subgrid ? 'grid grid-rows-[auto_auto_minmax(4.5rem,auto)_1fr]' : ''
        }`}
      >
        {/* 16:9 Cover Image */}
        <div className="aspect-video w-full overflow-hidden bg-slate-100 flex-shrink-0">
          <img
            src={post.cover_image}
            alt={post.cover_alt || post.title}
            width={640}
            height={360}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Card Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Date with calendar icon */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>

          {/* Bold Title (Max 3 lines) */}
          <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-3 mb-2.5 group-hover:text-orange-600 transition-colors">
            {post.title}
          </h3>

          {/* Light Grey Excerpt (Max 3 lines) */}
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mt-auto">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
