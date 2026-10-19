import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export const AdminSettings: React.FC = () => {
  const [tagline, setTagline] = useState('We Deliver Jobs Faster');
  const [notifyEmail, setNotifyEmail] = useState('admin@codextechit.com');
  const [phoneUsa, setPhoneUsa] = useState('+1 (469) 555-0198');
  const [phoneIndia, setPhoneIndia] = useState('+91 40 6789 0123');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/settings')
      .then((res) => {
        if (res.data?.data) {
          const s = res.data.data;
          if (s.tagline) setTagline(s.tagline);
          if (s.notify_email) setNotifyEmail(s.notify_email);
          if (s.phone_usa) setPhoneUsa(s.phone_usa);
          if (s.phone_india) setPhoneIndia(s.phone_india);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      await api.put('/admin/settings', {
        tagline,
        notify_email: notifyEmail,
        phone_usa: phoneUsa,
        phone_india: phoneIndia,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.response?.data?.error?.message || 'Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <SEO title="System Settings | Codex Tech-IT" />

      <div>
        <h1 className="text-2xl font-heading font-extrabold text-navy-900">System Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure global platform metadata and contact channels.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-2" />
            <p className="text-xs text-slate-500">Loading settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            {saveSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Settings saved and synchronized with MySQL successfully.</span>
              </div>
            )}

            {saveError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Company Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Inquiry Notification Email</label>
              <input
                type="email"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">USA Support Phone</label>
                <input
                  type="text"
                  value={phoneUsa}
                  onChange={(e) => setPhoneUsa(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">India Support Phone</label>
                <input
                  type="text"
                  value={phoneIndia}
                  onChange={(e) => setPhoneIndia(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Settings...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save System Settings
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
