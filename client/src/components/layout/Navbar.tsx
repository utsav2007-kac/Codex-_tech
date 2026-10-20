import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight, Sparkles, Briefcase, Wrench, Building2, PhoneCall } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { Button } from '../ui/Button';

interface NavbarProps {
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConsultation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
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

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
    setToolsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-white border-b border-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo (Unaltered, crisp) */}
          <Link to="/" className="flex items-center gap-2 group focus:outline-none" aria-label="Codex Tech-IT Home">
            <img
              src="/assets/logo.svg"
              alt="Codex Tech-IT - We Deliver Jobs Faster"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 font-heading text-sm font-semibold text-slate-700">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg hover:text-orange-500 hover:bg-orange-50/50 transition-colors ${
                  location.pathname.startsWith('/services') ? 'text-orange-500' : ''
                }`}
                aria-expanded={servicesOpen}
              >
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180 text-orange-500' : ''}`} />
              </button>

              {/* Mega-menu: 9 services + one-line descriptions */}
              {servicesOpen && (
                <div className="absolute top-full -left-20 w-[640px] bg-white rounded-2xl shadow-card border border-gray-100 p-5 grid grid-cols-2 gap-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="col-span-2 pb-2 mb-1 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Specialized IT Solutions</span>
                    <Link to="/services" className="text-xs text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1">
                      View all services <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {siteConfig.services.map((s) => (
                    <Link
                      key={s.slug}
                      to={`/services/${s.slug}`}
                      className="p-2.5 rounded-xl hover:bg-gray-50 transition-colors group flex flex-col"
                    >
                      <span className="text-sm font-bold text-navy-900 group-hover:text-orange-500 transition-colors flex items-center justify-between">
                        {s.title}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-orange-500" />
                      </span>
                      <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{s.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* About Us */}
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg hover:text-orange-500 hover:bg-orange-50/50 transition-colors animated-underline ${
                location.pathname === '/about' ? 'active text-orange-500 font-bold' : ''
              }`}
            >
              About Us
            </Link>

            {/* Careers */}
            <Link
              to="/careers"
              className={`px-3 py-2 rounded-lg hover:text-orange-500 hover:bg-orange-50/50 transition-colors animated-underline flex items-center gap-1.5 ${
                location.pathname.startsWith('/careers') ? 'active text-orange-500 font-bold' : ''
              }`}
            >
              <span>Careers</span>
              <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-extrabold uppercase tracking-wide">
                Hiring
              </span>
            </Link>

            {/* Insights */}
            <Link
              to="/insights"
              className={`px-3 py-2 rounded-lg hover:text-orange-500 hover:bg-orange-50/50 transition-colors animated-underline ${
                location.pathname.startsWith('/insights') ? 'active text-orange-500 font-bold' : ''
              }`}
            >
              Insights
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg hover:text-orange-500 hover:bg-orange-50/50 transition-colors animated-underline ${
                location.pathname === '/contact' ? 'active text-orange-500 font-bold' : ''
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/careers"
              className="px-4 py-2 rounded-xl text-xs font-bold text-navy-900 hover:text-orange-600 transition-colors"
            >
              View Jobs
            </Link>
            <Button variant="primary" size="md" onClick={onOpenConsultation}>
              Hire Talent
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-navy-900 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-white border-b border-gray-200 p-6 shadow-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4 font-heading font-semibold text-base">
            <Link to="/about" className="text-navy-900 hover:text-orange-500 py-1">
              About Us
            </Link>

            <Link to="/services" className="text-navy-900 hover:text-orange-500 py-1 flex items-center justify-between">
              Services <ChevronDown className="w-4 h-4 text-slate-400" />
            </Link>
            <div className="pl-4 flex flex-col gap-2 text-sm font-medium text-slate-600 border-l border-orange-500/30">
              {siteConfig.services.slice(0, 5).map((s) => (
                <Link key={s.slug} to={`/services/${s.slug}`} className="hover:text-orange-500">
                  {s.title}
                </Link>
              ))}
              <Link to="/services" className="text-xs font-bold text-orange-500">
                + View all 9 services
              </Link>
            </div>

            <Link to="/careers" className="text-navy-900 hover:text-orange-500 py-1 flex items-center justify-between">
              <span>Careers at Codex</span>
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">We're Hiring</span>
            </Link>
            <Link to="/plans" className="text-navy-900 hover:text-orange-500 py-1">
              Plans & Pricing
            </Link>
            <Link to="/success-stories" className="text-navy-900 hover:text-orange-500 py-1">
              Success Stories
            </Link>
            <Link to="/insights" className="text-navy-900 hover:text-orange-500 py-1">
              Industry Insights
            </Link>
            <Link to="/refer-earn" className="text-navy-900 hover:text-orange-500 py-1">
              Refer & Earn
            </Link>
            <Link to="/insights" className="text-navy-900 hover:text-orange-500 py-1">
              Insights & Blog
            </Link>
            <Link to="/faq" className="text-navy-900 hover:text-orange-500 py-1">
              FAQs
            </Link>
            <Link to="/contact" className="text-navy-900 hover:text-orange-500 py-1">
              Contact Us
            </Link>

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <Button variant="primary" size="lg" onClick={onOpenConsultation} className="w-full">
                Book Free Career Call
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
