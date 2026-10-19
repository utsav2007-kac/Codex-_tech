import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Briefcase, GraduationCap, Mail, Award, ArrowUpRight, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { api } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats').catch(() => ({ data: { data: {} } })),
      api.get('/admin/leads').catch(() => ({ data: { data: [] } })),
    ])
      .then(([statsRes, leadsRes]) => {
        setStats(statsRes.data?.data || {});
        setRecentLeads((leadsRes.data?.data || []).slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Consultation Leads', val: stats?.leads ?? 0, icon: Users, color: 'text-orange-500 bg-orange-50' },
    { label: 'Job Applications', val: stats?.applications ?? 0, icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'Employer Requests', val: stats?.employer_requests ?? 0, icon: Briefcase, color: 'text-purple-600 bg-purple-50' },
    { label: 'Course Enrollments', val: stats?.enrollments ?? 0, icon: GraduationCap, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Newsletter Subscribers', val: stats?.subscribers ?? 0, icon: Mail, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Live Placements', val: stats?.live_placements ?? 0, icon: Award, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <SEO title="Admin Overview Dashboard | Codex Tech-IT" />

      {/* Title */}
      <div>
        <h1 className="text-2xl font-heading font-extrabold text-navy-900">Dashboard Overview</h1>
        <p className="text-xs text-slate-500 mt-1">Live metrics and submission streams from MySQL database.</p>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="py-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs text-slate-500">Loading system statistics...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1">{c.label}</div>
                  <div className="text-3xl font-heading font-extrabold text-navy-900">{c.val}</div>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${c.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Inquiries Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-heading font-bold text-navy-900">Recent Candidate Inquiries</h2>
            <p className="text-xs text-slate-400">Latest consultation and career campaign requests</p>
          </div>
          <Link
            to="/admin/submissions"
            className="text-xs font-heading font-bold text-orange-500 hover:text-orange-600 inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No inquiries logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Candidate</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Service Interest</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-slate-600">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-bold text-navy-900">{lead.name}</td>
                    <td className="py-3">
                      <div>{lead.email}</div>
                      <div className="text-[10px] text-slate-400">{lead.phone}</div>
                    </td>
                    <td className="py-3 font-semibold text-blue-600">{lead.service_interest || 'General'}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        lead.status === 'NEW'
                          ? 'bg-amber-50 text-amber-700'
                          : lead.status === 'CONTACTED'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 text-[11px] text-slate-400">
                      {new Date(lead.created_at).toLocaleDateString()}
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
