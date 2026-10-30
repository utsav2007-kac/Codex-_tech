import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  Code2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Play,
  Layers,
  ChevronDown,
  Award,
  BookOpen,
  Laptop,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../../ui/Button';

interface ServiceDataProps {
  service: {
    slug: string;
    title: string;
    tagline: string;
    overview: string;
    whoItsFor: string[];
    whatsIncluded: string[];
    process: { step: string; title: string; desc: string }[];
    benefits: { title: string; desc: string }[];
    miniCaseStudy: { title: string; role: string; challenge: string; solution: string; result: string };
    faqs: { q: string; a: string }[];
  };
  onOpenConsultation: () => void;
}

export const TechnicalMasteryTemplate: React.FC<ServiceDataProps> = ({ service, onOpenConsultation }) => {
  const [selectedTrack, setSelectedTrack] = useState<number>(0);
  const [simulatedRound, setSimulatedRound] = useState<'system' | 'star' | 'live'>('system');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const defenseRounds = {
    system: {
      title: 'Distributed System Design Defense',
      prompt: 'Design a real-time event streaming pipeline processing 100k events/sec with strict idempotency and sub-100ms end-to-end latency.',
      solution: 'Kafka partition keying by tenantId + Redis sliding window deduplication + Dead Letter Queue with exponential backoff retry worker.',
      verdict: 'Pass · Calibrated for Staff/Lead Architecture Rounds',
      score: '96% Readiness',
    },
    star: {
      title: 'STAR Behavioral Conflict & Tradeoff',
      prompt: 'Describe a production outage where two senior stakeholders disagreed on whether to rollback or deploy a hotfix.',
      solution: 'Isolated blast radius using feature flags, maintained status page transparency, conducted blameless post-mortem yielding 0 repeat incidents.',
      verdict: 'Pass · Executive Communication Index High',
      score: '94% Readiness',
    },
    live: {
      title: 'Live Concurrency & Data Structures',
      prompt: 'Implement a thread-safe LRU Cache with O(1) get/put operations and TTL expiration in Go or Python.',
      solution: 'Doubly-linked list + Hash map protected by sync.RWMutex with background goroutine sweep on ticker.',
      verdict: 'Pass · FAANG / Enterprise FinTech Bar Cleared',
      score: '98% Readiness',
    },
  };

  const activeDefense = defenseRounds[simulatedRound];

  return (
    <div className="w-full bg-[#FFFFFF] text-[#0F172A] overflow-hidden">
      {/* ── 1. HIGH-TECH DARK IDE / TERMINAL HERO (INDIGO & AMBER ACCENTS) ── */}
      <section className="relative pt-12 pb-20 bg-[#0B0F19] text-white border-b border-slate-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Headline & Mastery Positioning */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Technical Mastery & Engineering Rigor · Template C</span>
              </div>

              <h1 className="text-h1 font-heading font-extrabold text-white tracking-tight leading-tight mb-5">
                {service.title}
              </h1>

              <p className="text-lg text-indigo-400 font-semibold mb-4 leading-snug">
                {service.tagline}
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-xl font-normal">
                {service.overview}
              </p>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onOpenConsultation}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg"
                >
                  Join Next Technical Cohort <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <Link
                  to="/tools/interview-readiness"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-sm font-semibold text-white transition-colors"
                >
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>Interview Readiness Diagnostic</span>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 font-mono">
                <span>• Live Hands-on Labs</span>
                <span>• Production Code Reviews</span>
                <span>• 1-on-1 Mock Grilling</span>
              </div>
            </div>

            {/* Right: Live Interactive Code / Defense Terminal Simulator */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-[#030712] border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
                {/* Terminal Window Header */}
                <div className="bg-[#111827] px-4 py-3 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="text-[11px] text-slate-400 ml-2">defense_simulator.sh</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {(['system', 'star', 'live'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSimulatedRound(r)}
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors ${
                          simulatedRound === r
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terminal Content Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <span className="text-slate-500">// Technical Scenario:</span>
                    <p className="text-slate-200 mt-1 font-medium">{activeDefense.prompt}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800/80">
                    <span className="text-indigo-400 block mb-1">$ candidate.defend_solution()</span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{activeDefense.solution}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="text-[11px] font-bold">{activeDefense.verdict}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                      {activeDefense.score}
                    </span>
                  </div>
                </div>

                <div className="bg-[#090D16] px-4 py-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Interactive Live Technical Assessment</span>
                  <button
                    type="button"
                    onClick={onOpenConsultation}
                    className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Request Live Defense Coaching →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. MODULAR LAB ROADMAP & SPRINT WEEKS ── */}
      <section className="py-16 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-700 mb-2 block">
              CURRICULUM LAB ARCHITECTURE
            </span>
            <h2 className="text-3xl font-heading font-bold text-[#0F172A]">
              Comprehensive Engineering Sprint Roadmap
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Structured modules designed to bridge the gap between academic theory and enterprise cloud architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                week: 'Sprint 01',
                title: 'Architecture & Foundations',
                desc: 'Clean architecture, SOLID patterns, Git branching workflows, and containerized microservices.',
                tag: 'Phase 1',
              },
              {
                week: 'Sprint 02',
                title: 'Cloud Infrastructure & IaC',
                desc: 'Terraform state management, AWS VPC peering, IAM zero-trust policies, and Docker/K8s clusters.',
                tag: 'Phase 2',
              },
              {
                week: 'Sprint 03',
                title: 'Data & Event Streams',
                desc: 'Kafka topics, partition rebalancing, Snowflake ETL pipelines with dbt, and Redis caching layers.',
                tag: 'Phase 3',
              },
              {
                week: 'Sprint 04',
                title: 'Live Defense & Negotiation',
                desc: 'Staff-level mock interview defense, live whiteboard grilling, and direct client representation.',
                tag: 'Phase 4',
              },
            ].map((sprint, idx) => (
              <div
                key={sprint.week}
                className="p-6 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                      {sprint.week}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{sprint.tag}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-[#0F172A] mb-2 leading-snug">
                    {sprint.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {sprint.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Week {idx * 2 + 1} - {idx * 2 + 2}</span>
                  <span className="text-emerald-700 font-bold">100% Practical</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. WHO IT'S FOR & WHAT'S INCLUDED ── */}
      <section className="py-16 sm:py-24 bg-[#FFFFFF]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Who It's For */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl text-[#0F172A] mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span>Target Candidate Profiles</span>
                </h3>
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                  {service.whoItsFor.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Scope Deliverables */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl text-[#0F172A] mb-4 flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-[#C2410C]" />
                  <span>Curriculum & Hands-on Deliverables</span>
                </h3>
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                  {service.whatsIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#C2410C] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CASE STUDY & FAQ ACCORDION ── */}
      <section className="py-16 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Case Study */}
            <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-indigo-950 text-white border border-indigo-800 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 block mb-2">
                  TECHNICAL TRANSFORMATION
                </span>
                <h4 className="font-heading font-bold text-lg text-white mb-1">
                  {service.miniCaseStudy.title}
                </h4>
                <span className="text-xs text-indigo-300 font-semibold block mb-4">
                  {service.miniCaseStudy.role}
                </span>

                <div className="space-y-3 text-xs text-slate-300 leading-relaxed mb-6">
                  <p>
                    <strong className="text-white">Challenge:</strong> {service.miniCaseStudy.challenge}
                  </p>
                  <p>
                    <strong className="text-white">Solution:</strong> {service.miniCaseStudy.solution}
                  </p>
                  <div className="p-3 rounded-xl bg-indigo-900/60 border border-indigo-700 text-white font-medium">
                    <strong className="text-indigo-300">Result:</strong> {service.miniCaseStudy.result}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenConsultation}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Discuss Technical Readiness
              </button>
            </div>

            {/* FAQs */}
            <div className="lg:col-span-7">
              <div className="mb-6">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1 block">
                  TECHNICAL FAQ
                </span>
                <h3 className="text-2xl font-heading font-bold text-[#0F172A]">
                  Frequently Asked Questions
                </h3>
              </div>

              <div className="space-y-3">
                {service.faqs.map((f, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-heading font-bold text-sm text-[#0F172A] pr-4">
                        {f.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          expandedFaq === idx ? 'rotate-180 text-indigo-600' : ''
                        }`}
                      />
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {f.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

