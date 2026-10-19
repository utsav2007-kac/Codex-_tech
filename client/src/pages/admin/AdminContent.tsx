import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, X, Loader2, RefreshCw } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

type ContentModel = 'posts' | 'jobs' | 'stories' | 'live-placements' | 'faqs' | 'testimonials';

export const AdminContent: React.FC = () => {
  const [model, setModel] = useState<ContentModel>('posts');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    setLoading(true);
    // Public get routes exist for these: /posts, /jobs, /stories, /live-placements, /faqs, /testimonials
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

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this content item?')) return;
    try {
      await api.delete(`/admin/${model}/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  const models: { key: ContentModel; label: string }[] = [
    { key: 'posts', label: 'Blog Insights' },
    { key: 'jobs', label: 'Career Openings' },
    { key: 'stories', label: 'Case Studies' },
    { key: 'live-placements', label: 'Live Placements' },
    { key: 'faqs', label: 'FAQs' },
    { key: 'testimonials', label: 'Testimonials' },
  ];

  return (
    <div className="space-y-6">
      <SEO title="Admin Content Manager | Codex Tech-IT" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-900">Content Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage public articles, openings, case studies, and FAQs.</p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchItems} className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Content
        </Button>
      </div>

      {/* Model Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {models.map((m) => (
          <button
            key={m.key}
            onClick={() => setModel(m.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
              model === m.key
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-gray-50 border border-gray-200/80'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-2" />
            <p className="text-xs text-slate-500">Retrieving content items...</p>
          </div>
        ) : items.length === 0 ? (
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
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{item.id}</td>
                    <td className="py-3 px-4 font-bold text-navy-900 max-w-sm truncate">
                      {item.title || item.name || item.question || item.role}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {item.category || item.department || item.company_type || item.package_range || 'Published'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {item.is_sample ? 'Sample (Demo)' : 'Live'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                        title="Delete Content"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
