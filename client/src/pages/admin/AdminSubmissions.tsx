import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  Search, Download, Trash2, CheckCircle2, Clock, FileText, Loader2,
  RefreshCw, Eye, X, Mail, Phone, Calendar, Briefcase, User, ExternalLink,
  ShieldAlert, Check, Filter
} from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

type TabType = 'leads' | 'applications' | 'contacts' | 'employer-requests' | 'referrals' | 'subscribers' | 'enrollments';

export const AdminSubmissions: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine initial tab from path or ?tab= query
  const getInitialTab = (): TabType => {
    const qTab = searchParams.get('tab') as TabType;
    if (qTab && ['leads', 'applications', 'contacts', 'employer-requests', 'referrals', 'subscribers', 'enrollments'].includes(qTab)) {
      return qTab;
    }
    const path = location.pathname.replace('/admin/', '');
    if (['leads', 'applications', 'contacts', 'employer-requests', 'referrals', 'subscribers', 'enrollments'].includes(path)) {
      return path as TabType;
    }
    return 'leads';
  };

  const [currentTab, setCurrentTab] = useState<TabType>(getInitialTab);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Sync tab with URL if changes
  useEffect(() => {
    const qTab = searchParams.get('tab') as TabType;
    if (qTab && qTab !== currentTab) {
      setCurrentTab(qTab);
    }
  }, [searchParams]);

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

  const handleTabChange = (key: TabType) => {
    setCurrentTab(key);
    setSearchTerm('');
    setStatusFilter('ALL');
    setSearchParams({ tab: key });
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.put(`/admin/${currentTab}/${id}/status`, { status: newStatus });
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus, is_active: newStatus === 'ACTIVE' } : item))
      );
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem((prev: any) => ({ ...prev, status: newStatus, is_active: newStatus === 'ACTIVE' }));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this submission record?')) return;
    try {
      await api.delete(`/admin/${currentTab}/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete item.');
    }
  };

  const handleDownloadResume = (id: number) => {
    const token = localStorage.getItem('codex_admin_token') || '';
    const downloadUrl = `/api/admin/resume/${id}?token=${encodeURIComponent(token)}`;
    window.open(downloadUrl, '_blank');
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

  // Filter items by search term and status
  const filtered = items.filter((item) => {
    // Status filter
    if (statusFilter !== 'ALL') {
      if (currentTab === 'subscribers') {
        const isActive = item.is_active;
        if (statusFilter === 'ACTIVE' && !isActive) return false;
        if (statusFilter === 'INACTIVE' && isActive) return false;
      } else if (item.status !== statusFilter) {
        return false;
      }
    }

    // Search filter
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const str = JSON.stringify(item).toLowerCase();
    return str.includes(term);
  });

  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: 'leads', label: 'Consultations & Leads' },
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-900">Inquiries & Submissions</h1>
          <p className="text-xs text-slate-500 mt-1">Review, process, filter, and export candidate inquiries and employer requests.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchItems} className="gap-1.5 cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={exportCSV} className="gap-1.5 cursor-pointer" disabled={items.length === 0}>
            <Download className="w-3.5 h-3.5" /> Export CSV ({items.length})
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
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

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${currentTab.replace('-', ' ')} by name, email, phone...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          {currentTab === 'subscribers' ? (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 cursor-pointer"
            >
              <option value="ALL">All Subscribers</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          ) : (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          )}
        </div>
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
            No submissions found under <strong>{currentTab}</strong> matching the active filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Subject / Service / Details</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-slate-600">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">#{item.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-navy-900 flex items-center gap-1.5">
                        <span>{item.name || item.contact_person || item.company || (item.referrer_name ? `${item.referrer_name} (Referrer)` : 'Subscriber')}</span>
                        {item.visa_status && item.visa_status !== 'NA' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                            {item.visa_status}
                          </span>
                        )}
                        {item.referral_code && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            {item.referral_code} ({item.used_count || 0} used)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">{item.email || item.referrer_email}</div>
                      {(item.phone || item.referrer_phone) && <div className="text-[10px] text-slate-400">{item.phone || item.referrer_phone}</div>}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      <div className="font-semibold text-navy-800 truncate">
                        {item.referee_name ? `Referred: ${item.referee_name} (${item.role_skill})` : (item.service_interest || item.job?.title || item.subject || item.roles_needed || item.role_skill || item.course?.title || item.plan || 'General Request')}
                      </div>
                      {(item.message || item.cover_note || item.notes) && (
                        <div className="text-[10px] text-slate-400 truncate">
                          {item.message || item.cover_note || item.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {currentTab === 'subscribers' ? (
                        <button
                          onClick={() => handleStatusChange(item.id, item.is_active ? 'INACTIVE' : 'ACTIVE')}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            item.is_active
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {item.is_active ? 'Active' : 'Inactive'}
                        </button>
                      ) : item.status ? (
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg border text-[11px] font-bold focus:outline-none cursor-pointer ${
                            item.status === 'NEW'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : item.status === 'CONTACTED'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold">Logged</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer"
                        title="View Full Submission Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

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

      {/* Submission Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                  {currentTab.toUpperCase().replace('-', ' ')} #{selectedItem.id}
                </span>
                <h3 className="text-lg font-heading font-extrabold text-navy-900">
                  {selectedItem.name || selectedItem.contact_person || selectedItem.company || 'Subscriber Details'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-navy-900 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* Status Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold">Current Status:</span>
                  <span className="font-bold text-navy-900">{selectedItem.status || (selectedItem.is_active ? 'ACTIVE' : 'INACTIVE')}</span>
                </div>
                {selectedItem.status && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">Change:</span>
                    <select
                      value={selectedItem.status}
                      onChange={(e) => handleStatusChange(selectedItem.id, e.target.value)}
                      className="px-2.5 py-1 rounded-xl border border-gray-200 font-bold bg-white text-navy-900 focus:outline-none"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-gray-100 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    <span>Email Address</span>
                  </div>
                  <div className="font-bold text-navy-900 select-all">{selectedItem.email}</div>
                </div>

                {selectedItem.phone && (
                  <div className="p-3.5 rounded-xl border border-gray-100 space-y-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Phone Number</span>
                    </div>
                    <div className="font-bold text-navy-900 select-all">{selectedItem.phone}</div>
                  </div>
                )}
              </div>

              {/* Dynamic Context Fields */}
              <div className="space-y-3">
                {selectedItem.referral_code && (
                  <div className="flex justify-between py-2 border-b border-gray-100 bg-amber-50/60 px-3 rounded-lg">
                    <span className="text-slate-600 font-medium">Referral Code & Usages:</span>
                    <span className="font-mono font-bold text-amber-900">{selectedItem.referral_code} ({selectedItem.used_count || 0} used)</span>
                  </div>
                )}
                {selectedItem.referrer_name && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Referrer:</span>
                    <span className="font-bold text-navy-900">{selectedItem.referrer_name} ({selectedItem.referrer_email})</span>
                  </div>
                )}
                {selectedItem.referee_name && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Referred Candidate:</span>
                    <span className="font-bold text-navy-900">{selectedItem.referee_name} ({selectedItem.referee_email} | {selectedItem.referee_phone})</span>
                  </div>
                )}
                {selectedItem.role_skill && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Referred Role / Skill:</span>
                    <span className="font-bold text-navy-900">{selectedItem.role_skill}</span>
                  </div>
                )}
                {selectedItem.current_role && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Current Role:</span>
                    <span className="font-bold text-navy-900">{selectedItem.current_role}</span>
                  </div>
                )}

                {selectedItem.experience_level && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Experience Level:</span>
                    <span className="font-bold text-navy-900">{selectedItem.experience_level}</span>
                  </div>
                )}

                {selectedItem.visa_status && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Visa Status:</span>
                    <span className="font-bold text-blue-600">{selectedItem.visa_status}</span>
                  </div>
                )}

                {selectedItem.service_interest && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Service Interest:</span>
                    <span className="font-bold text-navy-900">{selectedItem.service_interest}</span>
                  </div>
                )}

                {selectedItem.preferred_datetime && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Preferred Consultation Time:</span>
                    <span className="font-bold text-navy-900">{selectedItem.preferred_datetime}</span>
                  </div>
                )}

                {selectedItem.company && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Company Name:</span>
                    <span className="font-bold text-navy-900">{selectedItem.company}</span>
                  </div>
                )}

                {selectedItem.roles_needed && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Roles Needed:</span>
                    <span className="font-bold text-navy-900">{selectedItem.roles_needed}</span>
                  </div>
                )}

                {selectedItem.tech_stack && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Tech Stack:</span>
                    <span className="font-bold text-navy-900">{selectedItem.tech_stack}</span>
                  </div>
                )}

                {selectedItem.headcount && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Target Headcount:</span>
                    <span className="font-bold text-navy-900">{selectedItem.headcount}</span>
                  </div>
                )}

                {selectedItem.hiring_model && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Hiring Model:</span>
                    <span className="font-bold text-navy-900">{selectedItem.hiring_model}</span>
                  </div>
                )}

                {selectedItem.timeline && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Hiring Timeline:</span>
                    <span className="font-bold text-navy-900">{selectedItem.timeline}</span>
                  </div>
                )}

                {selectedItem.job?.title && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Applied Job Position:</span>
                    <span className="font-bold text-blue-600">{selectedItem.job.title}</span>
                  </div>
                )}

                {selectedItem.course?.title && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Course Track:</span>
                    <span className="font-bold text-blue-600">{selectedItem.course.title}</span>
                  </div>
                )}

                {selectedItem.batch_pref && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Batch Preference:</span>
                    <span className="font-bold text-navy-900">{selectedItem.batch_pref}</span>
                  </div>
                )}

                {selectedItem.linkedin_url && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">LinkedIn Profile:</span>
                    <a
                      href={selectedItem.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {selectedItem.subject && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Subject:</span>
                    <span className="font-bold text-navy-900">{selectedItem.subject}</span>
                  </div>
                )}

                {selectedItem.referrer_name && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-slate-500">Referred By:</span>
                    <span className="font-bold text-navy-900">{selectedItem.referrer_name} ({selectedItem.referrer_email})</span>
                  </div>
                )}

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-slate-500">Submitted Timestamp:</span>
                  <span className="font-bold text-slate-700">{new Date(selectedItem.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Full Notes / Cover Message */}
              {(selectedItem.message || selectedItem.cover_note || selectedItem.notes) && (
                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-bold text-navy-900">Message / Candidate Notes:</div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {selectedItem.message || selectedItem.cover_note || selectedItem.notes}
                  </div>
                </div>
              )}

              {/* Resume download section */}
              {selectedItem.resume_path && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-navy-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>{selectedItem.resume_original_name || 'Candidate Resume'}</span>
                    </div>
                    <div className="text-[11px] text-blue-700 mt-0.5">Uploaded PDF / DOCX file attachment</div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleDownloadResume(selectedItem.id)}
                    className="gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Resume
                  </Button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(selectedItem.id)}
                className="text-red-600 hover:bg-red-50 hover:border-red-200 gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Record
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
