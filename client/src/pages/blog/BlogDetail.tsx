import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { SEO } from '../../components/ui/SEO';
import { TableOfContents, TocHeading } from '../../components/blog/TableOfContents';
import { ShareButtons } from '../../components/blog/ShareButtons';
import { FaqAccordion, FaqItem } from '../../components/blog/FaqAccordion';
import { AuthorBox, AuthorData } from '../../components/blog/AuthorBox';
import { ReadingProgress } from '../../components/blog/ReadingProgress';
import { RelatedPosts } from '../../components/blog/RelatedPosts';
import { BlogPostCardData } from '../../components/blog/BlogCard';
import { Calendar, Clock, ArrowUp, Mail, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { getFallbackBlogBySlug } from '../../data/blogData';

interface ArticleDetailData {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  cover_image: string;
  cover_alt?: string;
  published_at: string;
  updated_at?: string;
  reading_time_min: number;
  author: AuthorData;
  faqs: FaqItem[];
  prev?: { slug: string; title: string; category?: string } | null;
  next?: { slug: string; title: string; category?: string } | null;
  related?: BlogPostCardData[];
}

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<ArticleDetailData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Newsletter state in sidebar
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);

    api
      .get<{ success: boolean; data: ArticleDetailData }>(`/blog/posts/${slug}`)
      .then((res) => {
        if (res.data.success && res.data.data) {
          setPost(res.data.data);
        } else {
          const fallback = getFallbackBlogBySlug(slug);
          if (fallback) {
            setPost(fallback as ArticleDetailData);
          } else {
            setError('Article not found');
          }
        }
      })
      .catch((err) => {
        console.warn('Backend API unavailable for article, using seeded article:', err?.message);
        const fallback = getFallbackBlogBySlug(slug);
        if (fallback) {
          setPost(fallback as ArticleDetailData);
          setError(null);
        } else {
          setError('Article not found or failed to load');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  // Extract H2 and H3 headings and inject IDs into HTML
  const { processedHtml, headings } = useMemo(() => {
    if (!post?.content_html) return { processedHtml: '', headings: [] };

    const tocHeadings: TocHeading[] = [];
    let headingCount = 0;

    // Process H2 and H3 tags
    const htmlWithIds = post.content_html.replace(
      /<h([23])([^>]*)>(.*?)<\/h\1>/gi,
      (match, levelStr, attrs, innerText) => {
        const level = parseInt(levelStr, 10);
        // Strip any inner HTML to get clean text
        const cleanText = innerText.replace(/<[^>]*>/g, '').trim();
        const slugId =
          cleanText
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || `section-${headingCount}`;

        headingCount++;
        tocHeadings.push({
          id: slugId,
          text: cleanText,
          level
        });

        return `<h${level}${attrs} id="${slugId}" class="scroll-mt-28 group relative">${innerText} <a href="#${slugId}" class="anchor-link opacity-0 group-hover:opacity-100 text-slate-400 hover:text-orange-500 ml-1.5 transition-opacity" aria-label="Permalink to ${cleanText}">#</a></h${level}>`;
      }
    );

    return { processedHtml: htmlWithIds, headings: tocHeadings };
  }, [post?.content_html]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterStatus('loading');
    try {
      await api.post('/subscribe', { email: newsletterEmail, source: 'blog_sidebar' });
      setNewsletterStatus('success');
      setNewsletterEmail('');
    } catch {
      setNewsletterStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-6 sm:pt-8 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-6">
          <div className="h-4 bg-slate-200 rounded w-48 mb-6" />
          <div className="h-10 bg-slate-200 rounded w-3/4 mb-4" />
          <div className="h-5 bg-slate-100 rounded w-1/3 mb-8" />
          <div className="aspect-video bg-slate-200 rounded-2xl w-full mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            <div className="space-y-4">
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-5/6" />
              <div className="h-4 bg-slate-100 rounded w-4/6" />
            </div>
            <div className="h-64 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white pt-6 sm:pt-8 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center py-20">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Article Not Found</h1>
          <p className="text-slate-600 mb-8">
            The blog article you are looking for does not exist or may have been moved.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/blog"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              Browse All Blogs
            </Link>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const currentUrl = `https://codextechit.com/blog/${post.slug}`;

  // JSON-LD Schemas
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    mainEntityOfPage: currentUrl,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Codex Tech-IT Advisor'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Codex Tech-IT',
      logo: {
        '@type': 'ImageObject',
        url: 'https://codextechit.com/assets/codex-3d-monogram.png'
      }
    }
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
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: currentUrl
      }
    ]
  };

  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer
            }
          }))
        }
      : null;

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        image={post.cover_image}
        type="article"
      />

      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Reading Progress Indicator */}
      <ReadingProgress />

      {/* Main Document Flow - max-width 1200px, padding-top ~24-32px below sticky navbar */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
        {/* 1. Breadcrumbs: Home / Blog / Title */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-800 transition-colors">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <Link to="/blog" className="hover:text-slate-800 transition-colors">
            Blog
          </Link>
          <span className="text-slate-400">/</span>
          <span
            className="text-slate-800 font-medium truncate max-w-[320px] sm:max-w-[600px]"
            aria-current="page"
          >
            {post.title}
          </span>
        </nav>

        {/* 2. Article Title H1: clamp(28px, 4vw, 44px), max-width 900px, wraps freely */}
        <h1 className="text-slate-900 font-extrabold text-left text-[clamp(28px,4vw,44px)] leading-[1.2] max-w-[900px] mb-4 break-words">
          {post.title}
        </h1>

        {/* 3. Meta Row under title */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-600 mb-6 pb-6 border-b border-slate-100">
          {post.author && (
            <div className="flex items-center gap-2">
              <img
                src={post.author.avatar || '/assets/authors/avatar-1.webp'}
                alt={post.author.name}
                width={28}
                height={28}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
              <span className="font-semibold text-slate-900">{post.author.name}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{post.reading_time_min} min read</span>
          </div>
        </div>

        {/* 4. Cover Image: its own block AFTER title & meta, 16:9, rounded 16px, fetchpriority high */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-10 shadow-sm border border-slate-200/60">
          <img
            src={post.cover_image}
            alt={post.cover_alt || post.title}
            width={1280}
            height={720}
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Mobile-only Table of Contents (collapsed by default) */}
        <div className="block lg:hidden mb-8">
          <TableOfContents headings={headings} isMobile />
        </div>

        {/* 5. Two-column grid below cover */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-12 items-start">
          {/* Main Article Column */}
          <article className="max-w-[740px] w-full min-w-0">
            {/* Article Typography Body */}
            <div
              className="blog-prose"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />

            {/* CTA Banner: Light gradient background, orange button */}
            <div className="my-10 p-8 rounded-2xl bg-gradient-to-r from-[#FFF7ED] via-[#FFF4D6]/50 to-[#E8F2FF] border border-[#E2E8F0] text-[#0F172A] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-2 font-heading">
                  Looking for Senior Technical Opportunities?
                </h3>
                <p className="text-[#475569] text-sm max-w-xl leading-relaxed">
                  Connect with Codex Tech-IT’s executive recruiters for direct placement, resume branding, and mock interview coaching.
                </p>
              </div>
              <Link
                to="/contact"
                className="px-6 py-3 bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-xl whitespace-nowrap transition-colors shadow-sm flex-shrink-0"
              >
                Schedule Free Session
              </Link>
            </div>

            {/* FAQs Accordion */}
            {post.faqs && post.faqs.length > 0 && <FaqAccordion faqs={post.faqs} />}

            {/* Author Box */}
            {post.author && <AuthorBox author={post.author} />}

            {/* Previous / Next Article Links */}
            {(post.prev || post.next) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10 pt-6 border-t border-slate-200">
                {post.prev ? (
                  <Link
                    to={`/blog/${post.prev.slug}`}
                    className="p-4 rounded-xl border border-slate-200 hover:border-orange-300 bg-white hover:bg-orange-50/20 transition-all flex flex-col group"
                  >
                    <span className="text-xs text-slate-400 font-semibold mb-1 group-hover:text-orange-500">
                      ← Previous Article
                    </span>
                    <span className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-orange-600">
                      {post.prev.title}
                    </span>
                  </Link>
                ) : (
                  <div className="hidden sm:block" />
                )}

                {post.next && (
                  <Link
                    to={`/blog/${post.next.slug}`}
                    className="p-4 rounded-xl border border-slate-200 hover:border-orange-300 bg-white hover:bg-orange-50/20 transition-all flex flex-col sm:text-right group"
                  >
                    <span className="text-xs text-slate-400 font-semibold mb-1 group-hover:text-orange-500">
                      Next Article →
                    </span>
                    <span className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-orange-600">
                      {post.next.title}
                    </span>
                  </Link>
                )}
              </div>
            )}
          </article>

          {/* Sticky Sidebar on Desktop */}
          <aside className="w-full lg:w-[300px] sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto space-y-6 pr-1 pb-4">
            {/* Desktop Table of Contents */}
            <div className="hidden lg:block">
              <TableOfContents headings={headings} />
            </div>

            {/* Share This Article */}
            <ShareButtons url={currentUrl} title={post.title} />

            {/* Looking for Expert Help? CTA Card */}
            <div className="bg-gradient-to-br from-[#E8F2FF] to-[#FFF7ED] border border-[#E2E8F0] text-[#0F172A] rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-base text-[#0F172A] mb-2 font-heading">Looking for Expert Help?</h4>
              <p className="text-xs text-[#475569] leading-relaxed mb-4">
                Work directly with Codex Tech-IT to fast-track your technical career or source elite engineering talent.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>Tech Careers Newsletter</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Join 15,000+ senior engineers receiving bi-weekly market intelligence and resume frameworks.
              </p>
              {newsletterStatus === 'success' ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Subscribed successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <label htmlFor="blog-newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="blog-newsletter-email"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                  {newsletterStatus === 'error' && (
                    <p className="text-xs text-red-500 mt-1">Failed to subscribe. Try again.</p>
                  )}
                </form>
              )}
            </div>
          </aside>
        </div>

        {/* 6. Related Articles Section: 3 cards with 64px bottom padding */}
        {post.related && post.related.length > 0 && (
          <RelatedPosts posts={post.related} />
        )}
      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 p-3 bg-slate-900 hover:bg-orange-500 text-white rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default BlogDetail;
