import React, { useMemo } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  PhoneCall,
  Navigation,
} from 'lucide-react';
import { siteConfig } from '../../config/site';
import { OfficeClock } from './OfficeClock';

export const GlobalHubShowcase: React.FC = () => {
  // Dynamic time difference calculation between New York (EST) and India (IST)
  const timeDifferenceText = useMemo(() => {
    try {
      const now = new Date();
      const usDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const indDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const diffHours = (indDate.getTime() - usDate.getTime()) / (1000 * 60 * 60);
      const rounded = Math.round(diffHours * 10) / 10;
      return `${rounded} hours ahead`;
    } catch {
      return '9.5 hours ahead';
    }
  }, []);

  return (
    <div id="global-hub-showcase" className="w-full py-10">
      {/* ── TOP CONNECTED ROUTE CORRIDOR BANNER (MATCHING IMAGE 1) ── */}
      <div className="mb-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-[#0F172A] font-semibold">
          <span className="p-1.5 rounded-lg bg-[#E8F2FF] text-[#1D4ED8]">
            <Navigation className="w-4 h-4 rotate-45" />
          </span>
          <span>Direct Talent Corridor: NYC ⇄ AMD</span>
          <span className="hidden sm:inline text-[#94A3B8]">•</span>
          <span className="font-mono text-[#1D4ED8] bg-[#E8F2FF] px-2 py-0.5 rounded text-[11px]">
            India is {timeDifferenceText} of New York (EST)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#475569] font-medium">
          <Clock className="w-3.5 h-3.5 text-[#C2410C]" />
          <span>
            Shared Working Window: <strong>8:00 AM – 12:30 PM EST</strong> / <strong>5:30 PM – 10:00 PM IST</strong>
          </span>
        </div>
      </div>

      {/* ── BOARDING PASSES DUAL GRID (IMAGE 1) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Center Route Flight Pill for Desktop */}
        <div
          className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFFFFF] border-2 border-dashed border-[#2563EB] items-center justify-center text-[#2563EB] z-10 pointer-events-none shadow-md"
          title="Continuous Talent Delivery Pipeline"
        >
          <Navigation className="w-4 h-4 rotate-45" />
        </div>

        {/* ── BOARDING PASS 1: USA (NEW YORK HQ) - SKY TINT ── */}
        <div
          id="office-boarding-pass-usa"
          className="rounded-2xl bg-[#E8F2FF] border border-[#BFDBFE] p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
        >
          <div>
            {/* Header Ribbon */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-dashed border-[#BFDBFE]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8] bg-[#FFFFFF] px-2 py-0.5 rounded shadow-2xs">
                  BOARDING PASS • CDX-USA
                </span>
                <span className="text-[11px] font-semibold text-[#1E3A8A]">
                  NEW YORK, NY
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#64748B]">
                TERM 01 / DESK A
              </span>
            </div>

            {/* Clock & City Summary */}
            <div className="mb-5 bg-[#FFFFFF]/75 backdrop-blur-xs p-4 rounded-xl border border-[#DBEAFE]">
              <OfficeClock
                timeZone="America/New_York"
                cityName="New York, NY"
                countryCode="USA"
                badgeTint="sky"
              />
            </div>

            {/* Office Contact Details */}
            <div className="space-y-2.5 text-xs text-[#334155] mb-6">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
                <span className="font-medium">
                  447 Broadway, 2nd Floor, 1404, New York, NY(USA) 10013
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                <a
                  href={`tel:${siteConfig.contact.phoneUSA.replace(/[^0-9+]/g, '')}`}
                  className="font-semibold text-[#0F172A] hover:text-[#1D4ED8] transition-colors"
                >
                  {siteConfig.contact.phoneUSA}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-[#334155] hover:text-[#0F172A] transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-[#64748B]">
                <Clock className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <span>Mon - Fri: 9:00 AM - 6:00 PM EST</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-dashed border-[#BFDBFE] flex items-center gap-3">
            <a
              href="https://maps.app.goo.gl/FcqnoXS2xYZShTdS6"
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] border border-[#CBD5E1] transition-all shadow-2xs hover:border-[#94A3B8]"
            >
              <MapPin className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>Get Directions</span>
              <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
            </a>
            <a
              href={`tel:${siteConfig.contact.phoneUSA.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold text-[#FFFFFF] transition-all shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call US HQ</span>
            </a>
          </div>
        </div>

        {/* ── BOARDING PASS 2: INDIA (AHMEDABAD DELIVERY HUB) - BUTTER TINT ── */}
        <div
          id="office-boarding-pass-india"
          className="rounded-2xl bg-[#FFF4D6] border border-[#FDE68A] p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
        >
          <div>
            {/* Header Ribbon */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-dashed border-[#FDE68A]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C2410C] bg-[#FFFFFF] px-2 py-0.5 rounded shadow-2xs">
                  BOARDING PASS • CDX-IND
                </span>
                <span className="text-[11px] font-semibold text-[#9A3412]">
                  AHMEDABAD, GUJARAT
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#64748B]">
                GATE 02 / TECH HUB
              </span>
            </div>

            {/* Clock & City Summary */}
            <div className="mb-5 bg-[#FFFFFF]/75 backdrop-blur-xs p-4 rounded-xl border border-[#FEF08A]">
              <OfficeClock
                timeZone="Asia/Kolkata"
                cityName="Ahmedabad, GJ"
                countryCode="IND"
                badgeTint="butter"
              />
            </div>

            {/* Office Contact Details */}
            <div className="space-y-2.5 text-xs text-[#334155] mb-6">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C2410C] shrink-0 mt-0.5" />
                <span className="font-medium">
                  1301, Shivalik Shilp, Near Iskcon Cross Road, Ahmedabad(380038), Gujarat, India
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C2410C] shrink-0" />
                <a
                  href={`tel:${siteConfig.contact.phoneUSA.replace(/[^0-9+]/g, '')}`}
                  className="font-semibold text-[#0F172A] hover:text-[#C2410C] transition-colors"
                >
                  {siteConfig.contact.phoneUSA}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C2410C] shrink-0" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-[#334155] hover:text-[#0F172A] transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-[#64748B]">
                <Clock className="w-4 h-4 text-[#94A3B8] shrink-0" />
                <span>Mon - Fri: 10:00 AM - 7:00 PM IST</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-dashed border-[#FDE68A] flex items-center gap-3">
            <a
              href="https://maps.app.goo.gl/GMA7Km77bYXce3H28"
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] border border-[#CBD5E1] transition-all shadow-2xs hover:border-[#94A3B8]"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>Get Directions</span>
              <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
            </a>
            <a
              href={`tel:${siteConfig.contact.phoneUSA.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-xs font-semibold text-[#FFFFFF] transition-all shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call India Hub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
