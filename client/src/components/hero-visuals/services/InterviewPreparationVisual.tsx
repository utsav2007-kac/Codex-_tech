import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Video, Clock, CheckCircle2, Award, Zap, Star } from 'lucide-react';

export const InterviewPreparationVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/10 via-orange-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#1F6AA5]">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">FAANG Mock Interview Studio</div>
              <div className="text-[10px] text-slate-500">System Design & Live Coding Calibration</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Live Session · 42:18
          </div>
        </div>

        {/* Dialogue Flow */}
        <div className="space-y-3 mb-4">
          {/* Question Bubble */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Senior Staff Interviewer</span>
              <span className="text-[10px] text-slate-400">FAANG Alum</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              "How would you handle cache stampede in a high-concurrency distributed payment gateway?"
            </p>
          </div>

          {/* STAR Response Bubble */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold text-[#1F6AA5]">Candidate Response (STAR Model)</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                98% Structured
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-center mb-2">
              <span className="py-0.5 rounded bg-blue-100 text-blue-800">Situation</span>
              <span className="py-0.5 rounded bg-blue-100 text-blue-800">Task</span>
              <span className="py-0.5 rounded bg-orange-100 text-orange-800">Action</span>
              <span className="py-0.5 rounded bg-emerald-100 text-emerald-800">Result</span>
            </div>

            <p className="text-xs text-slate-700 font-sans leading-relaxed">
              Implemented probabilistic early expiration (XFetch algorithm) combined with Redis distributed locks, eliminating cache spikes under 50k req/sec load.
            </p>
          </div>
        </div>

        {/* Confidence & Rubric Bar */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <div className="text-xs font-heading font-bold text-[#0B1B2E]">Technical Readiness Score</div>
          </div>
          <div className="text-xs font-heading font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            9.4 / 10 · Strong Hire
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Behavioral + Architecture + LeetCode</span>
          </div>
          <span className="font-heading font-bold text-[#F15A34]">1:1 Feedback Rubric</span>
        </div>
      </div>
    </div>
  );
};
