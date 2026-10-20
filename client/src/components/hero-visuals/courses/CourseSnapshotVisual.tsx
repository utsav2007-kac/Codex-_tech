import React from 'react';
import { motion } from 'framer-motion';
import { Code, Terminal, Clock, Users, Award, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

interface CourseSnapshotVisualProps {
  courseTitle?: string;
  duration?: string;
  mode?: string;
  level?: string;
  tools?: string[];
}

export const CourseSnapshotVisual: React.FC<CourseSnapshotVisualProps> = ({
  courseTitle = 'Full Stack Engineering',
  duration = '8 Weeks',
  mode = 'Live Online + Labs',
  level = 'Intermediate to Advanced',
  tools = ['Java 17', 'Spring Boot', 'Kafka', 'Docker', 'AWS'],
}) => {
  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-orange-500/10 via-blue-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#F15A34]">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Curriculum & Capstone Lab</div>
              <div className="text-[10px] text-slate-500">{level}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Next Cohort: Next Monday
          </div>
        </div>

        {/* Live Terminal Snippet */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] mb-3.5 shadow-md">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400 font-sans">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-orange-400" />
              <span>production-deploy.sh</span>
            </span>
            <span className="text-emerald-400 font-mono">100% PASS</span>
          </div>

          <div className="space-y-1 text-[10px] leading-relaxed">
            <p className="text-slate-400">$ ./gradlew test --stacktrace</p>
            <p className="text-emerald-400">✓ Unit & Integration Tests: 42 passed</p>
            <p className="text-blue-400">✓ Building multi-stage Docker container image...</p>
            <p className="text-slate-300">✓ Deployed to Kubernetes AWS EKS namespace [prod]</p>
          </div>
        </div>

        {/* Tools and Frameworks Mastered */}
        <div className="mb-3.5">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">Technologies You Master</div>
          <div className="flex flex-wrap gap-1.5">
            {tools.slice(0, 5).map((tool) => (
              <span
                key={tool}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/80"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Highlights Triplet */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 mb-3.5 text-center">
          <div>
            <div className="text-[10px] text-slate-400">Duration</div>
            <div className="text-xs font-heading font-bold text-[#0B1B2E] mt-0.5">{duration}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Format</div>
            <div className="text-xs font-heading font-bold text-[#1F6AA5] mt-0.5">{mode.split(' ')[0]}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Placement</div>
            <div className="text-xs font-heading font-bold text-emerald-600 mt-0.5">100% Assisted</div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>1:1 Senior Engineer Mentorship</span>
          </div>
          <span className="font-heading font-bold text-[#F15A34]">Guaranteed Referrals</span>
        </div>
      </div>
    </div>
  );
};
