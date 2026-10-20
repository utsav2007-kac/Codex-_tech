import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Play, CheckCircle2, Award, Sparkles, BookOpen } from 'lucide-react';

const TRACK_CODE: Record<string, { code: string; test: string; output: string }> = {
  java: {
    code: `@RestController
@RequestMapping("/api/v1/placements")
public class CareerController {
  @PostMapping("/match")
  public ResponseEntity<Offer> evaluateCandidate(
    @RequestBody CandidateProfile profile
  ) {
    return ResponseEntity.ok(pipeline.directMatch(profile));
  }
}`,
    test: 'Tests: 14 passed, 0 failed',
    output: '✓ Spring Boot 3.2 Microservice online :8080',
  },
  python: {
    code: `import pandas as pd
from sklearn.pipeline import Pipeline

def build_ats_classifier():
    model = Pipeline([
        ('vectorizer', TfidfVectorizer(ngram_range=(1,2))),
        ('classifier', GradientBoostingClassifier())
    ])
    return model.fit(X_train, y_train)`,
    test: 'ROC-AUC: 0.982 · Model Deployed',
    output: '✓ Inference latency: 12ms · Batch ready',
  },
  cloud: {
    code: `resource "aws_eks_cluster" "codex_core" {
  name     = "codex-production-cluster"
  role_arn = aws_iam_role.cluster.arn

  vpc_config {
    subnet_ids = module.vpc.private_subnets
    endpoint_private_access = true
  }
}`,
    test: 'Terraform Plan: 12 to add, 0 to destroy',
    output: '✓ Kubernetes 1.29 cluster provisioned',
  },
};

export const ItTrainingVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'java' | 'python' | 'cloud'>('java');

  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-orange-500/10 via-blue-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Card (Terminal IDE Style) */}
      <div className="relative rounded-2xl bg-[#0B1B2E] text-slate-200 border border-slate-700/80 shadow-[0_20px_50px_rgba(11,27,46,0.35)] p-5 overflow-hidden font-mono">
        {/* IDE Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-3 font-sans">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
            </div>
            <span className="text-xs font-semibold text-slate-300 ml-2">Codex Cloud Lab IDE</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Cohort Active
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 border-b border-slate-800 pb-2 mb-3 font-sans text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('java')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'java'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Java Microservices
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('python')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'python'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Python & AI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cloud')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'cloud'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cloud & DevOps
          </button>
        </div>

        {/* Code Content */}
        <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80 mb-3 text-[11px] leading-relaxed overflow-x-auto text-slate-300 font-mono">
          <pre>{TRACK_CODE[activeTab].code}</pre>
        </div>

        {/* Terminal Test Result */}
        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-between text-[11px] font-sans mb-3.5">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{TRACK_CODE[activeTab].output}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{TRACK_CODE[activeTab].test}</span>
        </div>

        {/* Cohort Milestone Footer */}
        <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between font-sans text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <BookOpen className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px]">8 Weeks · 1:1 Senior Engineering Mentorship</span>
          </div>
          <span className="text-[11px] font-bold text-orange-400 font-heading">100% Job Ready</span>
        </div>
      </div>
    </div>
  );
};
