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
        if (res.data?.success && res.data?.data?.user) {
          setCurrentUser(res.data.data.user);
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
    } catch (_) {}
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
        <div className="p-6 border-b border-navy-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-blue-600 flex items-center justify-center font-heading font-black text-white text-base">
            CX
          </div>
          <div>
            <div className="font-heading font-bold text-sm tracking-wide">CODEX TECH-IT</div>
            <div className="text-[10px] text-orange-400 font-semibold uppercase tracking-wider">Admin Center</div>
          </div>
        </div>

        <nav className="p-4 flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-slate-600 p-1"
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
