import React, { useState } from 'react';
import {
  Building2,
  ArrowUpRight,
  DollarSign,
  Briefcase,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ShowcasePlacementCard {
  id: string;
  personName: string;
  companyName: string;
  position: string;
  packageAmount: string;
  daysToPlacement: string;
  badge: string;
  badgeColor: string;
  link: string;
}

// Row 1: Active Bench Candidate Placements (Stream 01 - Flowing Left)
const row1Cards: ShowcasePlacementCard[] = [
  {
    id: 'plc-1',
    personName: 'Rohit Sharma',
    companyName: 'Capital One',
    position: 'Senior Cloud Solutions Architect',
    packageAmount: '$165,000 / yr',
    daysToPlacement: '8 Days to Offer',
    badge: 'Direct Client',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    link: '/services/job-placement',
  },
  {
    id: 'plc-2',
    personName: 'Ananya Mishra',
    companyName: 'JPMorgan Chase',
    position: 'Staff Data Platform Engineer',
    packageAmount: '$178,000 / yr',
    daysToPlacement: '12 Days to Offer',
    badge: 'Tier-1 Enterprise',
    badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    link: '/services/job-placement',
  },
  {
    id: 'plc-3',
    personName: 'Marcus Chen',
    companyName: 'Amazon AWS',
    position: 'DevSecOps & Kubernetes SRE',
    packageAmount: '$185,000 / yr',
    daysToPlacement: '9 Days to Offer',
    badge: 'Fast-Track Fill',
    badgeColor: 'bg-orange-500/15 text-[#F15A24] border-orange-500/30',
    link: '/services/job-placement',
  },
  {
    id: 'plc-4',
    personName: 'Priya Patel',
    companyName: 'Salesforce',
    position: 'Lead Full-Stack React / Node',
    packageAmount: '$152,000 / yr',
    daysToPlacement: '15 Days to Offer',
    badge: 'H1B Sponsored',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    link: '/services/job-placement',
  },
  {
    id: 'plc-5',
    personName: 'Kevin Taylor',
    companyName: 'Cisco Systems',
    position: 'Principal Machine Learning Engineer',
    packageAmount: '$192,000 / yr',
    daysToPlacement: '7 Days to Offer',
    badge: 'Exclusive Desk',
    badgeColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    link: '/services/job-placement',
  },
  {
    id: 'plc-6',
    personName: 'Elena Vasquez',
    companyName: 'Deloitte US',
    position: 'Enterprise Java Microservices Lead',
    packageAmount: '$158,000 / yr',
    daysToPlacement: '11 Days to Offer',
    badge: 'E-Verified',
    badgeColor: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    link: '/services/job-placement',
  },
  {
    id: 'plc-7',
    personName: 'Vikram Malhotra',
    companyName: 'Morgan Stanley',
    position: 'Distributed Data Pipeline Lead',
    packageAmount: '$172,000 / yr',
    daysToPlacement: '14 Days to Offer',
    badge: 'Tier-1 Banking',
    badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    link: '/services/job-placement',
  },
  {
    id: 'plc-8',
    personName: 'Sarah Jenkins',
    companyName: 'Humana Healthcare',
    position: 'Cybersecurity & Zero-Trust Architect',
    packageAmount: '$168,000 / yr',
    daysToPlacement: '10 Days to Offer',
    badge: 'Direct Hire',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    link: '/services/job-placement',
  },
];

// Row 2: Active Bench Candidate Placements (Stream 02 - Flowing Right)
const row2Cards: ShowcasePlacementCard[] = [
  {
    id: 'plc-9',
    personName: 'David Lin',
    companyName: 'Microsoft Azure',
    position: 'Cloud Infrastructure Architect',
    packageAmount: '$180,000 / yr',
    daysToPlacement: '6 Days to Offer',
    badge: 'Bench Priority',
    badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    link: '/services/job-placement',
  },
  {
    id: 'plc-10',
    personName: 'Sneha Reddy',
    companyName: 'Oracle Cloud',
    position: 'Snowflake & PySpark Platform Lead',
    packageAmount: '$162,000 / yr',
    daysToPlacement: '13 Days to Offer',
    badge: 'STEM-OPT Verified',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    link: '/services/job-placement',
  },
  {
    id: 'plc-11',
    personName: 'Arjun Nair',
    companyName: 'Stripe',
    position: 'High-Throughput Payment SRE',
    packageAmount: '$188,000 / yr',
    daysToPlacement: '9 Days to Offer',
    badge: 'Direct Client',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    link: '/services/job-placement',
  },
  {
    id: 'plc-12',
    personName: 'Rachel Adams',
    companyName: 'Netflix',
    position: 'Lead Streaming Platform Engineer',
    packageAmount: '$195,000 / yr',
    daysToPlacement: '8 Days to Offer',
    badge: 'Exclusive Desk',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    link: '/services/job-placement',
  },
  {
    id: 'plc-13',
    personName: 'Karthik Raman',
    companyName: 'Barclays US',
    position: 'Kafka & Event-Driven Architect',
    packageAmount: '$160,000 / yr',
    daysToPlacement: '15 Days to Offer',
    badge: 'Tier-1 Banking',
    badgeColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    link: '/services/job-placement',
  },
  {
    id: 'plc-14',
    personName: 'Jessica Martinez',
    companyName: 'Uber Freight',
    position: 'Mobile Lead (React Native / iOS)',
    packageAmount: '$155,000 / yr',
    daysToPlacement: '11 Days to Offer',
    badge: 'Direct Pitch',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    link: '/services/job-placement',
  },
  {
    id: 'plc-15',
    personName: 'Deepak Varma',
    companyName: 'Walmart Global Tech',
    position: 'Supply Chain Cloud Data Architect',
    packageAmount: '$174,000 / yr',
    daysToPlacement: '10 Days to Offer',
    badge: 'Enterprise Hire',
    badgeColor: 'bg-orange-500/15 text-[#F15A24] border-orange-500/30',
    link: '/services/job-placement',
  },
  {
    id: 'plc-16',
    personName: 'Hannah Mueller',
    companyName: 'Cigna Healthcare',
    position: 'HealthTech Observability & SRE Lead',
    packageAmount: '$164,000 / yr',
    daysToPlacement: '12 Days to Offer',
    badge: 'E-Verified',
    badgeColor: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    link: '/services/job-placement',
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

interface UniformPlacementCardProps {
  item: ShowcasePlacementCard;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const UniformPlacementCard: React.FC<UniformPlacementCardProps> = ({
  item,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <Link
      to={item.link}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="showcase-card shrink-0 w-[310px] sm:w-[345px] p-4 sm:p-5 rounded-2xl bg-[#243550]/95 hover:bg-[#2C3F60] border border-slate-600/70 hover:border-[#F15A24]/70 shadow-lg hover:shadow-[0_12px_36px_rgba(241,90,36,0.25)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group/card select-none cursor-pointer"
    >
      <div>
        {/* Top Header: Person Avatar + Name + Company & Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Person Initials Avatar */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A263B] to-[#121B2A] border border-slate-500/70 flex items-center justify-center font-heading font-black text-sm text-[#F15A24] shrink-0 group-hover/card:scale-105 group-hover/card:border-[#F15A24]/60 transition-all shadow-inner">
              {getInitials(item.personName)}
            </div>

            {/* 1. Person Name & 2. Company Name */}
            <div className="min-w-0">
              <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover/card:text-[#F15A24] transition-colors truncate">
                {item.personName}
              </h4>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#93C5FD] truncate">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{item.companyName}</span>
              </div>
            </div>
          </div>

          {/* Badge */}
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${item.badgeColor}`}
          >
            {item.badge}
          </span>
        </div>

        {/* 3. Position Box */}
        <div className="mt-2.5 mb-3 p-3 rounded-xl bg-[#131C2E]/80 border border-slate-700/80 flex flex-col gap-1">
          <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-slate-400" />
            <span>Position</span>
          </span>
          <p className="text-xs sm:text-[13px] font-bold text-slate-100 truncate group-hover/card:text-white">
            {item.position}
          </p>
        </div>

        {/* 4. Package Row */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl mb-3 bg-emerald-500/15 border border-emerald-500/30">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span>Package</span>
          </span>
          <span className="text-sm font-heading font-black text-emerald-300 tabular-nums">
            {item.packageAmount}
          </span>
        </div>
      </div>

      {/* 5. The Day in Placement Bottom Bar */}
      <div className="pt-2.5 border-t border-slate-700/80 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-400/15 px-2.5 py-1 rounded-lg border border-amber-400/30 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Clock className="w-3 h-3" />
          {item.daysToPlacement}
        </span>

        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover/card:text-[#F15A24] transition-colors">
          <span>Offer Vetted</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
};

export const Dual3DScrollShowcase: React.FC = () => {
  // Card-level hover pause state: true when cursor is hovering over any box/card
  const [isCardHovered, setIsCardHovered] = useState(false);

  const handleCardEnter = () => setIsCardHovered(true);
  const handleCardLeave = () => setIsCardHovered(false);

  return (
    <section
      id="enterprise-showcase"
      aria-label="Enterprise Ecosystem & Active Bench Showcase"
      data-nav-theme="dark"
      className="showcase-container relative w-full py-16 overflow-hidden bg-gradient-to-b from-[#182338] via-[#21304A] to-[#182338] text-white border-y border-slate-700/80"
    >
      {/* Ambient background glow matching website brand colors */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-[#F15A24]/15 via-[#1F6AA5]/20 to-[#F15A24]/10 blur-[120px] pointer-events-none rounded-full" />

      {/* ── HEADER ── */}
      <div className="container-custom relative z-10 mb-8 sm:mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#F15A24] animate-pulse" />
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#F15A24]">
                Enterprise Hiring Cohorts
              </span>
            </div>
            <h2 className="text-h2 font-heading font-bold text-white leading-tight">
              Enterprise Ecosystem & <span className="text-[#F15A24]">Active Bench Cohorts</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed font-normal">
              Direct hiring desks, verified candidate packages, and rapid placement turnarounds across top tech employers.
            </p>
          </div>

          <Link
            to="/careers"
            className="text-xs font-bold text-[#93C5FD] hover:text-white hover:underline flex items-center gap-1 self-start lg:self-auto transition-colors"
          >
            <span>Explore all requisitions</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── BUTTERY-SMOOTH GPU-ACCELERATED DUAL MARQUEE STREAMS (CONTINUOUS 60FPS) ── */}
      <div className="w-full relative overflow-hidden space-y-5">
        {/* Soft edge masking for smooth fade */}
        <div
          className="w-full relative overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          }}
        >
          {/* Stream 1: Flows Left gently and smoothly. Pauses when cursor hovers on cards */}
          <div className="flex overflow-hidden py-1">
            <div
              className="marquee-track flex shrink-0 items-center gap-5"
              style={{
                animation: 'marquee-left 115s linear infinite',
                animationPlayState: isCardHovered ? 'paused' : 'running',
                willChange: 'transform',
              }}
            >
              {[...row1Cards, ...row1Cards].map((item, idx) => (
                <UniformPlacementCard
                  key={`r1-${item.id}-${idx}`}
                  item={item}
                  onMouseEnter={handleCardEnter}
                  onMouseLeave={handleCardLeave}
                />
              ))}
            </div>
            <div
              aria-hidden="true"
              className="marquee-track flex shrink-0 items-center gap-5"
              style={{
                animation: 'marquee-left 115s linear infinite',
                animationPlayState: isCardHovered ? 'paused' : 'running',
                willChange: 'transform',
              }}
            >
              {[...row1Cards, ...row1Cards].map((item, idx) => (
                <UniformPlacementCard
                  key={`r1-dup-${item.id}-${idx}`}
                  item={item}
                  onMouseEnter={handleCardEnter}
                  onMouseLeave={handleCardLeave}
                />
              ))}
            </div>
          </div>

          {/* Stream 2: Flows Right gently and smoothly. Pauses when cursor hovers on cards */}
          <div className="flex overflow-hidden py-1">
            <div
              className="marquee-track flex shrink-0 items-center gap-5"
              style={{
                animation: 'marquee-right 125s linear infinite',
                animationPlayState: isCardHovered ? 'paused' : 'running',
                willChange: 'transform',
              }}
            >
              {[...row2Cards, ...row2Cards].map((item, idx) => (
                <UniformPlacementCard
                  key={`r2-${item.id}-${idx}`}
                  item={item}
                  onMouseEnter={handleCardEnter}
                  onMouseLeave={handleCardLeave}
                />
              ))}
            </div>
            <div
              aria-hidden="true"
              className="marquee-track flex shrink-0 items-center gap-5"
              style={{
                animation: 'marquee-right 125s linear infinite',
                animationPlayState: isCardHovered ? 'paused' : 'running',
                willChange: 'transform',
              }}
            >
              {[...row2Cards, ...row2Cards].map((item, idx) => (
                <UniformPlacementCard
                  key={`r2-dup-${item.id}-${idx}`}
                  item={item}
                  onMouseEnter={handleCardEnter}
                  onMouseLeave={handleCardLeave}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded High-Performance Keyframes + CSS Hover Pause Fallback */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes marquee-right {
          0% { transform: translate3d(-100%, 0, 0); }
        }
        /* When hovering directly on any card box, stop the marquee tracks */
        .showcase-container:has(.showcase-card:hover) .marquee-track {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
};
