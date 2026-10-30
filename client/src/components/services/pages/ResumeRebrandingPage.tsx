import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  FileText,
  Sliders,
  Check,
  TrendingUp,
  Award,
  Search,
  Eye,
  Maximize2,
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { oldSiteServices } from '../../../content/oldSiteContent';

interface ServicePageProps {
  service: any;
  onOpenConsultation?: () => void;
}

export const ResumeRebrandingPage: React.FC<ServicePageProps> = ({ service, onOpenConsultation }) => {
  // Signature Component: Draggable & Keyboard-operable Before/After Slider
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateSliderFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);
    const clamped = Math.max(25, Math.min(75, percentage));
    setSliderPosition(clamped);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderFromClientX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateSliderFromClientX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      updateSliderFromClientX(e.touches[0].clientX);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(25, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(75, prev + 5));
    }
  };

  return (
    <div className="w-full bg-[#FAFBFD] text-[#0F172A] selection:bg-[#F25C2A]/20 selection:text-[#C2410C]">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO: SKY & BUTTER SPLIT TINT WITH BEFORE/AFTER SLIDER AS HERO
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-r from-[#E8F2FF] via-[#F8FAFC] to-[#FFF4D6] border-b border-[#E2E8F0]">
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#475569] mb-6 font-medium">
            <Link to="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/services" className="hover:text-[#0F172A] transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#C2410C] font-semibold">Resume & LinkedIn Rebranding</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-200 text-[#1D4ED8] text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F25C2A]" />
                <span>Executive Technical Re-Engineering</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
                Architectural Resume & <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#C2410C] to-[#D97706]">
                  LinkedIn Optimization.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Transform passive task listings into high-impact architectural defense dossiers that score 95%+ on enterprise ATS parsers and command direct recruiter inbound.
              </p>

              {/* ATS Score Gauge Pill */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-slate-600">ATS Match Gauge</div>
                  <div className="text-sm font-bold text-[#0F172A]">Parser Calibration Uplift</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-600 line-through">42%</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                    98% Match
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onOpenConsultation}
                  className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold shadow-md shadow-[#C2410C]/20 px-6 py-3"
                >
                  Get Free Resume Audit <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>

            {/* Right Column: Signature Component - Draggable Before/After Slider */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                  <span className="font-bold text-[#0F172A] font-heading">Interactive Resume Comparison</span>
                  <span className="text-slate-600 font-mono">Drag slider or use Left/Right arrow keys</span>
                </div>

                {/* Slider Canvas Area */}
                <div
                  ref={containerRef}
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchMove={handleTouchMove}
                  className="relative min-h-[350px] sm:min-h-[320px] w-full rounded-2xl border border-slate-200 overflow-hidden select-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                >
                  {/* "Before" Container (Left Side of Slider) */}
                  <div
                    className="absolute inset-y-0 left-0 bg-slate-50 border-r-2 border-[#2563EB] p-4 sm:p-5 text-xs overflow-hidden flex flex-col justify-between"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2 gap-2">
                        <span className="font-bold text-slate-700 font-mono truncate">BEFORE: Generic Task Listing</span>
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold shrink-0">ATS 42%</span>
                      </div>
                      <div className="font-bold text-sm text-slate-800 truncate">Software Developer</div>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
                        • Responsible for writing backend code in Java and maintaining database queries.
                      </p>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
                        • Worked with cloud team to deploy applications to Amazon Web Services.
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 italic">
                        (Passive wording, zero measurable business impact, low recruiter keyword density)
                      </p>
                    </div>
                    <div className="pt-2 flex flex-wrap gap-1">
                      {['Java 8', 'SQL', 'Basic AWS', 'Bug Fixes'].map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[9px] font-mono font-bold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* "After" Container (Right Side of Slider) */}
                  <div
                    className="absolute inset-y-0 right-0 bg-[#FFFDF7] p-4 sm:p-5 text-xs overflow-hidden flex flex-col justify-between"
                    style={{ left: `${sliderPosition}%`, width: `${100 - sliderPosition}%` }}
                  >
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2 gap-2">
                        <span className="font-bold text-amber-900 font-mono truncate">AFTER: Codex Re-Engineered Resume</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">ATS 98%</span>
                      </div>
                      <div className="font-bold text-sm text-[#0F172A] truncate">Senior Cloud & Distributed Systems Architect</div>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-mono">
                        • Re-architected core payment event mesh using Apache Kafka & Go microservices, reducing end-to-end P99 latency by 42% across 12M daily transactions.
                      </p>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-mono">
                        • Spearheaded multi-region AWS Terraform migration for 80+ ECS container services, cutting cloud infrastructure overhead by $280k annually.
                      </p>
                    </div>
                    <div className="pt-2 flex flex-wrap gap-1">
                      {['Kafka', 'Go', 'AWS', 'Terraform', 'Distributed Systems'].map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-mono font-bold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Drag Handle with vertical line */}
                  <div
                    className="absolute top-0 bottom-0 w-8 -ml-4 flex items-center justify-center cursor-ew-resize pointer-events-none z-10"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white shadow-md flex items-center justify-center text-[10px] font-bold">
                      ↔
                    </div>
                  </div>
                </div>

                {/* Range Input for accessible dragging */}
                <div className="pt-2">
                  <input
                    type="range"
                    min="25"
                    max="75"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                    aria-label="Before and after resume comparison slider"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
                    <span>← Expand Original ("Before")</span>
                    <span>Expand Re-Engineered ("After") →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING MINI NAV
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-3">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold text-slate-600">
            <a href="#enhanced-crafting" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
              Enhanced Resume Crafting
            </a>
            <a href="#resume-promotion" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
              Strategic Talent Promotion
            </a>
            <a href="#linkedin" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
              LinkedIn Magnetism
            </a>
          </div>
          <Button
            size="sm"
            onClick={onOpenConsultation}
            className="bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold py-1.5 px-3.5 shrink-0"
          >
            Upload Resume
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ENHANCED RESUME CRAFTING (OLD SITE GROUNDING)
          ───────────────────────────────────────────────────────────── */}
      <section id="enhanced-crafting" className="py-16 scroll-mt-28">
        <div className="container-custom space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">US Market Calibration</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              {oldSiteServices.enhancedResumeCrafting.title}
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              {oldSiteServices.enhancedResumeCrafting.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {oldSiteServices.enhancedResumeCrafting.highlights.map((h, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                  0{i + 1}
                </div>
                <h4 className="font-heading font-bold text-sm text-[#0F172A]">{h}</h4>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Tailored to pass automated screening hurdles and immediately impress senior engineering directors.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. RESUME PROMOTION (OLD SITE GROUNDING)
          ───────────────────────────────────────────────────────────── */}
      <section id="resume-promotion" className="py-16 bg-white border-y border-slate-200 scroll-mt-28">
        <div className="container-custom space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">Direct Representation</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              {oldSiteServices.resumePromotion.title}
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              {oldSiteServices.resumePromotion.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {oldSiteServices.resumePromotion.highlights.map((h, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#FAFBFD] border border-slate-200 shadow-xs space-y-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-heading font-bold text-sm text-[#0F172A]">{h}</h4>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Direct submission to verified enterprise partner desks without intermediate recruiting spam.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. LINKEDIN PROFILE MAGNETISM
          ───────────────────────────────────────────────────────────── */}
      <section id="linkedin" className="py-16 scroll-mt-28">
        <div className="container-custom space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Inbound Traffic</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              LinkedIn Inbound Recruiter Optimization
            </h2>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Recruiters search LinkedIn using Boolean strings for exact technical stacks, cloud certifications, and project scale. We rewrite your headline, about summary, and featured project sections to guarantee top algorithmic ranking on LinkedIn Recruiter searches.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. CLOSING CTA (Split Pill)
          ───────────────────────────────────────────────────────────── */}
      <div className="container-custom pb-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#E8F2FF] via-white to-[#FFF4D6] border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl sm:text-2xl font-heading font-extrabold text-[#0F172A]">
              Ready for a Professional Resume Re-Engineering?
            </h4>
            <p className="text-xs sm:text-sm text-[#475569] max-w-lg">
              Upload your current resume for a comprehensive ATS keyword audit and expert feedback from senior tech recruiters.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={onOpenConsultation}
            className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold px-7 py-3.5 shrink-0 shadow-md"
          >
            Upload for Free Review <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
