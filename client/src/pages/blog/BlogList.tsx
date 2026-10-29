import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { BlogCard, BlogPostCardData } from '../../components/blog/BlogCard';
import { BlogSearch } from '../../components/blog/BlogSearch';
import { SEO } from '../../components/ui/SEO';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { FALLBACK_BLOG_POSTS } from '../../data/blogData';

interface BlogListResponse {
  items: BlogPostCardData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const BlogList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const queryParam = searchParams.get('q') || '';

  const [posts, setPosts] = useState<BlogPostCardData[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPostCardData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async (page: number, q: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch paginated posts for All Blogs
      const res = await api.get<{ success: boolean; data: BlogListResponse }>('/blog/posts', {
        params: {
          page,
          limit: 6,
          q: q || undefined
        }
      });

      if (res.data.success && res.data.data && res.data.data.items?.length > 0) {
        setPosts(res.data.data.items);
        setTotal(res.data.data.total);
        setTotalPages(res.data.data.totalPages);
      } else {
        throw new Error('No posts returned from API');
      }

      // 2. Fetch the 2 newest posts for Recent Blogs (on initial load or when not cached)
      if (page === 1 && !q) {
        const recentRes = await api.get<{ success: boolean; data: BlogListResponse }>('/blog/posts', {
          params: { page: 1, limit: 2 }
        });
        if (recentRes.data.success && recentRes.data.data?.items?.length > 0) {
          setRecentPosts(recentRes.data.data.items);
        } else {
          setRecentPosts(FALLBACK_BLOG_POSTS.slice(0, 2));
        }
      }
    } catch (err: any) {
      console.warn('Backend blog API unreachable, using verified recruiting repository:', err?.message);
      // Graceful fallback from verified seeded repository
      let filtered = FALLBACK_BLOG_POSTS;
      if (q && q.trim()) {
        const queryTerm = q.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(queryTerm) ||
            p.excerpt.toLowerCase().includes(queryTerm)
        );
      }
      const limit = 6;
      const totalCount = filtered.length;
      const pages = Math.max(1, Math.ceil(totalCount / limit));
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      setPosts(paginated);
      setTotal(totalCount);
      setTotalPages(pages);
      setRecentPosts(FALLBACK_BLOG_POSTS.slice(0, 2));
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs(pageParam, queryParam);
  }, [fetchBlogs, pageParam, queryParam]);

  const handleSearchChange = (query: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (query) {
      nextParams.set('q', query);
      nextParams.set('page', '1');
    } else {
      nextParams.delete('q');
      nextParams.set('page', '1');
    }
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', newPage.toString());
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearSearch = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('q');
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://codextechit.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://codextechit.com/blog'
      }
    ]
  };

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title="Blogs"
        description="Explore technical engineering guides, ATS resume optimization protocols, and US IT hiring benchmarks from Codex Tech-IT advisors."
        canonical="/blog"
        type="website"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Main Container - Standard site container with consistent top padding under navbar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20">
        {/* 1. Header Section: Title & Intro */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Blogs
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Practical insights, technical architectures, and career strategies authored by Codex Tech-IT’s senior advisors and enterprise recruitment leads.
          </p>
        </div>

        {/* 2. Recent Blogs Section (Shown when no search query is active) */}
        {!queryParam && recentPosts.length > 0 && (
          <section aria-labelledby="recent-blogs-heading" className="mb-14">
            <h2 id="recent-blogs-heading" className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              Recent Blogs
            </h2>
            <hr className="border-slate-200 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {recentPosts.map((post) => (
                <BlogCard key={`recent-${post.id}`} post={post} subgrid />
              ))}
            </div>
          </section>
        )}

        {/* 3. All Blogs Section Heading & Search Row */}
        <section aria-labelledby="all-blogs-heading">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div className="flex items-baseline gap-2">
              <h2 id="all-blogs-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
                All Blogs
              </h2>
              <span className="text-sm font-medium text-slate-500">
                ({total} total)
              </span>
            </div>
            <BlogSearch
              value={queryParam}
              onChange={handleSearchChange}
              className="w-full sm:w-auto"
            />
          </div>
          <hr className="border-slate-200 mb-8" />

          {/* Error State */}
          {error && (
            <div className="my-8 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-slate-800 font-semibold mb-3">{error}</p>
              <button
                type="button"
                onClick={() => fetchBlogs(pageParam, queryParam)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeleton Grid */}
          {isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 mb-12">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={`skeleton-${n}`}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-pulse"
                >
                  <div className="aspect-video bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3.5 bg-slate-200 rounded w-24" />
                    <div className="h-5 bg-slate-200 rounded w-5/6" />
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-3.5 bg-slate-100 rounded w-full pt-4" />
                    <div className="h-3.5 bg-slate-100 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && posts.length === 0 && (
            <div className="py-16 text-center bg-slate-50 border border-slate-200 rounded-2xl my-8">
              <p className="text-slate-700 text-base font-semibold mb-2">
                No blog articles found matching &quot;{queryParam}&quot;.
              </p>
              <p className="text-slate-500 text-sm mb-6">
                Try searching for other terms like &quot;ATS&quot;, &quot;Kubernetes&quot;, or &quot;Interview&quot;.
              </p>
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* 4. Card Grid: 3 cols at 1280px+, 2 at 768px+, 1 below */}
          {!isLoading && !error && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 mb-12">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} subgrid />
              ))}
            </div>
          )}

          {/* 5. Pagination Buttons */}
          {!isLoading && totalPages > 1 && (
            <nav
              aria-label="Blog pagination"
              className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100"
            >
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, pageParam - 1))}
                disabled={pageParam <= 1}
                className="px-3.5 py-2 text-sm font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isCurrent = pageNum === pageParam;
                return (
                  <button
                    key={`page-${pageNum}`}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={`w-10 h-10 text-sm font-semibold rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, pageParam + 1))}
                disabled={pageParam >= totalPages}
                className="px-3.5 py-2 text-sm font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </nav>
          )}
        </section>
      </main>
    </div>
  );
};

export default BlogList;
