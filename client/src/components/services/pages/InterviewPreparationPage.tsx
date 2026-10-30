import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  HelpCircle,
  RotateCw,
  Video,
  UserCheck,
  Check,
  Award,
  Layers,
  MessageSquare,
  Target,
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { oldSiteServices } from '../../../content/oldSiteContent';

interface ServicePageProps {
  service: any;
  onOpenConsultation?: () => void;
}

export const InterviewPreparationPage: React.FC<ServicePageProps> = ({ service, onOpenConsultation }) => {
  // Signature Component: Flip Card Deck State
  const [activeCard, setActiveCard] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Round Tabs Navigation State
  const [activeTab, setActiveTab] = useState<'flashcards' | 'one-on-one' | 'mock-simulation' | 'rubric'>('flashcards');

  const flashcards = [
    {
      type: 'Distributed System Design',
      tag: 'Tier-1 Architecture',
      question: 'How do you design an idempotent payment processing API under network partition failures?',
      starAnswer: {
        situation: 'Financial microservices processing concurrent transaction streams across multi-region AWS.',
        task: 'Guarantee zero double-charges during transit network timeouts and downstream API drops.',
        action: 'Introduced unique idempotency keys in Redis with atomicity leases, transactional outbox pattern in PostgreSQL, and Kafka reconciliation events.',
        result: 'Achieved 99.999% transaction reliability and eliminated duplicate authorizations.',
      },
      rubricTips: 'Highlight trade-offs between consistency and availability; mention Redis lease timeouts.',
    },
    {
      type: 'Algorithmic Concurrency',
      tag: 'Backend Performance',
      question: 'Explain how you detect and prevent race conditions in a high-throughput Java or Go thread pool.',
      starAnswer: {
        situation: 'Live trade matching engine experiencing thread lock contention under market surge bursts.',
        task: 'Refactor state updates to eliminate deadlocks and maintain sub-millisecond execution.',
        action: 'Replaced synchronized blocks with lock-free Compare-And-Swap (CAS) atomic variables and Disruptor ring buffer queues.',
        result: 'Throughput increased from 8k to 65k ops/sec with zero thread contention stalls.',
      },
      rubricTips: 'Discuss lock-free data structures and memory visibility semantics.',
    },
    {
      type: 'Behavioral Engineering Leadership',
      tag: 'STAR Framing',
      question: 'Describe a situation where you had a strong technical disagreement with a Product Director.',
      starAnswer: {
        situation: 'Product requested skipping integration tests and database migrations to meet a marketing launch date.',
        task: 'Defend engineering integrity and data safety without alienating business stakeholders.',
        action: 'Quantified technical debt risk in dollars and customer downtime; proposed a scoped MVP launch with automated test gates.',
        result: 'Delivered core features on time with zero production incidents, earning stakeholder trust.',
      },
      rubricTips: 'Frame conflicts around shared company goals, data evidence, and collaborative compromises.',
    },
  ];

  const currentFlashcard = flashcards[activeCard];

  return (
    <div className="w-full bg-[#FAF9FD] text-[#0F172A] selection:bg-[#F25C2A]/20 selection:text-[#C2410C]">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO: LAVENDER TINT (#EFEEFF) WITH FLASHCARD DECK AS HERO
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-b from-[#EFEEFF] via-[#F4F3FF] to-[#FAF9FD] border-b border-[#E2E8F0]">
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#475569] mb-6 font-medium">
            <Link to="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/services" className="hover:text-[#0F172A] transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#C2410C] font-semibold">Technical Interview Preparation</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Narrative */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-200 text-indigo-900 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F25C2A]" />
                <span>One-on-One Technical Grilling & Mock Defense</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
                Cracking the Modern <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F25C2A]">
                  Engineering Interview.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Interviews are not memory tests; they are architectural defenses. Master live whiteboard problem decomposition, concurrency defense, and executive communication with veteran engineering hiring leaders.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onOpenConsultation}
                  className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold shadow-md shadow-[#C2410C]/20 px-6 py-3"
                >
                  Book 1-on-1 Mock Session <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>

            {/* Right Hero: Signature Component - Flashcard Deck with STAR Builder */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-indigo-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Question Flashcard Deck</span>
                    <span className="text-xs text-slate-600 font-mono">({activeCard + 1} of {flashcards.length})</span>
                  </div>
                  <div className="flex gap-1.5">
                    {flashcards.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveCard(i);
                          setIsFlipped(false);
                        }}
                        className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all ${
                          activeCard === i
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Card */}
                <div className="p-6 rounded-2xl bg-[#F8F7FF] border border-indigo-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-bold">
                      {currentFlashcard.type}
                    </span>
                    <button
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{isFlipped ? 'Show Question' : 'Flip to STAR Answer'}</span>
                    </button>
                  </div>

                  {!isFlipped ? (
                    <div className="space-y-3 py-4">
                      <div className="text-xs font-mono text-slate-600 uppercase tracking-wider">Interview Prompt</div>
                      <h3 className="font-heading font-bold text-lg text-[#0F172A] leading-snug">
                        "{currentFlashcard.question}"
                      </h3>
                      <div className="pt-2 text-xs text-indigo-900 font-semibold bg-white p-3 rounded-xl border border-indigo-100">
                        💡 Mentor Calibration Tip: {currentFlashcard.rubricTips}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs py-1">
                      <div className="font-bold text-indigo-900 text-xs uppercase tracking-wider">
                        STAR Answer Architecture:
                      </div>
                      <div className="space-y-1.5 text-slate-700 leading-relaxed">
                        <p><strong className="text-indigo-700 font-mono">S (Situation):</strong> {currentFlashcard.starAnswer.situation}</p>
                        <p><strong className="text-indigo-700 font-mono">T (Task):</strong> {currentFlashcard.starAnswer.task}</p>
                        <p><strong className="text-indigo-700 font-mono">A (Action):</strong> {currentFlashcard.starAnswer.action}</p>
                        <p><strong className="text-emerald-700 font-mono">R (Result):</strong> {currentFlashcard.starAnswer.result}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                  <span>Methodology: STAR Structuring + Whiteboard Defense</span>
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="text-xs font-bold text-[#C2410C] hover:underline"
                  >
                    {isFlipped ? 'Back to Prompt' : 'Reveal Model Defense →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. ROUND TABS IN-PAGE NAVIGATION
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-3">
        <div className="container-custom flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'flashcards', label: 'STAR Flashcards' },
            { id: 'one-on-one', label: '1-on-1 Interview Coaching' },
            { id: 'mock-simulation', label: 'Simulated Mock Rounds' },
            { id: 'rubric', label: 'Technical Defense Rubric' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                const el = document.getElementById(tab.id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ONE-ON-ONE INTERVIEW (OLD SITE GROUNDING)
          ───────────────────────────────────────────────────────────── */}
      <section id="one-on-one" className="py-16 scroll-mt-28">
        <div className="container-custom space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Dedicated Advisor</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              {oldSiteServices.oneOnOneInterview.title}
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              {oldSiteServices.oneOnOneInterview.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {oldSiteServices.oneOnOneInterview.highlights.map((h, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  0{i + 1}
                </div>
                <h4 className="font-heading font-bold text-sm text-[#0F172A]">{h}</h4>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Tailored to the specific culture and interview rubrics of your target company.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. MOCK INTERVIEW SIMULATIONS (OLD SITE GROUNDING)
          ───────────────────────────────────────────────────────────── */}
      <section id="mock-simulation" className="py-16 bg-white border-y border-slate-200 scroll-mt-28">
        <div className="container-custom space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">Realistic Practice</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              {oldSiteServices.mockInterview.title}
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              {oldSiteServices.mockInterview.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {oldSiteServices.mockInterview.highlights.map((h, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#FAF9FD] border border-indigo-100 shadow-xs space-y-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-heading font-bold text-sm text-[#0F172A]">{h}</h4>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Detailed video debriefs analyze your pacing, voice clarity, and code explanation structure.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. TECHNICAL RUBRIC CHECKLIST
          ───────────────────────────────────────────────────────────── */}
      <section id="rubric" className="py-16 scroll-mt-28">
        <div className="container-custom space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Evaluation Matrix</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0F172A]">
              Mock Interview Scoring Rubric
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { category: 'Problem Clarification', standard: 'Asks clarifying questions regarding boundary limits, expected latency, scale requirements, and edge cases before coding.' },
              { category: 'Architectural Defense', standard: 'Defends data structures, algorithmic complexity (Big-O), and distributed trade-offs with clear mathematical justification.' },
              { category: 'Code Syntax & Modularity', standard: 'Produces clean, compile-ready code with appropriate error handling and sensible variable naming conventions.' },
              { category: 'Executive Questioning', standard: 'Poses thoughtful, high-context inquiries about technical vision and engineering culture to the interviewer.' },
            ].map((r, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-sm text-[#0F172A]">{r.category}</h4>
                  <p className="text-xs text-[#475569] leading-relaxed">{r.standard}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. CLOSING CTA BANNER (Lavender Studio)
          ───────────────────────────────────────────────────────────── */}
      <div className="container-custom pb-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#EFEEFF] via-[#F4F3FF] to-white border border-indigo-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl sm:text-2xl font-heading font-extrabold text-[#0F172A]">
              Have an Upcoming Technical Interview Loop?
            </h4>
            <p className="text-xs sm:text-sm text-[#475569] max-w-lg">
              Simulate the exact interview rounds with our senior tech coaches before facing the company panel.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={onOpenConsultation}
            className="bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold px-7 py-3.5 shrink-0 shadow-md"
          >
            Schedule Mock Session <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
