import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2, RefreshCw, Globe, Mail, Phone, Share2, Megaphone } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export const AdminSettings: React.FC = () => {
  const [siteName, setSiteName] = useState('Codex Tech-IT');
  const [tagline, setTagline] = useState('We Deliver Jobs Faster');
  const [primaryEmail, setPrimaryEmail] = useState('contact@codextechit.com');
  const [notifyEmail, setNotifyEmail] = useState('admin@codextechit.com');
  const [phoneUsa, setPhoneUsa] = useState('+1 (469) 555-0198');
  const [phoneIndia, setPhoneIndia] = useState('+91 40 6789 0123');
  const [announcement, setAnnouncement] = useState('Now booking free career consultations. Reserve your slot →');

  // Social Links
  const [linkedin, setLinkedin] = useState('https://linkedin.com/company/codex-tech-it');
  const [twitter, setTwitter] = useState('https://twitter.com/codextechit');
  const [github, setGithub] = useState('https://github.com/codextechit');
  const [youtube, setYoutube] = useState('https://youtube.com/@codextechit');

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchSettings = () => {
    setLoading(true);
    api.get('/admin/settings')
      .then((res) => {
        if (res.data?.data) {
          const s = res.data.data;
          if (s.site_name) setSiteName(s.site_name);
          if (s.tagline) setTagline(s.tagline);
          if (s.primary_email) setPrimaryEmail(s.primary_email);
          if (s.notify_email) setNotifyEmail(s.notify_email);
          if (s.phone_usa) setPhoneUsa(s.phone_usa);
          if (s.phone_india) setPhoneIndia(s.phone_india);
          if (s.announcement !== undefined) setAnnouncement(s.announcement);

          if (s.socials) {
            if (s.socials.linkedin) setLinkedin(s.socials.linkedin);
            if (s.socials.twitter) setTwitter(s.socials.twitter);
            if (s.socials.github) setGithub(s.socials.github);
            if (s.socials.youtube) setYoutube(s.socials.youtube);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load settings:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const payload = {
        site_name: siteName,
        tagline,
        primary_email: primaryEmail,
        notify_email: notifyEmail,
        phone_usa: phoneUsa,
        phone_india: phoneIndia,
        announcement,
        socials: {
          linkedin,
          twitter,
          github,
          youtube,
        },
      };

      const res = await api.put('/admin/settings', payload);
      if (res.data?.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError(res.data?.error?.message || 'Failed to save settings.');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update settings in MySQL.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <SEO title="System Settings | Codex Tech-IT" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-900">System Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Configure global platform identity, communications, and contact channels.</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchSettings}
          className="gap-1.5 cursor-pointer self-start sm:self-auto"
          disabled={loading || isSaving}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload from DB</span>
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-2" />
            <p className="text-xs text-slate-500">Querying system settings from MySQL...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {saveSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">Settings Saved Successfully</div>
                  <div className="text-[11px] text-emerald-700">All configurations have been persisted to the MySQL database.</div>
                </div>
              </div>
            )}

            {saveError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <div className="font-bold">Failed to Save Settings</div>
                  <div className="text-[11px] text-red-700">{saveError}</div>
                </div>
              </div>
            )}

            {/* Platform Identity Section */}
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 text-navy-900 font-heading font-bold text-sm">
                <Globe className="w-4 h-4 text-orange-500" />
                <span>Brand Identity & Headlines</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Company / Platform Name</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="Codex Tech-IT"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Company Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="We Deliver Jobs Faster"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Announcement Banner */}
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 text-navy-900 font-heading font-bold text-sm">
                <Megaphone className="w-4 h-4 text-purple-600" />
                <span>Top Announcement Banner</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Announcement Text</label>
                <input
                  type="text"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Now booking free career consultations. Reserve your slot →"
                />
              </div>
            </div>

            {/* Communication & Contact Channels */}
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 text-navy-900 font-heading font-bold text-sm">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Contact & Notification Emails</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Primary Public Contact Email</label>
                  <input
                    type="email"
                    value={primaryEmail}
                    onChange={(e) => setPrimaryEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Inquiry Notification Email (Admin)</label>
                  <input
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Phone Numbers */}
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 text-navy-900 font-heading font-bold text-sm">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Global Phone Support</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">USA Support Phone</label>
                  <input
                    type="text"
                    value={phoneUsa}
                    onChange={(e) => setPhoneUsa(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="+1 (469) 555-0198"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">India Support Phone</label>
                  <input
                    type="text"
                    value={phoneIndia}
                    onChange={(e) => setPhoneIndia(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="+91 40 6789 0123"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 text-navy-900 font-heading font-bold text-sm">
                <Share2 className="w-4 h-4 text-indigo-600" />
                <span>Social Profiles & Channels</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Twitter / X URL</label>
                  <input
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">YouTube URL</label>
                  <input
                    type="url"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="https://youtube.com/@..."
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="gap-2 cursor-pointer"
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

              <span className="text-[11px] text-slate-400">
                Changes persist instantly in the MySQL database.
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
