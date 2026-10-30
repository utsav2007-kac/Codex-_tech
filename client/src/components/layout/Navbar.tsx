import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight, PhoneCall, Gift, Briefcase, Sparkles } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { Button } from '../ui/Button';

export interface NavbarProps {
  onOpenConsultation: () => void;
  variant?: 'home' | 'default';
}

// SSR-safe layout effect
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// ============================================================================
// HOME-ONLY NAVBAR VARIANT (<Navbar variant="home" />)
// Static position: fixed at top 12px, rounded pill, max-w 1240px.
// High contrast, 100% Light theme only across all pages.
// Logo is 100% original Codex Tech-IT asset.
// ============================================================================
const HomeNavbar: React.FC<{ onOpenConsultation: () => void }> = ({ onOpenConsultation }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerCloseBtnRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleServicesEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setServicesOpen(true);
  };

  const handleServicesLeave = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Scroll detection for navbar blur / elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change or outside click
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    if (servicesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [servicesOpen]);

  // Mobile Drawer Focus Trap & Body Scroll Lock
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        drawerCloseBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setMobileMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        id="home-navbar"
        role="banner"
        className="fixed top-3 left-4 right-4 max-w-[1240px] mx-auto h-14 lg:h-16 z-40 rounded-full select-none pointer-events-auto"
      >
        {/* Main Fixed Navbar Pill (100% Light Theme Only) */}
        <div
          className={`relative w-full h-full rounded-full flex items-center justify-between px-4 sm:px-6 transition-[border-color,box-shadow,background-color] duration-200 border ${
            mobileMenuOpen
              ? 'bg-white border-slate-200 text-slate-900 shadow-xl'
              : isScrolled
              ? 'bg-white/95 border-slate-200/90 shadow-lg shadow-slate-900/5 text-slate-900 backdrop-blur-md'
              : 'bg-white/90 border-slate-200/70 shadow-xs text-slate-900 backdrop-blur-sm'
          }`}
        >
          {/* Frosted Glass Backdrop Layer */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 rounded-full overflow-hidden pointer-events-none -z-10 transition-opacity duration-200 ${
              isScrolled && !mobileMenuOpen ? 'opacity-100' : 'opacity-0'
            } bg-white/60`}
          />

          {/* 1. Left: Brand Vector Logo (100% Original asset, zero alterations) */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg shrink-0"
            aria-label="Codex Tech-IT Home"
          >
            <img
              src="/assets/logo.svg"
              alt="Codex Tech-IT - We Deliver Jobs Faster"
              width="214"
              height="40"
              className="h-8 sm:h-9 lg:h-10 w-auto object-contain"
            />
          </Link>

          {/* 2. Centre: Desktop Navigation Links (Light theme text-slate-900) */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2 font-heading text-sm font-semibold transition-colors duration-200 text-slate-900"
          >
            {/* Services with Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <button
                type="button"
                onClick={() => setServicesOpen(!servicesOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    setServicesOpen(true);
                  } else if (e.key === 'Escape') {
                    setServicesOpen(false);
                  }
                }}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer text-slate-800 hover:text-orange-600 hover:bg-slate-100/60 ${
                  location.pathname.startsWith('/services') ? 'text-orange-600 font-bold' : ''
                }`}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                aria-controls="home-services-dropdown"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesOpen ? 'rotate-180 text-orange-500' : ''
                  }`}
                />
              </button>

              {/* 9 Services Mega-menu with seamless hover bridge & zero gap */}
              {servicesOpen && (
                <div
                  id="home-services-dropdown"
                  className="absolute top-full pt-2.5 -left-12 w-[620px] z-50 pointer-events-auto"
                  onMouseEnter={handleServicesEnter}
                  onMouseLeave={handleServicesLeave}
                >
                  {/* Invisible hover bridge spanning the vertical gap between button and card */}
                  <div className="absolute -top-3 left-0 right-0 h-4 pointer-events-auto" aria-hidden="true" />

                  <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 p-5 grid grid-cols-2 gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="col-span-2 pb-2 mb-1 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                        Specialized IT Solutions
                      </span>
                      <Link
                        to="/services"
                        onClick={() => setServicesOpen(false)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 group"
                      >
                        View all services <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                    {siteConfig.services.map((s) => (
                      <Link
                        key={s.slug}
                        to={`/services/${s.slug}`}
                        onClick={() => setServicesOpen(false)}
                        className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors group flex flex-col border border-transparent hover:border-slate-100"
                      >
                        <span className="text-sm font-bold text-navy-900 group-hover:text-orange-600 transition-colors flex items-center justify-between">
                          {s.title}
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-orange-600" />
                        </span>
                        <span className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-0.5">{s.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* About Us */}
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg transition-colors animated-underline text-slate-800 hover:text-orange-600 hover:bg-slate-100/60 ${
                location.pathname === '/about' ? 'active text-orange-600 font-bold' : ''
              }`}
            >
              About Us
            </Link>

            {/* Careers */}
            <Link
              to="/careers"
              className={`px-3 py-2 rounded-lg transition-colors animated-underline flex items-center gap-1.5 text-slate-800 hover:text-orange-600 hover:bg-slate-100/60 ${
                location.pathname.startsWith('/careers') ? 'active text-orange-600 font-bold' : ''
              }`}
            >
              <span>Careers</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-orange-100 text-orange-700">
                Hiring
              </span>
            </Link>

            {/* Refer & Earn */}
            <Link
              to="/refer-earn"
              className={`px-3 py-2 rounded-lg transition-colors animated-underline flex items-center gap-1.5 text-slate-800 hover:text-orange-600 hover:bg-slate-100/60 ${
                location.pathname === '/refer-earn' ? 'active text-orange-600 font-bold' : ''
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-emerald-600" />
              <span>Refer & Earn</span>
            </Link>

            {/* Blog */}
            <Link
              to="/blog"
              className={`px-3 py-2 rounded-lg transition-colors animated-underline text-slate-800 hover:text-orange-600 hover:bg-slate-100/60 ${
                location.pathname.startsWith('/blog') ? 'active text-orange-600 font-bold' : ''
              }`}
            >
              Blog
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg transition-colors animated-underline text-slate-800 hover:text-orange-600 hover:bg-slate-100/60 ${
                location.pathname === '/contact' ? 'active text-orange-600 font-bold' : ''
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* 3. Right: Primary Action Button */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenConsultation}
              className="btn-primary-orange font-bold px-4 py-2 flex items-center gap-1.5 text-white cursor-pointer shadow-sm rounded-full bg-[#C2410C] hover:bg-[#9A3412]"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Book Free Call</span>
            </Button>
          </div>

          {/* Mobile Menu Toggle (44px min target) */}
          <button
            ref={menuButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer text-slate-900 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Full-screen Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
          className="lg:hidden fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex flex-col pointer-events-auto"
        >
          <div className="bg-white h-full w-full max-w-md ml-auto p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header with Logo & Accessible Close Button */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <img
                    src="/assets/logo.svg"
                    alt="Codex Tech-IT"
                    width="214"
                    height="40"
                    className="h-9 w-auto object-contain"
                  />
                </Link>
                <button
                  ref={drawerCloseBtnRef}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    menuButtonRef.current?.focus();
                  }}
                  className="p-2.5 rounded-full text-slate-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close navigation menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex flex-col gap-1 font-heading text-base font-semibold text-navy-900 py-6 border-b border-gray-100">
                {/* Services Accordion in Mobile */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full flex items-center justify-between py-2.5 text-navy-900 hover:text-orange-500 cursor-pointer"
                    aria-expanded={mobileServicesOpen}
                  >
                    <span>Services</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileServicesOpen ? 'rotate-180 text-orange-500' : ''
                      }`}
                    />
                  </button>
                  {mobileServicesOpen && (
                    <div className="pl-3 pb-2 flex flex-col gap-2 border-l-2 border-orange-200 ml-1 mt-1 text-sm">
                      <Link
                        to="/services"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-orange-600 font-bold py-1"
                      >
                        All Services Overview →
                      </Link>
                      {siteConfig.services.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/services/${s.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-slate-600 hover:text-orange-500 py-1"
                        >
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-navy-900 hover:text-orange-500 py-2.5"
                >
                  About Us
                </Link>

                <Link
                  to="/careers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-navy-900 hover:text-orange-500 py-2.5 flex items-center justify-between"
                >
                  <span>Careers</span>
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                    Hiring
                  </span>
                </Link>

                <Link
                  to="/refer-earn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-orange-600 font-bold hover:text-orange-700 py-2.5 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-emerald-500" />
                    <span>Refer & Earn</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                    Up to $1,500
                  </span>
                </Link>

                <Link
                  to="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-navy-900 hover:text-orange-500 py-2.5 flex items-center justify-between"
                >
                  <span>Blog</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                </Link>

                <Link
                  to="/technologies"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-navy-900 hover:text-orange-500 py-2.5"
                >
                  Technologies & Stacks
                </Link>

                <Link
                  to="/success-stories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-navy-900 hover:text-orange-500 py-2.5"
                >
                  Success Stories
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-navy-900 hover:text-orange-500 py-2.5"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Drawer Bottom CTA */}
            <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Book Free Career Call</span>
              </Button>
              <div className="text-center text-xs text-slate-400">
                Direct phone: {siteConfig.contact.phoneUSA}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ============================================================================
// DEFAULT NAVBAR VARIANT (Unchanged for /about, /services, /careers, /blog, etc.)
// ============================================================================
const DefaultNavbar: React.FC<{ onOpenConsultation: () => void }> = ({ onOpenConsultation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const defaultCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleDefaultServicesEnter = () => {
    if (defaultCloseTimerRef.current) {
      clearTimeout(defaultCloseTimerRef.current);
      defaultCloseTimerRef.current = null;
    }
    setServicesOpen(true);
  };

  const handleDefaultServicesLeave = () => {
    if (defaultCloseTimerRef.current) {
      clearTimeout(defaultCloseTimerRef.current);
    }
    defaultCloseTimerRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (defaultCloseTimerRef.current) clearTimeout(defaultCloseTimerRef.current);
    };
  }, []);

  // Handle scroll detection and hide on down / show on up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 24);

      if (currentScrollY > 120 && currentScrollY > lastScrollY && !mobileMenuOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Lock body scroll and handle Escape key when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-transform duration-300 pointer-events-none px-3 sm:px-6 py-2 sm:py-3 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container-custom max-w-7xl px-0 pointer-events-auto">
        <div
          className={`rounded-2xl sm:rounded-full px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between transition-all duration-300 border ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-[14px] saturate-[160%] shadow-card border-slate-200/80 text-slate-700 navbar-glass'
              : 'bg-white/90 sm:bg-transparent backdrop-blur-[6px] sm:backdrop-blur-none border-slate-200/40 sm:border-transparent text-slate-800'
          }`}
        >
          {/* Logo with explicit dimensions to prevent CLS */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg shrink-0"
            aria-label="Codex Tech-IT Home"
          >
            <img
              src="/assets/logo.svg"
              alt="Codex Tech-IT - We Deliver Jobs Faster"
              width="214"
              height="40"
              className="h-10 sm:h-12 w-auto object-contain max-w-[214px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 font-heading text-sm font-semibold transition-colors text-slate-700"
          >
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleDefaultServicesEnter}
              onMouseLeave={handleDefaultServicesLeave}
            >
              <button
                type="button"
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer hover:text-orange-500 hover:bg-orange-50/50 ${
                  location.pathname.startsWith('/services') ? 'text-orange-500 font-bold' : ''
                }`}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesOpen ? 'rotate-180 text-orange-500' : ''
                  }`}
                />
              </button>

              {/* Mega-menu: 9 services with seamless hover bridge & zero gap */}
              {servicesOpen && (
                <div
                  className="absolute top-full pt-2.5 -left-20 w-[640px] z-50 pointer-events-auto"
                  onMouseEnter={handleDefaultServicesEnter}
                  onMouseLeave={handleDefaultServicesLeave}
                >
                  {/* Invisible hover bridge spanning the vertical gap */}
                  <div className="absolute -top-3 left-0 right-0 h-4 pointer-events-auto" aria-hidden="true" />

                  <div className="bg-white text-slate-900 rounded-2xl shadow-elevated border border-slate-200/90 p-5 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="col-span-2 pb-2 mb-1 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                        Specialized IT Solutions
                      </span>
                      <Link
                        to="/services"
                        onClick={() => setServicesOpen(false)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 group"
                      >
                        View all services <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                    {siteConfig.services.map((s) => (
                      <Link
                        key={s.slug}
                        to={`/services/${s.slug}`}
                        onClick={() => setServicesOpen(false)}
                        className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors group flex flex-col border border-transparent hover:border-slate-100"
                      >
                        <span className="text-sm font-bold text-navy-900 group-hover:text-orange-500 transition-colors flex items-center justify-between">
                          {s.title}
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-orange-500" />
                        </span>
                        <span className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-0.5">{s.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* About Us */}
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg transition-colors animated-underline hover:text-orange-500 hover:bg-orange-50/50 ${
                location.pathname === '/about' ? 'active text-orange-500 font-bold' : ''
              }`}
            >
              About Us
            </Link>

            {/* Careers */}
            <Link
              to="/careers"
              className={`px-3 py-2 rounded-lg transition-colors animated-underline flex items-center gap-1.5 hover:text-orange-500 hover:bg-orange-50/50 ${
                location.pathname.startsWith('/careers') ? 'active text-orange-500 font-bold' : ''
              }`}
            >
              <span>Careers</span>
              <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-extrabold uppercase tracking-wide">
                Hiring
              </span>
            </Link>

            {/* Refer & Earn */}
            <Link
              to="/refer-earn"
              className={`px-3 py-2 rounded-lg transition-colors animated-underline flex items-center gap-1.5 hover:text-orange-500 hover:bg-orange-50/50 ${
                location.pathname === '/refer-earn' ? 'active text-orange-500 font-bold' : ''
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-emerald-400" />
              <span>Refer & Earn</span>
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg transition-colors animated-underline hover:text-orange-500 hover:bg-orange-50/50 ${
                location.pathname === '/contact' ? 'active text-orange-500 font-bold' : ''
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/careers"
              className="px-3.5 py-2 rounded-xl text-xs font-bold transition-colors text-navy-900 hover:text-orange-600"
            >
              View Jobs
            </Link>
            <Button
              variant="primary"
              size="md"
              onClick={onOpenConsultation}
              className="shadow-sm flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Book Free Call</span>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 text-navy-900 hover:bg-gray-100"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Full-screen Mobile Animated Drawer */}
      {mobileMenuOpen && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
          className="lg:hidden fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-md flex flex-col pointer-events-auto"
        >
          <div className="bg-white h-full w-full max-w-md ml-auto p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <img
                    src="/assets/logo.svg"
                    alt="Codex Tech-IT"
                    width="214"
                    height="40"
                    className="h-10 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-gray-100 focus:outline-none"
                  aria-label="Close navigation menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-2 font-heading text-base font-semibold text-navy-900 py-6 border-b border-gray-100">
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-navy-900 hover:text-orange-500 py-1.5"
                >
                  About Us
                </Link>

                {/* Services Accordion in Mobile */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full flex items-center justify-between py-2.5 text-navy-900 hover:text-orange-500 cursor-pointer"
                    aria-expanded={mobileServicesOpen}
                  >
                    <span>Services</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileServicesOpen ? 'rotate-180 text-orange-500' : ''
                      }`}
                    />
                  </button>
                  {mobileServicesOpen && (
                    <div className="pl-3 pb-2 flex flex-col gap-2 border-l-2 border-orange-200 ml-1 mt-1 text-sm animate-in fade-in slide-in-from-top-1 duration-150">
                      <Link
                        to="/services"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-orange-600 font-bold py-1 flex items-center gap-1"
                      >
                        All Services Overview <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      {siteConfig.services.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/services/${s.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-slate-600 hover:text-orange-500 py-1"
                        >
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/careers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-navy-900 hover:text-orange-500 py-1.5 flex items-center justify-between"
                >
                  <span>Careers & Bench</span>
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">
                    Hiring
                  </span>
                </Link>

                <Link
                  to="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-navy-900 hover:text-orange-500 py-1.5"
                >
                  Engineering Blog
                </Link>

                <Link
                  to="/technologies"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-navy-900 hover:text-orange-500 py-1.5"
                >
                  Technologies & Stacks
                </Link>

                <Link
                  to="/plans"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-navy-900 hover:text-orange-500 py-1.5"
                >
                  Plans & Programs
                </Link>

                <Link
                  to="/success-stories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-navy-900 hover:text-orange-500 py-1.5"
                >
                  Success Stories
                </Link>

                <Link
                  to="/refer-earn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-orange-600 font-semibold hover:text-orange-700 py-1.5 flex items-center justify-between"
                >
                  <span>Refer & Earn</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                    Up to $1,500
                  </span>
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-navy-900 hover:text-orange-500 py-1.5"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Drawer Bottom CTA */}
            <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Book Free Career Call</span>
              </Button>
              <div className="text-center text-xs text-slate-400">
                Direct phone: {siteConfig.contact.phoneUSA}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// ============================================================================
// MAIN EXPORT (Fixed pill across all public routes, never moves, never shrinks)
// ============================================================================
export const Navbar: React.FC<NavbarProps> = ({ onOpenConsultation }) => {
  return <HomeNavbar onOpenConsultation={onOpenConsultation} />;
};
