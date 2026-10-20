import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Layers, Server, Database, Cloud, ShieldCheck, Zap } from 'lucide-react';

const TECH_CATEGORIES = [
  {
    name: 'Cloud & Infrastructure',
    icon: Cloud,
    skills: ['AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker', 'Terraform'],
    demand: '+48% Requisition Volume',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    name: 'Backend & Microservices',
    icon: Server,
    skills: ['Java Spring Boot', 'Python FastApi', 'Golang', 'Node.js', 'Kafka'],
    demand: 'High Enterprise Hiring',
    color: 'text-orange-600 bg-orange-50 border-orange-200',
  },
  {
    name: 'Data Engineering & AI',
    icon: Database,
    skills: ['PySpark', 'Snowflake', 'Databricks', 'Airflow', 'PostgreSQL'],
    demand: '+62% Salary Upside',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
];

export const StackMapVisual: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="relative w-full max-w-[500px] select-none">
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/10 via-orange-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#1F6AA5]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-[#0B1B2E]">Enterprise Tech Stack Matrix</div>
              <div className="text-[10px] text-slate-500">Live Hiring Demand & Skill Mapping</div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-[#F15A34] text-[10px] font-bold">
            <Zap className="w-3 h-3 text-[#F15A34]" /> 35+ Active Frameworks
          </span>
        </div>

        {/* Categories Stack */}
        <div className="space-y-3 mb-4">
          {TECH_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const isActive = activeIdx === idx;
            return (
              <motion.div
                key={cat.name}
                onClick={() => setActiveIdx(idx)}
                whileHover={{ scale: 1.01 }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-50/90 border-slate-300 shadow-sm'
                    : 'bg-white border-slate-200/60 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${cat.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-heading font-bold text-[#0B1B2E]">{cat.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{cat.demand}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Calibrated with Fortune 500 Job Descriptions</span>
          </div>
          <span className="font-heading font-bold text-[#1F6AA5]">Production Vetted</span>
        </div>
      </div>
    </div>
  );
};
