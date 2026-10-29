import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { BlogPostCardData } from '../blog/BlogCard';
import { FALLBACK_BLOG_POSTS } from '../../data/blogData';

export const HomeBlogTeaser: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostCardData[]>([]);

  useEffect(() => {
    api
      .get<{ success: boolean; data: { items: BlogPostCardData[] } }>('/blog/posts', {
        params: { page: 1, limit: 3 }
      })
      .then((res) => {
        if (res.data?.success && res.data.data?.items?.length > 0) {
          setPosts(res.data.data.items.slice(0, 3));
        } else {
          setPosts(FALLBACK_BLOG_POSTS.slice(0, 3));
        }
      })
      .catch(() => {
        setPosts(FALLBACK_BLOG_POSTS.slice(0, 3));
      });
  }, []);

  return (
    <section
      data-nav-theme="light"
      className="py-20 bg-[#F8FAFC] border-b border-[#E2E8F0] relative overflow-hidden"
    >
      <div className="container-custom max-w-7xl">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#C2410C] border border-orange-200/90 mb-3 shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>Engineering & Staffing Publications</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#0F172A] tracking-tight">
              Practical Guides for Tech Hiring & Careers
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#475569] max-w-2xl font-normal">
              Direct frameworks, ATS resume standards, and compensation benchmarks from our practicing technical leads.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#C2410C] hover:text-[#9A3412] group transition-colors shrink-0"
          >
            <span>View all articles</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Equal-Height Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {posts.map((post) => {
            const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <article key={post.id} className="h-full flex flex-col">
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full"
                >
                  {/* 16:9 Cover Image */}
                  <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={post.cover_image}
                      alt={post.cover_alt || post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.reading_time_min && (
                      <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-[#0F172A] px-2.5 py-0.5 rounded-full border border-slate-200/80 shadow-xs flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {post.reading_time_min} min read
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formattedDate}</span>
                      </div>
                      <h3 className="font-bold text-lg text-[#0F172A] group-hover:text-[#C2410C] transition-colors leading-snug line-clamp-2 mb-3">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[#475569] leading-relaxed line-clamp-3 font-normal">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-bold text-[#C2410C] group-hover:text-[#9A3412]">
                      <span>Read Full Article</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
