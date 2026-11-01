import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Plus, Trash2, Edit, Check, X, Loader2, RefreshCw, Eye,
  Star, MessageSquareQuote, CheckCircle2, AlertCircle, ArrowUp, ArrowDown,
  Upload, ExternalLink, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  company_name?: string | null;
  placement?: string | null;
  quote: string;
  rating: number;
  reviewer_type: 'candidate' | 'employer';
  source: string;
  highlight_metric?: string | null;
  avatar_url?: string | null;
  show_in_spotlight: boolean;
  is_main_highlight: boolean;
  show_in_cards: boolean;
  spotlight_order: number;
  card_order: number;
  is_published: boolean;
  permission_confirmed: boolean;
  permission_confirmed_at?: string | null;
  created_at: string;
}

type TabKey = 'all' | 'main_highlight' | 'spotlight' | 'cards' | 'unpublished';

export const AdminTestimonials: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    main_highlight: 0,
    spotlight: 0,
    cards: 0,
    unpublished: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company_name: '',
    placement: '',
    quote: '',
    rating: 5,
    reviewer_type: 'candidate' as 'candidate' | 'employer',
    source: 'LinkedIn',
    highlight_metric: '',
    avatar_url: '',
    show_in_spotlight: true,
    is_main_highlight: false,
    show_in_cards: true,
    spotlight_order: 0,
    card_order: 0,
    is_published: true,
    permission_confirmed: true
  });

  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchTestimonials = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeTab !== 'all') params.set('tab', activeTab);
    if (searchTerm.trim()) params.set('q', searchTerm.trim());

    api
      .get(`/admin/testimonials?${params.toString()}`)
      .then((res) => {
        if (res.data?.success) {
          setItems(res.data.data || []);
          if (res.data.counts) {
            setCounts(res.data.counts);
          }
        }
      })
      .catch((err) => console.error('Failed to load testimonials:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTestimonials();
  }, [activeTab, searchTerm]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingItem(null);
    setFormError(null);
    setFormData({
      name: '',
      role: '',
      company_name: '',
      placement: '',
      quote: '',
      rating: 5,
      reviewer_type: 'candidate',
      source: 'LinkedIn',
      highlight_metric: '',
      avatar_url: '',
      show_in_spotlight: true,
      is_main_highlight: false,
      show_in_cards: true,
      spotlight_order: (counts.spotlight || 0) + 1,
      card_order: (counts.cards || 0) + 1,
      is_published: true,
      permission_confirmed: true
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: TestimonialItem) => {
    setModalMode('edit');
    setEditingItem(item);
    setFormError(null);
    setFormData({
      name: item.name,
      role: item.role,
      company_name: item.company_name || '',
      placement: item.placement || '',
      quote: item.quote,
      rating: item.rating || 5,
      reviewer_type: item.reviewer_type || 'candidate',
      source: item.source || 'LinkedIn',
      highlight_metric: item.highlight_metric || '',
      avatar_url: item.avatar_url || '',
      show_in_spotlight: item.show_in_spotlight,
      is_main_highlight: item.is_main_highlight,
      show_in_cards: item.show_in_cards,
      spotlight_order: item.spotlight_order || 0,
      card_order: item.card_order || 0,
      is_published: item.is_published,
      permission_confirmed: item.permission_confirmed ?? true
    });
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.name.length < 2) {
      setFormError('Reviewer name must be at least 2 characters.');
      return;
    }
    if (!formData.role.trim() || formData.role.length < 2) {
      setFormError('Role or job title must be at least 2 characters.');
      return;
    }
    if (!formData.quote.trim() || formData.quote.length < 10) {
      setFormError('Quote must be at least 10 characters.');
      return;
    }
    if (formData.quote.length > 500) {
      setFormError('Quote cannot exceed 500 characters.');
      return;
    }
    if (!formData.permission_confirmed) {
      setFormError('You must confirm that the reviewer gave explicit consent to publish their review.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      if (modalMode === 'create') {
        const res = await api.post('/admin/testimonials', formData);
        if (res.data?.success) {
          showToast(`Review for "${formData.name}" added successfully.`);
          setIsModalOpen(false);
          fetchTestimonials();
        }
      } else if (modalMode === 'edit' && editingItem) {
        const res = await api.put(`/admin/testimonials/${editingItem.id}`, formData);
        if (res.data?.success) {
          showToast(`Review for "${formData.name}" updated successfully.`);
          setIsModalOpen(false);
          fetchTestimonials();
        }
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || err.message || 'Failed to save testimonial.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Avatar Upload
  const handleAvatarFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith('.svg') || file.type === 'image/svg+xml') {
      alert('SVG files cannot be used as profile photos. Please upload a JPG, PNG, or WebP photo.');
      return;
    }

    setAvatarUploading(true);
    try {
      const body = new FormData();
      body.append('avatar', file);
      body.append('name', formData.name || 'reviewer');

      const res = await api.post('/admin/testimonials/upload-avatar', body);
      if (res.data?.success && res.data?.data?.url) {
        setFormData((prev) => ({
          ...prev,
          avatar_url: res.data.data.url
        }));
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to upload photo.');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Set Single Main Highlight
  const handleSetMainHighlight = async (item: TestimonialItem) => {
    try {
      const res = await api.patch(`/admin/testimonials/${item.id}/highlight`);
      if (res.data?.success) {
        showToast(`"${item.name}" is now the Placed Candidate Spotlight main highlight on the Home page.`);
        fetchTestimonials();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to set main highlight.');
    }
  };

  // Toggle Published Status
  const handleTogglePublished = async (item: TestimonialItem) => {
    const nextPublished = !item.is_published;
    try {
      await api.put(`/admin/testimonials/${item.id}`, {
        ...item,
        is_published: nextPublished,
        permission_confirmed: true
      });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_published: nextPublished } : i))
      );
      showToast(nextPublished ? `Published "${item.name}" to website.` : `Unpublished "${item.name}".`);
      fetchTestimonials();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle publication status.');
    }
  };

  // Delete Testimonial
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the review from "${name}"?`)) return;
    try {
      await api.delete(`/admin/testimonials/${id}`);
      showToast(`Review from "${name}" deleted.`);
      fetchTestimonials();
    } catch (err: any) {
      alert(err.message || 'Failed to delete review.');
    }
  };

  // Reorder Item (Spotlight or Card)
  const handleMoveOrder = async (item: TestimonialItem, direction: 'up' | 'down') => {
    const delta = direction === 'up' ? -1 : 1;
    const newSpotlightOrder = Math.max(0, (item.spotlight_order || 0) + delta);
    const newCardOrder = Math.max(0, (item.card_order || 0) + delta);

    try {
      await api.post('/admin/testimonials/reorder', {
        items: [{ id: item.id, spotlight_order: newSpotlightOrder, card_order: newCardOrder }]
      });
      fetchTestimonials();
    } catch (err: any) {
      alert('Failed to reorder items.');
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'delete') => {
    if (selectedIds.length === 0) return;
    if (action === 'delete' && !window.confirm(`Permanently delete ${selectedIds.length} selected reviews?`)) {
      return;
    }

    try {
      await api.post('/admin/testimonials/bulk', {
        ids: selectedIds,
        action
      });
      showToast(`Bulk action "${action}" completed for ${selectedIds.length} items.`);
      setSelectedIds([]);
      fetchTestimonials();
    } catch (err: any) {
      alert(err.message || 'Failed to run bulk action.');
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <SEO
        title="Testimonials & Reviews Management | Codex Tech-IT Admin"
        description="Manage candidate stories and client outcomes displayed on the Codex Tech-IT website."
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-navy-900 text-white text-xs font-semibold shadow-xl border border-orange-500/30 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-heading font-extrabold text-navy-900">
              Testimonials &amp; Outcomes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold text-xs">
              {counts.all} Total Reviews
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Controls the "Real Experiences. Real Offers." review wall and Candidate Spotlight card on the Home page.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/#reviews-section"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-slate-700 hover:text-navy-900 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <span>View on Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Button variant="outline" size="sm" onClick={fetchTestimonials} className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenCreate} className="gap-1.5">
            <Plus className="w-4 h-4" /> Add Testimonial
          </Button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Highlight</span>
          <p className="text-lg font-extrabold text-orange-600 mt-0.5">
            {counts.main_highlight > 0 ? '1 Active' : 'Auto (1st)'}
          </p>
          <span className="text-[11px] text-slate-500">Center Spotlight Hero</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Spotlight Carousel</span>
          <p className="text-lg font-extrabold text-blue-600 mt-0.5">{counts.spotlight} Reviews</p>
          <span className="text-[11px] text-slate-500">1-by-1 Auto-Reveal</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Card Grid</span>
          <p className="text-lg font-extrabold text-emerald-600 mt-0.5">{counts.cards} Reviews</p>
          <span className="text-[11px] text-slate-500">Outcomes 6-Card Grid</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unpublished</span>
          <p className="text-lg font-extrabold text-slate-600 mt-0.5">{counts.unpublished} Drafts</p>
          <span className="text-[11px] text-slate-500">Hidden from public</span>
        </div>
      </div>

      {/* Toolbar: Search, Tabs & Bulk Actions */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, role, company, or quote keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 sm:pb-0">
          {(
            [
              { key: 'all', label: 'All', count: counts.all },
              { key: 'main_highlight', label: 'Main Highlight', count: counts.main_highlight },
              { key: 'spotlight', label: 'Spotlight', count: counts.spotlight },
              { key: 'cards', label: 'Card Grid', count: counts.cards },
              { key: 'unpublished', label: 'Unpublished', count: counts.unpublished },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                setSelectedIds([]);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.key ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Bar (when rows selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-orange-900">
            {selectedIds.length} review{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkAction('publish')}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction('unpublish')}
              className="px-3 py-1 rounded-lg bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Unpublish
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading reviews and placement outcomes...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <MessageSquareQuote className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-navy-900">No testimonials found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add real candidate reviews and placement metrics to display on the Home page.
            </p>
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add First Review
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-gray-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === items.length && items.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(items.map((i) => i.id));
                        else setSelectedIds([]);
                      }}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-400"
                    />
                  </th>
                  <th className="p-4">Reviewer</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 max-w-xs">Quote Excerpt</th>
                  <th className="p-4">Placements</th>
                  <th className="p-4 text-center">Live</th>
                  <th className="p-4 text-center">Hero Highlight</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-slate-700">
                {items.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-orange-50/20 transition-colors ${
                        item.is_main_highlight ? 'bg-orange-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds((prev) => [...prev, item.id]);
                            else setSelectedIds((prev) => prev.filter((id) => id !== item.id));
                          }}
                          className="w-4 h-4 rounded text-orange-600 focus:ring-orange-400"
                        />
                      </td>

                      {/* Reviewer Profile */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {item.avatar_url ? (
                            <img
                              src={item.avatar_url}
                              alt={item.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-heading font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                              {getInitials(item.name)}
                            </div>
                          )}
                          <div>
                            <div className="font-heading font-bold text-navy-900 text-xs flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {item.is_main_highlight && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-100 text-orange-800">
                                  HERO
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium">{item.role}</p>
                            {item.placement && (
                              <p className="text-[10px] text-orange-700 font-semibold">{item.placement}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.reviewer_type === 'employer'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.reviewer_type === 'employer' ? 'Hiring Partner' : 'Candidate'}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="p-4">
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: item.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </td>

                      {/* Quote */}
                      <td className="p-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-600 italic">"{item.quote}"</p>
                        {item.highlight_metric && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {item.highlight_metric}
                          </span>
                        )}
                      </td>

                      {/* Placements */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          {item.show_in_spotlight && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded w-max">
                              <span>Spotlight</span>
                              <span className="text-[9px] text-blue-400">#{item.spotlight_order}</span>
                            </span>
                          )}
                          {item.show_in_cards && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded w-max">
                              <span>Cards</span>
                              <span className="text-[9px] text-purple-400">#{item.card_order}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Published Toggle */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(item)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            item.is_published
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title={item.is_published ? 'Click to unpublish' : 'Click to publish'}
                        >
                          {item.is_published ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      {/* Main Hero Highlight Radio */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleSetMainHighlight(item)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            item.is_main_highlight
                              ? 'bg-orange-500 text-white shadow-xs'
                              : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'
                          }`}
                          title={
                            item.is_main_highlight
                              ? 'Currently featured as the main Spotlight Card'
                              : 'Set as primary Placed Candidate Spotlight card'
                          }
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(item, 'up')}
                            className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(item, 'down')}
                            className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-500 hover:text-navy-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Review"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-1.5 text-red-400 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── CREATE / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                  <MessageSquareQuote className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-navy-900 text-sm">
                    {modalMode === 'create' ? 'Add Candidate / Client Review' : 'Edit Testimonial'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Displayed on the Home page reviews section with authentic metrics.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Name & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Reviewer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Patel"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Reviewer Category</label>
                  <select
                    value={formData.reviewer_type}
                    onChange={(e) =>
                      setFormData({ ...formData, reviewer_type: e.target.value as 'candidate' | 'employer' })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <option value="candidate">Candidate (Engineer / Placed Talent)</option>
                    <option value="employer">Hiring Lead / Client Partner</option>
                  </select>
                </div>
              </div>

              {/* Job Title / Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Job Title / Role *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Enterprise Solutions Architect"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">
                    Placement / Company Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                    placeholder="e.g. Placed at Nexus Capital Tech"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              </div>

              {/* Highlight Metric & Star Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Highlight Metric Badge</label>
                  <input
                    type="text"
                    value={formData.highlight_metric}
                    onChange={(e) => setFormData({ ...formData, highlight_metric: e.target.value })}
                    placeholder="e.g. +$35k Salary Jump · 21 Days"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Star Rating</label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= formData.rating ? 'fill-current text-amber-500' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-500 ml-2">{formData.rating} of 5 Stars</span>
                  </div>
                </div>
              </div>

              {/* Testimonial Quote */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-bold text-navy-900">Testimonial Quote *</label>
                  <span
                    className={
                      formData.quote.length > 500
                        ? 'text-red-600 font-bold'
                        : formData.quote.length < 10
                        ? 'text-slate-400'
                        : 'text-emerald-600 font-bold'
                    }
                  >
                    {formData.quote.length}/500 chars (min 10)
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="The system design coaching transformed how I tackle whiteboard architectural challenges. Placed within 18 business days of starting."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Avatar Photo Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 space-y-3">
                <label className="block text-xs font-bold text-navy-900">Reviewer Profile Photo</label>
                <div className="flex items-center gap-4">
                  {formData.avatar_url ? (
                    <div className="relative group">
                      <img
                        src={formData.avatar_url}
                        alt="Avatar preview"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-400 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar_url: '' })}
                        className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-red-600 text-white text-[10px] shadow-sm hover:bg-red-700"
                        title="Remove photo (fallback to initials)"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-base flex items-center justify-center shadow-sm">
                      {getInitials(formData.name || 'NN')}
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleAvatarFileSelected}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={avatarUploading}
                      onClick={() => avatarInputRef.current?.click()}
                      className="gap-1.5 text-xs"
                    >
                      {avatarUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Cropping to 256x256 WebP...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Profile Photo</span>
                        </>
                      )}
                    </Button>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Center-crops to square 256x256 WebP. If omitted, reviewer initials are automatically used as fallback.
                    </p>
                  </div>
                </div>
              </div>

              {/* Placement Checkboxes & Consent */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 text-xs font-semibold text-navy-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.show_in_spotlight}
                    onChange={(e) => setFormData({ ...formData, show_in_spotlight: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-400"
                  />
                  <span>Include in Left Spotlight Auto-Reveal Carousel</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-navy-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_main_highlight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_main_highlight: e.target.checked,
                        show_in_spotlight: e.target.checked ? true : formData.show_in_spotlight
                      })
                    }
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-400"
                  />
                  <span className="text-orange-950 font-bold">
                    ⭐ Set as Default Main Placed Candidate Spotlight (Hero Card)
                  </span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-navy-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.show_in_cards}
                    onChange={(e) => setFormData({ ...formData, show_in_cards: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-400"
                  />
                  <span>Include in Right 6-Card Outcomes Grid</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-navy-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-400"
                  />
                  <span>Published (Immediately visible on website)</span>
                </label>

                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 mt-2">
                  <label className="flex items-start gap-2.5 text-xs font-semibold text-amber-950 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.permission_confirmed}
                      onChange={(e) => setFormData({ ...formData, permission_confirmed: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-400 mt-0.5"
                    />
                    <span>
                      I confirm that this candidate/client gave consent to feature their review, name, role, and placement metric on the Codex Tech-IT public platform. *
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={formSubmitting}>
                  {formSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      Saving Review...
                    </>
                  ) : modalMode === 'create' ? (
                    'Add Review'
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

