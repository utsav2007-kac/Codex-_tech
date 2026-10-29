import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, ExternalLink, Menu, X, Shield, BookOpen, Layers } from 'lucide-react';
import { api } from '../../services/api';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const hasSession = localStorage.getItem('codex_admin_user');
    if (!hasSession) {
      setIsChecking(false);
      navigate('/admin/login', { replace: true });
      return;
    }

    api.get('/admin/me')
      .then((res) => {
        const userData = res.data?.data?.user || res.data?.data;
        if (res.data?.success && userData) {
          setCurrentUser(userData);
        } else {
          localStorage.removeItem('codex_admin_user');
          navigate('/admin/login', { replace: true });
        }
      })
      .catch(() => {
        localStorage.removeItem('codex_admin_user');
        navigate('/admin/login', { replace: true });
      })
      .finally(() => setIsChecking(false));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
    } catch (_) { }
    localStorage.removeItem('codex_admin_user');
    navigate('/admin/login');
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center text-white">
        <div className="text-sm font-semibold flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Verifying security privileges...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { label: 'Overview Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Inquiries & Submissions', path: '/admin/submissions', icon: Users },
    { label: 'Content Management', path: '/admin/content', icon: BookOpen },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-navy-900 text-white shrink-0">
        <div className="p-5 border-b border-navy-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <img
              src="/assets/logo-white.svg"
              alt="Codex Tech-IT"
              width="148"
              height="40"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold uppercase tracking-wider">
            Admin
          </span>
        </div>

        <nav className="p-4 flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-heading font-semibold transition-all ${active
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-navy-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex flex-col w-72 max-w-[85%] bg-navy-900 text-white z-10 shadow-2xl">
            <div className="p-5 border-b border-navy-800 flex items-center justify-between">
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <img
                  src="/assets/logo-white.svg"
                  alt="Codex Tech-IT"
                  width="136"
                  height="36"
                  className="h-7 w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-heading font-semibold transition-all ${
                      active
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                        : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-navy-800 space-y-2">
              <div className="px-3 py-2 rounded-xl bg-navy-800/60 mb-2">
                <div className="text-xs font-heading font-bold text-white truncate">{currentUser?.name || 'Administrator'}</div>
                <div className="text-[10px] text-slate-400 truncate">{currentUser?.email}</div>
              </div>
              <Link
                to="/"
                target="_blank"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Public Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-slate-600 p-1"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Codex Tech-IT Command Center
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-heading font-bold text-navy-900">{currentUser?.name || 'Administrator'}</div>
              <div className="text-[10px] text-slate-400">{currentUser?.email}</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center font-heading font-bold text-xs">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="p-6 md:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
