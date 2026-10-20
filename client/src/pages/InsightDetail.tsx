import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { Clock, Calendar, User, ArrowLeft, Share2, Check, Copy, ArrowRight, Loader2 } from 'lucide-react';
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
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();

  const fallbackPost = FALLBACK_INSIGHTS.find((p) => p.slug === slug) || null;
  const [post, setPost] = useState<any | null>(fallbackPost);
  const [loading, setLoading] = useState(!fallbackPost);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [toc, setToc] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    if (!slug) return;
    if (!fallbackPost) setLoading(true);

    api.get(`/posts/${slug}`)
      .then((res) => {
        if (res.data?.data) {
          const p = res.data.data;
          setPost(p);

          const lines = (p.content || '').split('\n');
          const headings: { id: string; text: string }[] = [];
          lines.forEach((line: string, index: number) => {
            const clean = line.trim();
            if (clean.startsWith('## ') || /^[1-9]\.\s/.test(clean)) {
              const text = clean.replace(/^##\s*/, '').replace(/^[0-9]\.\s*/, '');
              const id = `heading-${index}`;
              headings.push({ id, text });
            }
          });
          setToc(headings);
        }
      })
      .catch(() => {
        if (fallbackPost) {
          setPost(fallbackPost);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

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

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    {toc.map((item, idx) => (
                      <li key={idx}>
                        <a
                          href={`#${item.id}`}
                          className="hover:text-orange-500 transition-colors line-clamp-2"
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
                    onClick={copyShareLink}
                    className="flex items-center gap-2 text-xs font-semibold text-navy-900 hover:text-orange-500 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Article Link'}</span>
                  </button>
                </div>
              </Scroll3DCard>
            </div>

            {/* Article Content */}
            <div className="lg:col-span-3 max-w-3xl">
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-6 whitespace-pre-line font-sans">
                {post.content}
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
                <Button variant="primary" size="md" onClick={onOpenConsultation} className="shrink-0">
                  Book Free Consultation
                </Button>
              </Scroll3DCard>
            </div>
          </div>
        </div>
      </Scroll3DSection>
    </div>
  );
};
