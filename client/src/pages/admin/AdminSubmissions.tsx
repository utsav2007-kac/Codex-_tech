import React, { useState, useEffect } from 'react';
import { Search, Download, Trash2, CheckCircle2, Clock, FileText, Loader2, RefreshCw } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

type TabType = 'leads' | 'applications' | 'contacts' | 'employer-requests' | 'referrals' | 'subscribers' | 'enrollments';

export const AdminSubmissions: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('leads');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = () => {
    setLoading(true);
    api.get(`/admin/${currentTab}`)
      .then((res) => {
        if (res.data?.data) {
          setItems(res.data.data);
        } else {
          setItems([]);
        }
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [currentTab]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.put(`/admin/${currentTab}/${id}/status`, { status: newStatus });
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/admin/${currentTab}/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  const handleDownloadResume = (id: number) => {
    window.open(`/api/admin/resume/${id}`, '_blank');
  };

  const exportCSV = () => {
    if (items.length === 0) return;
    const keys = Object.keys(items[0]).filter((k) => typeof items[0][k] !== 'object');
    const header = keys.join(',');
    const rows = items.map((row) =>
      keys
        .map((k) => {
          const val = row[k] === null || row[k] === undefined ? '' : String(row[k]);
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codex_${currentTab}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filtered = items.filter((item) => {
    const term = searchTerm.toLowerCase();
    const str = JSON.stringify(item).toLowerCase();
    return str.includes(term);
  });

  const tabs: { key: TabType; label: string }[] = [
    { key: 'leads', label: 'Consultations / Leads' },
    { key: 'applications', label: 'Job Applications' },
    { key: 'contacts', label: 'Contact Messages' },
    { key: 'employer-requests', label: 'Talent Requests' },
    { key: 'referrals', label: 'Referrals' },
    { key: 'subscribers', label: 'Subscribers' },
    { key: 'enrollments', label: 'Course Enrollments' },
  ];

  return (
    <div className="space-y-6">
      <SEO title="Admin Submissions & Requests | Codex Tech-IT" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-900">Inquiries & Submissions</h1>
          <p className="text-xs text-slate-500 mt-1">Review, process, and export candidate and employer requests.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchItems} className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={exportCSV} className="gap-1.5" disabled={items.length === 0}>
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setCurrentTab(t.key);
              setSearchTerm('');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
              currentTab === t.key
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-gray-50 border border-gray-200/80'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter submissions by name, email, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-2" />
            <p className="text-xs text-slate-500">Querying MySQL submissions table...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No submissions recorded under <strong>{currentTab}</strong>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Subject / Service</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-slate-600">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{item.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-navy-900">{item.name || item.contact_person || item.company || 'Subscriber'}</div>
                      <div className="text-[11px] text-slate-400">{item.email}</div>
                      {item.phone && <div className="text-[10px] text-slate-400">{item.phone}</div>}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      {item.service_interest || item.subject || item.roles_needed || item.role_skill || item.plan || 'General Inquiry'}
                    </td>
                    <td className="py-3 px-4">
                      {item.status ? (
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-gray-200 text-[11px] font-bold bg-white text-navy-900 focus:outline-none focus:ring-1 focus:ring-orange-200"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold">Active</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {currentTab === 'applications' && item.resume_path && (
                        <button
                          onClick={() => handleDownloadResume(item.id)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                          title="Download Resume"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                        title="Delete Record"
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
