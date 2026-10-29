import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Check, X, Loader2, RefreshCw, Search,
  Eye, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight, Briefcase,
  HelpCircle, MessageSquareQuote, Award, BookOpen
} from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { AdminBlogManager } from '../../components/admin/AdminBlogManager';

type ContentModel = 'posts' | 'jobs' | 'stories' | 'live-placements' | 'faqs' | 'testimonials';

export const AdminContent: React.FC = () => {
  const [model, setModel] = useState<ContentModel>('posts');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State for Create & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Dynamic Form Data
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchItems = () => {
    if (model === 'posts') return; // Handled by AdminBlogManager
    setLoading(true);
    api.get(`/${model}`)
      .then((res) => {
        const raw = res.data?.data;
        const list = Array.isArray(raw) ? raw : (raw?.items || []);
        setItems(list);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [model]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingItem(null);
    setFormError(null);

    // Initial values based on model
    if (model === 'jobs') {
      setFormData({
        title: '',
        department: 'Cloud & DevOps Engineering',
        location: 'Remote, US',
        type: 'Full-time',
        description: 'Lead enterprise cloud infrastructure, CI/CD automation, and multi-cloud Kubernetes architectures.',
        requirements: '3+ years experience with AWS/GCP, Docker, Terraform, and modern CI/CD tools.',
        is_active: true,
      });
    } else if (model === 'stories') {
      setFormData({
        name: '',
        role: 'Senior Java Backend Engineer',
        company_type: 'Fortune 100 Financial Services',
        location: 'Dallas, TX',
        situation: 'Candidate transitioned from standard QA into high-scale distributed backend engineering.',
        approach: 'Completed rigorous 12-week Spring Boot microservices track with 1-on-1 interview drills.',
        results: 'Received 3 top-tier enterprise offers within 24 days, securing a $135k compensation package.',
        is_published: true,
      });
    } else if (model === 'live-placements') {
      setFormData({
        role: 'Data Engineer / Snowflake Specialist',
        company_type: 'Healthcare Tech Enterprise',
        location: 'Chicago, IL (Hybrid)',
        package_range: '$115k - $130k',
        summary: 'Placed in 18 days via dedicated technical screening and direct hiring manager outreach.',
        is_published: true,
      });
    } else if (model === 'faqs') {
      setFormData({
        category: 'Training & Placements',
        question: '',
        answer: '',
        sort_order: 1,
        is_published: true,
      });
    } else if (model === 'testimonials') {
      setFormData({
        name: '',
        role: 'DevOps Engineer @ FinTech Corp',
        quote: 'Codex Tech-IT provided unmatched interview readiness and hands-on capstone projects that transformed my career.',
        is_published: true,
      });
    }

    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: any) => {
    setModalMode('edit');
    setEditingItem(item);
    setFormError(null);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  // Toggle Status (Live vs Inactive)
  const handleToggleStatus = async (item: any) => {
    try {
      await api.patch(`/admin/${model}/${item.id}/status`);
      setItems((prev) =>
        prev.map((i) => {
          if (i.id === item.id) {
            if (model === 'jobs') return { ...i, is_active: !i.is_active };
            return { ...i, is_published: !i.is_published };
          }
          return i;
        })
      );
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status.');
    }
  };

  // Delete Content Item
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this content item? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/${model}/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete item.');
    }
  };

  // Save Modal Form (Create or Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      if (modalMode === 'create') {
        const res = await api.post(`/admin/${model}`, formData);
        if (res.data?.success && res.data?.data) {
          setItems((prev) => [res.data.data, ...prev]);
          setIsModalOpen(false);
        }
      } else if (modalMode === 'edit' && editingItem) {
        const res = await api.put(`/admin/${model}/${editingItem.id}`, formData);
        if (res.data?.success && res.data?.data) {
          setItems((prev) => prev.map((i) => (i.id === editingItem.id ? res.data.data : i)));
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to save content item.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const str = JSON.stringify(item).toLowerCase();
    return str.includes(term);
  });

  const models: { key: ContentModel; label: string }[] = [
    { key: 'posts', label: 'Blog & Articles' },
    { key: 'jobs', label: 'Career Openings' },
    { key: 'stories', label: 'Case Studies' },
    { key: 'live-placements', label: 'Live Placements' },
    { key: 'faqs', label: 'FAQs' },
    { key: 'testimonials', label: 'Testimonials' },
  ];

  return (
    <div className="space-y-6">
      <SEO title="Admin Content Manager | Codex Tech-IT" />

      {/* Model Switcher Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {models.map((m) => (
          <button
            key={m.key}
            onClick={() => {
              setModel(m.key);
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
              model === m.key
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-gray-50 border border-gray-200/80'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {model === 'posts' ? (
        <AdminBlogManager />
      ) : (
        <div className="space-y-5">
          {/* Section Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-navy-900 capitalize flex items-center gap-2">
                <span>{models.find((m) => m.key === model)?.label}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold text-xs">
                  {items.length} Records
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage, publish, edit and maintain live database records for {model}.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchItems} className="gap-1.5 cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </Button>
              <Button variant="primary" size="sm" onClick={handleOpenCreate} className="gap-1.5 cursor-pointer">
                <Plus className="w-4 h-4" /> New Record
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${models.find((m) => m.key === model)?.label}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
            />
          </div>

          {/* Content Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-2" />
                <p className="text-xs text-slate-500">Retrieving content items from MySQL...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs">
                No items found under <strong>{model}</strong>.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/75 border-b border-gray-100 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">ID</th>
                      <th className="py-3.5 px-4">Title / Name / Question</th>
                      <th className="py-3.5 px-4">Category / Role / Info</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-slate-600">
                    {filteredItems.map((item) => {
                      const isLive = model === 'jobs' ? item.is_active : item.is_published;
                      return (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-400">#{item.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-navy-900 max-w-sm truncate">
                              {item.title || item.name || item.question || item.role}
                            </div>
                            {(item.summary || item.excerpt || item.quote) && (
                              <div className="text-[10px] text-slate-400 max-w-sm truncate">
                                {item.summary || item.excerpt || item.quote}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {item.category || item.department || item.company_type || item.package_range || 'Published'}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleStatus(item)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                isLive
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                              title="Click to toggle status"
                            >
                              {isLive ? 'Live / Active' : 'Draft / Inactive'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                              title="Edit Item"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal Form for Create & Edit */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                      {modalMode === 'create' ? 'Create Record' : `Edit Record #${editingItem?.id}`}
                    </span>
                    <h3 className="text-lg font-heading font-extrabold text-navy-900">
                      {models.find((m) => m.key === model)?.label}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-navy-900 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveModal} className="p-6 space-y-4 text-xs">
                  {formError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Form fields for JOBS */}
                  {model === 'jobs' && (
                    <>
                      <div>
                        <label className="block font-semibold text-navy-900 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={formData.title || ''}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                          placeholder="e.g. Lead AWS Cloud Architect"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Department</label>
                          <input
                            type="text"
                            value={formData.department || ''}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Location</label>
                          <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Job Type</label>
                          <select
                            value={formData.type || 'Full-time'}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 cursor-pointer"
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Contract">Contract (C2C / W-2)</option>
                            <option value="Contract-to-Hire">Contract-to-Hire</option>
                            <option value="Remote">Remote</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                          <input
                            type="checkbox"
                            id="job_active"
                            checked={formData.is_active ?? true}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 rounded text-orange-500"
                          />
                          <label htmlFor="job_active" className="font-semibold text-navy-900 cursor-pointer">
                            Active Opening (Accepting Applications)
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-navy-900 mb-1">Job Description</label>
                        <textarea
                          rows={3}
                          value={formData.description || ''}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-navy-900 mb-1">Technical Requirements</label>
                        <textarea
                          rows={3}
                          value={formData.requirements || ''}
                          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Form fields for CASE STUDIES (STORIES) */}
                  {model === 'stories' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Candidate Name / Alias</label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            placeholder="e.g. Rahul S."
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Placed Role</label>
                          <input
                            type="text"
                            value={formData.role || ''}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Company Type</label>
                          <input
                            type="text"
                            value={formData.company_type || ''}
                            onChange={(e) => setFormData({ ...formData, company_type: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Location</label>
                          <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-navy-900 mb-1">Initial Situation / Challenge</label>
                        <textarea
                          rows={2}
                          value={formData.situation || ''}
                          onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-navy-900 mb-1">Codex Tech-IT Approach</label>
                        <textarea
                          rows={2}
                          value={formData.approach || ''}
                          onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-navy-900 mb-1">Placement Results & Compensation</label>
                        <textarea
                          rows={2}
                          value={formData.results || ''}
                          onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Form fields for LIVE PLACEMENTS */}
                  {model === 'live-placements' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Engineer Role</label>
                          <input
                            type="text"
                            value={formData.role || ''}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            placeholder="e.g. Senior Data Engineer"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Package Range</label>
                          <input
                            type="text"
                            value={formData.package_range || ''}
                            onChange={(e) => setFormData({ ...formData, package_range: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            placeholder="e.g. $125k - $140k"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Hiring Company Type</label>
                          <input
                            type="text"
                            value={formData.company_type || ''}
                            onChange={(e) => setFormData({ ...formData, company_type: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            placeholder="e.g. Enterprise FinTech"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Location</label>
                          <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            placeholder="e.g. Remote, US"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-navy-900 mb-1">Placement Summary</label>
                        <input
                          type="text"
                          value={formData.summary || ''}
                          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                          placeholder="e.g. Placed in 21 days with 100% visa sponsorship."
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Form fields for FAQS */}
                  {model === 'faqs' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Category</label>
                          <input
                            type="text"
                            value={formData.category || ''}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            placeholder="e.g. Placements / Training"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Sort Order</label>
                          <input
                            type="number"
                            value={formData.sort_order ?? 1}
                            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 1 })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-navy-900 mb-1">Question</label>
                        <input
                          type="text"
                          value={formData.question || ''}
                          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                          placeholder="e.g. What is the average timeline to offer?"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-navy-900 mb-1">Answer</label>
                        <textarea
                          rows={3}
                          value={formData.answer || ''}
                          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Form fields for TESTIMONIALS */}
                  {model === 'testimonials' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Candidate Name</label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            placeholder="e.g. Alex M."
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-navy-900 mb-1">Role & Company</label>
                          <input
                            type="text"
                            value={formData.role || ''}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                            placeholder="e.g. Cloud Security Analyst @ FinTech"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-navy-900 mb-1">Candidate Quote / Testimonial</label>
                        <textarea
                          rows={3}
                          value={formData.quote || ''}
                          onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      className="gap-2 cursor-pointer"
                      disabled={formSubmitting}
                    >
                      {formSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" /> Save Record
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
