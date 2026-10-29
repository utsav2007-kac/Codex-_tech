import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit, Trash2, Check, X, Loader2, RefreshCw, Search,
  Eye, FileText, Image as ImageIcon, Calendar, Tag, User, Globe,
  HelpCircle, ArrowLeft, Save, Sparkles, AlertCircle, ExternalLink
} from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

interface BlogMeta {
  authors: { id: number; name: string; role: string; avatar: string }[];
  categories: { id: number; slug: string; name: string }[];
  tags: { id: number; slug: string; name: string }[];
}

interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  cover_alt: string;
  status: 'draft' | 'published' | 'scheduled';
  published_at?: string;
  updated_at: string;
  reading_time_min: number;
  view_count: number;
  featured: number;
  category: { id: number; name: string; slug: string };
  author: { id: number; name: string };
  _count?: { faqs: number; tags: number };
}

interface FaqFormItem {
  id?: number;
  question: string;
  answer: string;
  sort_order: number;
}

export const AdminBlogManager: React.FC = () => {
  // Mode: 'list' | 'create' | 'edit'
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingId, setEditingId] = useState<number | null>(null);

  // List State
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Meta Options
  const [meta, setMeta] = useState<BlogMeta>({ authors: [], categories: [], tags: [] });

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content_html: '',
    category_id: 1,
    author_id: 1,
    cover_image: '/assets/blog/blog-1.webp',
    cover_alt: '',
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    published_at: '',
    featured: 0,
    seo_title: '',
    seo_description: '',
    canonical_url: '',
    og_image: '',
    tag_ids: [] as number[],
    faqs: [] as FaqFormItem[]
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [slugManual, setSlugManual] = useState(false);
  const [editorTab, setEditorTab] = useState<'edit' | 'split' | 'preview'>('edit');
  const [autosaveNotice, setAutosaveNotice] = useState<string>('');

  // Fetch Metadata
  const fetchMeta = () => {
    api.get('/admin/blog/meta')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setMeta(res.data.data);
          if (res.data.data.categories?.[0] && formData.category_id === 1) {
            setFormData((prev) => ({
              ...prev,
              category_id: res.data.data.categories[0].id,
              author_id: res.data.data.authors[0]?.id || 1
            }));
          }
        }
      })
      .catch((err) => console.warn('Could not load blog meta:', err));
  };

  // Fetch List of Posts
  const fetchPosts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('limit', '10');
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());

    api.get(`/admin/blog/posts?${params.toString()}`)
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setPosts(res.data.data.items);
          setTotalCount(res.data.data.total);
          setTotalPages(res.data.data.totalPages);
        }
      })
      .catch((err) => console.error('Failed to load admin blog posts:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    if (mode === 'list') {
      fetchPosts();
    }
  }, [mode, currentPage, statusFilter, searchQuery]);

  // Real-time slug auto-generation from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    setFormData((prev) => {
      const updated: any = { ...prev, title: titleVal };
      if (!slugManual && mode === 'create') {
        updated.slug = titleVal
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return updated;
    });
  };

  // Autosave to localStorage on debounced interval
  useEffect(() => {
    if (mode === 'list' || !formData.title) return;
    const key = `codex_admin_draft_${editingId || 'new'}`;
    const timer = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(formData));
      setAutosaveNotice(`Autosaved at ${new Date().toLocaleTimeString()}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, mode, editingId]);

  // Open Create Mode
  const handleStartCreate = () => {
    setEditingId(null);
    setSlugManual(false);
    setFormErrors({});
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content_html: `<h2>Overview of the Topic</h2>\n<p>Write your detailed technical guidance here...</p>\n\n<h2>Key Architectural Pillars</h2>\n<ul class="list-disc pl-6 space-y-2">\n  <li>First major takeaway</li>\n  <li>Second major takeaway</li>\n</ul>`,
      category_id: meta.categories[0]?.id || 1,
      author_id: meta.authors[0]?.id || 1,
      cover_image: '/assets/blog/blog-1.webp',
      cover_alt: 'Technical analysis diagram',
      status: 'draft',
      published_at: '',
      featured: 0,
      seo_title: '',
      seo_description: '',
      canonical_url: '',
      og_image: '',
      tag_ids: meta.tags[0] ? [meta.tags[0].id] : [],
      faqs: [
        { question: 'What is the primary takeaway of this guide?', answer: 'Detailed actionable answer for candidates.', sort_order: 1 },
        { question: 'How can engineers apply this immediately?', answer: 'Step by step implementation advice.', sort_order: 2 }
      ]
    });
    setMode('create');
  };

  // Open Edit Mode
  const handleStartEdit = async (id: number) => {
    setEditingId(id);
    setSlugManual(true);
    setFormErrors({});
    setLoading(true);

    try {
      const res = await api.get(`/admin/blog/posts/${id}`);
      if (res.data?.success && res.data?.data) {
        const p = res.data.data;
        setFormData({
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          content_html: p.content_html,
          category_id: p.category_id,
          author_id: p.author_id,
          cover_image: p.cover_image,
          cover_alt: p.cover_alt,
          status: p.status,
          published_at: p.published_at ? new Date(p.published_at).toISOString().slice(0, 16) : '',
          featured: p.featured || 0,
          seo_title: p.seo_title || '',
          seo_description: p.seo_description || '',
          canonical_url: p.canonical_url || '',
          og_image: p.og_image || '',
          tag_ids: p.tag_ids || (p.tags ? p.tags.map((t: any) => t.tag_id || t.id) : []),
          faqs: (p.faqs || []).map((f: any, idx: number) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
            sort_order: f.sort_order || idx + 1
          }))
        });
        setMode('edit');
      }
    } catch (err) {
      alert('Failed to load post for editing.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Post with confirmation
  const handleDeletePost = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admin/blog/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (err) {
      alert('Failed to delete article.');
    }
  };

  // Quick Status Toggle (Draft <-> Published)
  const handleToggleStatus = async (post: BlogPostRow) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await api.patch(`/admin/blog/posts/${post.id}/status`, { status: nextStatus });
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, status: nextStatus } : p))
      );
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  // Handle Cover Image Upload with WebP conversion
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file must be under 5MB.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/admin/blog/upload-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success && res.data?.data?.url) {
        setFormData((prev) => ({
          ...prev,
          cover_image: res.data.data.url
        }));
      }
    } catch (err) {
      alert('Image upload and WebP conversion failed. Please check image format.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Tag Selection Toggle
  const toggleTagSelection = (tagId: number) => {
    setFormData((prev) => {
      const exists = prev.tag_ids.includes(tagId);
      return {
        ...prev,
        tag_ids: exists ? prev.tag_ids.filter((id) => id !== tagId) : [...prev.tag_ids, tagId]
      };
    });
  };

  // FAQ Management in Form
  const addFaqItem = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        { question: '', answer: '', sort_order: prev.faqs.length + 1 }
      ]
    }));
  };

  const updateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData((prev) => {
      const nextFaqs = [...prev.faqs];
      nextFaqs[index] = { ...nextFaqs[index], [field]: value };
      return { ...prev, faqs: nextFaqs };
    });
  };

  const removeFaqItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // Submit Form (Create or Update)
  const handleSubmit = async (targetStatus?: 'draft' | 'published') => {
    setFormErrors({});
    const submitPayload = {
      ...formData,
      status: targetStatus || formData.status,
      published_at: formData.published_at ? new Date(formData.published_at).toISOString() : null
    };

    // Validation
    const errors: Record<string, string> = {};
    if (!submitPayload.title.trim()) errors.title = 'Title is required';
    if (!submitPayload.slug.trim()) errors.slug = 'Slug is required';
    if (!submitPayload.excerpt.trim()) errors.excerpt = 'Excerpt is required';
    if (!submitPayload.content_html.trim()) errors.content_html = 'Article content is required';
    if (!submitPayload.cover_image.trim()) errors.cover_image = 'Cover image is required';
    if (!submitPayload.cover_alt.trim()) errors.cover_alt = 'Cover alt text is required for accessibility';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormSubmitting(true);
    try {
      if (mode === 'create') {
        const res = await api.post('/admin/blog/posts', submitPayload);
        if (res.data?.success) {
          localStorage.removeItem(`codex_admin_draft_new`);
          setMode('list');
          fetchPosts();
        }
      } else if (mode === 'edit' && editingId) {
        const res = await api.put(`/admin/blog/posts/${editingId}`, submitPayload);
        if (res.data?.success) {
          localStorage.removeItem(`codex_admin_draft_${editingId}`);
          setMode('list');
          fetchPosts();
        }
      }
    } catch (err: any) {
      if (err.response?.data?.error?.slug) {
        setFormErrors({ slug: 'This URL slug is already taken by another article.' });
      } else {
        alert(err.response?.data?.error?.message || 'Failed to save article.');
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  // Estimated reading time
  const estimatedReadTime = Math.max(
    3,
    Math.ceil(formData.content_html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length / 200)
  );

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: LIST OF POSTS
  // ──────────────────────────────────────────────────────────────────────────
  if (mode === 'list') {
    return (
      <div className="space-y-6">
        {/* Header & New Article CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-navy-900 flex items-center gap-2">
              <span>Blog Manager</span>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold text-xs">
                {totalCount} Articles
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Author, publish, schedule and edit Codex Tech-IT technical career insights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchPosts} className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
            <Button variant="primary" size="sm" onClick={handleStartCreate} className="gap-1.5">
              <Plus className="w-4 h-4" /> New Article
            </Button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles by title, slug, or content..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['all', 'published', 'draft', 'scheduled'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold capitalize transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-navy-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Articles */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading articles from MySQL...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm font-semibold text-slate-600 mb-2">No articles match your filter criteria.</p>
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200 text-navy-900 font-heading font-bold">
                    <th className="py-3.5 px-4">Article</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Author</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Views</th>
                    <th className="py-3.5 px-4">Updated</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Thumbnail & Title */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.cover_image}
                            alt=""
                            className="w-16 h-9 object-cover rounded-lg bg-slate-100 shrink-0 border border-gray-200"
                          />
                          <div className="min-w-0">
                            <span className="font-heading font-bold text-navy-900 block truncate hover:text-orange-500 cursor-pointer" onClick={() => handleStartEdit(post.id)}>
                              {post.title}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono block truncate">
                              /blog/{post.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                        {post.category?.name}
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {post.author?.name}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(post)}
                          title="Click to toggle status"
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                            post.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : post.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {post.status}
                        </button>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-4 text-slate-600 font-semibold whitespace-nowrap">
                        {post.view_count.toLocaleString()}
                      </td>

                      {/* Updated Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(post.updated_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleStartEdit(post.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                            title="Edit Article"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeletePost(post.id, post.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
              <span>Page {currentPage} of {totalPages}</span>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: CREATE / EDIT ARTICLE FORM
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode('list')}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-slate-50 text-navy-900 transition-colors cursor-pointer"
            title="Back to articles list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-heading font-extrabold text-navy-900">
              {mode === 'create' ? 'Create New Article' : `Edit: ${formData.title || 'Untitled Article'}`}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span>Reading time: ~{estimatedReadTime} min</span>
              {autosaveNotice && (
                <>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">{autosaveNotice}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={formSubmitting}
            onClick={() => handleSubmit('draft')}
          >
            Save as Draft
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={formSubmitting}
            onClick={() => handleSubmit('published')}
            className="gap-1.5"
          >
            {formSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Publish Article</span>
          </Button>
        </div>
      </div>

      {/* Editor Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Editor Panel (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-heading font-bold text-navy-900">Article Title *</label>
                <span className={formData.title.length > 70 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
                  {formData.title.length}/70 chars
                </span>
              </div>
              <input
                type="text"
                id="blog-form-title"
                name="title"
                data-testid="blog-form-title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter article title (e.g. The 2026 Engineer's Guide to Beating ATS Resumes)..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              {formErrors.title && <p className="text-[11px] text-red-600 mt-1">{formErrors.title}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label className="font-heading font-bold text-navy-900" htmlFor="blog-form-slug">URL Slug *</label>
                <button
                  type="button"
                  onClick={() => setSlugManual(!slugManual)}
                  className="text-[11px] text-orange-600 font-semibold hover:underline cursor-pointer"
                >
                  {slugManual ? 'Enable Auto-Slug' : 'Edit Manually'}
                </button>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-gray-200 rounded-l-xl text-xs text-slate-500 font-mono">
                  /blog/
                </span>
                <input
                  type="text"
                  id="blog-form-slug"
                  name="slug"
                  data-testid="blog-form-slug"
                  disabled={!slugManual && mode === 'create'}
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().trim() })}
                  placeholder="ats-resume-optimization-guide-2026"
                  className="flex-1 px-3 py-2.5 rounded-r-xl border border-gray-200 text-xs font-mono text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:bg-slate-50"
                />
              </div>
              {formErrors.slug && <p className="text-[11px] text-red-600 mt-1">{formErrors.slug}</p>}
            </div>

            {/* Excerpt */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-heading font-bold text-navy-900">Summary / Excerpt *</label>
                <span className={formData.excerpt.length > 160 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
                  {formData.excerpt.length}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="High-level 2-3 sentence overview of this intelligence report..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              {formErrors.excerpt && <p className="text-[11px] text-red-600 mt-1">{formErrors.excerpt}</p>}
            </div>
          </div>

          {/* HTML / Markdown Content Editor with Live Preview */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <label className="font-heading font-bold text-navy-900 text-xs">
                Article Body Content (HTML / Markdown) *
              </label>

              {/* View Switcher Tabs */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                {(['edit', 'split', 'preview'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setEditorTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                      editorTab === tab ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500 hover:text-navy-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor Body */}
            {editorTab === 'preview' ? (
              <div
                className="prose prose-slate max-w-none text-slate-800 leading-relaxed min-h-[380px] p-4 bg-slate-50 rounded-xl overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: formData.content_html }}
              />
            ) : editorTab === 'split' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea
                  rows={18}
                  value={formData.content_html}
                  onChange={(e) => setFormData({ ...formData, content_html: e.target.value })}
                  className="w-full p-4 rounded-xl border border-gray-200 font-mono text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <div
                  className="prose prose-slate max-w-none text-slate-800 text-xs p-4 bg-slate-50 rounded-xl overflow-y-auto border border-gray-200 max-h-[420px]"
                  dangerouslySetInnerHTML={{ __html: formData.content_html }}
                />
              </div>
            ) : (
              <textarea
                rows={16}
                value={formData.content_html}
                onChange={(e) => setFormData({ ...formData, content_html: e.target.value })}
                placeholder="<h2>Introduction</h2>\n<p>Your technical guide content...</p>"
                className="w-full p-4 rounded-xl border border-gray-200 font-mono text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            )}
            {formErrors.content_html && <p className="text-[11px] text-red-600">{formErrors.content_html}</p>}
          </div>

          {/* FAQs Editor */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-navy-900 text-xs">Article FAQs (Structured Data)</h3>
                <p className="text-[11px] text-slate-500">Included in the article accordion and Google FAQPage JSON-LD.</p>
              </div>
              <Button variant="outline" size="sm" onClick={addFaqItem} className="gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </Button>
            </div>

            <div className="space-y-3">
              {formData.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-2 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-orange-600 uppercase">Question #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFaqItem(idx)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Remove FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. How does Workday parse multi-column tables?"
                    value={faq.question}
                    onChange={(e) => updateFaqItem(idx, 'question', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-navy-900 bg-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Provide a concrete answer..."
                    value={faq.answer}
                    onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-navy-900 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Settings Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Schedule Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-navy-900">
              Publishing &amp; Status
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Article Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:ring-2 focus:ring-orange-300"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Live to Public)</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {formData.status === 'scheduled' && (
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Scheduled Date &amp; Time</label>
                <input
                  type="datetime-local"
                  value={formData.published_at}
                  onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs text-navy-900"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <input
                type="checkbox"
                id="featured-check"
                checked={formData.featured === 1}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 text-orange-500 rounded border-gray-300"
              />
              <label htmlFor="featured-check" className="text-xs font-semibold text-navy-900 cursor-pointer">
                Feature in Recent Highlights section
              </label>
            </div>
          </div>

          {/* Classification: Category & Author */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-navy-900">
              Taxonomy &amp; Attribution
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Category *</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:ring-2 focus:ring-orange-300"
              >
                {meta.categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Author *</label>
              <select
                value={formData.author_id}
                onChange={(e) => setFormData({ ...formData, author_id: parseInt(e.target.value) })}
                className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:ring-2 focus:ring-orange-300"
              >
                {meta.authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                ))}
              </select>
            </div>

            {/* Tags Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-2">Topic Tags</label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-gray-200">
                {meta.tags.map((t) => {
                  const selected = formData.tag_ids.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTagSelection(t.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                        selected
                          ? 'bg-navy-900 text-white'
                          : 'bg-white text-slate-600 border border-gray-200 hover:bg-slate-100'
                      }`}
                    >
                      #{t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cover Image Upload (Converts to WebP) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-navy-900">
              16:9 Cover Image *
            </h3>

            {/* Preview Box */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-gray-200 relative">
              <img
                src={formData.cover_image}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
              {uploadingImage && (
                <div className="absolute inset-0 bg-navy-900/60 flex items-center justify-center text-white text-xs font-semibold gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  <span>Converting to WebP...</span>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div>
              <label className="block w-full">
                <span className="sr-only">Choose Cover Image</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleImageUpload}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer"
                />
              </label>
              <p className="text-[10px] text-slate-400 mt-1">Accepted: PNG, JPEG, WebP. Converted automatically to WebP 1200x675.</p>
            </div>

            {/* Cover Alt */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Cover Alt Text (SEO &amp; A11y) *</label>
              <input
                type="text"
                placeholder="Descriptive image summary..."
                value={formData.cover_alt}
                onChange={(e) => setFormData({ ...formData, cover_alt: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-navy-900"
              />
              {formErrors.cover_alt && <p className="text-[11px] text-red-600 mt-1">{formErrors.cover_alt}</p>}
            </div>
          </div>

          {/* SEO & Meta Fields */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-navy-900">
              SEO &amp; Open Graph
            </h3>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-semibold text-slate-600">SEO Meta Title</label>
                <span className="text-[10px] text-slate-400">{formData.seo_title.length}/60</span>
              </div>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                placeholder="Defaults to article title if blank"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-navy-900"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-semibold text-slate-600">SEO Meta Description</label>
                <span className="text-[10px] text-slate-400">{formData.seo_description.length}/160</span>
              </div>
              <textarea
                rows={2}
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                placeholder="Defaults to excerpt if blank"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-navy-900"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
