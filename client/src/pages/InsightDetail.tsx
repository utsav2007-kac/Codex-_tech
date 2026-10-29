import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Clock, Calendar, User, ArrowLeft, Share2, Check, Copy, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { FALLBACK_INSIGHTS } from '../data/insightsData';
import { Scroll3DSection } from '../components/motion/Scroll3DSection';
import { Scroll3DCard } from '../components/motion/Scroll3DCard';
import { SectionReveal } from '../components/motion/SectionReveal';
import { PageHero } from '../components/layout/PageHero';

export const InsightDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const fallbackPost = FALLBACK_INSIGHTS.find((p) => p.slug === slug) || null;
  const [post, setPost] = useState<any | null>(fallbackPost);
  const [loading, setLoading] = useState(!fallbackPost);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toc, setToc] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    if (!slug) return;
    if (!fallbackPost) setLoading(true);

    api.get(`/posts/${slug}`)
      .then((res) => {
        if (res.data?.redirect) {
          navigate(res.data.redirect, { replace: true });
          return;
        }

        if (res.data?.data) {
          const p = res.data.data;
          setPost(p);

          const lines = (p.content || '').split('\n');
          const headings: { id: string; text: string }[] = [];
          lines.forEach((line: string) => {
            const clean = line.trim();
            if (clean.startsWith('### ') || clean.startsWith('#### ')) {
              const text = clean.replace(/^#{3,4}\s+/, '');
              const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              headings.push({ id, text });
            }
          });
          setToc(headings);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback: check if the slug is an article in the blog system
        api.get(`/blog/posts/${slug}`)
          .then((blogRes) => {
            if (blogRes.data?.success && blogRes.data?.data) {
              navigate(`/blog/${slug}`, { replace: true });
              return;
            }
            if (fallbackPost) {
              setPost(fallbackPost);
            }
          })
          .catch(() => {
            if (fallbackPost) {
              setPost(fallbackPost);
            }
          })
          .finally(() => setLoading(false));
      });
  }, [slug, navigate, fallbackPost]);

  // Reading progress scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyShareLink = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setShowToast(true);
    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 3000);
  };

  const parseInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-navy-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderFormattedContent = (rawContent: string) => {
    if (!rawContent) return null;
    const sections = rawContent.split(/\n\n+/);
    return sections.map((section, sIdx) => {
      const trimmed = section.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('### ')) {
        const headingText = trimmed.replace(/^###\s+/, '');
        const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return (
          <h3
            key={sIdx}
            id={id}
            className="text-xl sm:text-2xl font-heading font-extrabold text-navy-900 mt-10 mb-4 pt-4 border-t border-gray-100 flex items-center justify-between group scroll-mt-28"
          >
            <span>{headingText}</span>
            <a href={`#${id}`} className="text-slate-300 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm ml-2">#</a>
          </h3>
        );
      }

      if (trimmed.startsWith('#### ')) {
        const headingText = trimmed.replace(/^####\s+/, '');
        const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return (
          <h4
            key={sIdx}
            id={id}
            className="text-base sm:text-lg font-heading font-bold text-navy-900 mt-6 mb-3 scroll-mt-28"
          >
            {headingText}
          </h4>
        );
      }

      const lines = trimmed.split('\n');
      const isList = lines.every((l) => /^[0-9]+\.\s+/.test(l.trim()) || /^[*•-]\s+/.test(l.trim()));
      if (isList) {
        const isNumbered = /^[0-9]+\.\s+/.test(lines[0].trim());
        return isNumbered ? (
          <ol key={sIdx} className="space-y-3 my-4 list-decimal list-inside text-slate-700 leading-relaxed text-sm sm:text-base">
            {lines.map((line, lIdx) => {
              const itemText = line.trim().replace(/^[0-9]+\.\s+/, '');
              return (
                <li key={lIdx} className="pl-1">
                  {parseInlineFormatting(itemText)}
                </li>
              );
            })}
          </ol>
        ) : (
          <ul key={sIdx} className="space-y-3 my-4 list-disc list-inside text-slate-700 leading-relaxed text-sm sm:text-base">
            {lines.map((line, lIdx) => {
              const itemText = line.trim().replace(/^[*•-]\s+/, '');
              return (
                <li key={lIdx} className="pl-1">
                  {parseInlineFormatting(itemText)}
                </li>
              );
            })}
          </ul>
        );
      }

      return (
        <p key={sIdx} className="text-slate-700 leading-relaxed text-sm sm:text-base mb-5 font-normal">
          {parseInlineFormatting(trimmed)}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="section-padding text-center container-custom">
        <h1 className="text-2xl font-bold text-navy-900 mb-4">Article Not Found</h1>
        <p className="text-slate-500 mb-6">The insight article you requested does not exist or has been archived.</p>
        <Link to="/insights" className="text-orange-500 font-bold hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to All Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white relative">
      <SEO
        title={`${post.title} | Codex Tech-IT Insights`}
        description={post.excerpt}
        canonical={`/insights/${post.slug}`}
        type="article"
      />

      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-blue-600 z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Header */}
      <PageHero
        breadcrumbs={[
          { label: 'Insights', path: '/insights' },
          { label: post.title },
        ]}
        badge={post.category || 'Engineering Insight'}
        title={post.title}
        subtitle={post.excerpt}
        primaryCta={{
          label: copied ? 'Link Copied!' : 'Share Article',
          onClick: copyShareLink,
        }}
        secondaryCta={{
          label: 'All Insights',
          href: '/insights',
        }}
        facts={[
          { label: 'Read Time', value: `${post.read_minutes || 6} min` },
          { label: 'Author', value: post.author_name || 'Codex Team' },
          { label: 'Topic', value: post.category || 'Career Intelligence' },
        ]}
        visual="insights-radar"
      />

      {/* Body & TOC Grid */}
      <Scroll3DSection preset="lift" className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 max-w-6xl">
            {/* Auto Table of Contents & Social Share (Desktop Sticky) */}
            <div className="hidden lg:block lg:col-span-1 space-y-8">
              <Scroll3DCard maxTilt={3} className="sticky top-24 p-6 rounded-3xl bg-gray-50 border border-gray-200">
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-navy-900 mb-4">
                  Table of Contents
                </h3>
                {toc.length === 0 ? (
                  <p className="text-xs text-slate-400">Complete guide outline</p>
                ) : (
                  <ul className="space-y-2 text-xs text-slate-600">
                    {toc.map((item, idx) => (
                      <li key={idx}>
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="hover:text-orange-500 transition-colors line-clamp-2 block py-0.5"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Share Guide</div>
                  <button
                    type="button"
                    onClick={copyShareLink}
                    className="flex items-center gap-2 text-xs font-semibold text-navy-900 hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Article Link'}</span>
                  </button>
                </div>
              </Scroll3DCard>
            </div>

            {/* Article Content */}
            <div className="lg:col-span-3 max-w-3xl">
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-sans">
                {renderFormattedContent(post.content)}
              </div>

              {/* Author Footer */}
              <Scroll3DCard maxTilt={3} className="mt-12 p-8 rounded-3xl bg-gray-50 border border-gray-200 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-heading font-extrabold text-xl shrink-0">
                  {post.author_name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-navy-900">{post.author_name}</h4>
                  <p className="text-xs text-orange-600 font-semibold mb-1">{post.author_role}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Senior career strategist at Codex Tech-IT specializing in technical recruitment, interview calibration, and engineering placement campaigns.
                  </p>
                </div>
              </Scroll3DCard>

              {/* Consultation CTA Banner */}
              <Scroll3DCard maxTilt={3} className="mt-12 p-8 rounded-3xl bg-navy-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-heading font-bold text-lg mb-1">Applying these strategies?</h3>
                  <p className="text-xs text-slate-300">Let our recruiting team tailor your resume and launch your targeted employer campaign.</p>
                </div>
                <Button variant="primary" size="md" onClick={onOpenConsultation} className="shrink-0 cursor-pointer">
                  Book Free Consultation
                </Button>
              </Scroll3DCard>
            </div>
          </div>
        </div>
      </Scroll3DSection>

      {/* Floating Link Copied Notification Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 bg-navy-900 text-white rounded-2xl shadow-2xl border border-white/10 animate-fade-in transition-all">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold font-heading tracking-wide">Article link copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};
