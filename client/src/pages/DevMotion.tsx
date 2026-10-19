import React from 'react';
import { SEO } from '../components/ui/SEO';
import { TiltCard } from '../components/motion/TiltCard';
import { SectionReveal } from '../components/motion/SectionReveal';
import { TextReveal } from '../components/motion/TextReveal';
import { Marquee } from '../components/motion/Marquee';
import { GradientMesh } from '../components/motion/GradientMesh';
import { Button } from '../components/ui/Button';

export const DevMotion: React.FC = () => {
  const effects = [
    { id: 'E1', name: 'Loader Curtain', desc: 'Session-cached SVG stroke draw and dual-slat door curtain slide.' },
    { id: 'E2', name: 'Prism Wipe', desc: 'Vertical slat 3D rotateY route transition orchestrator.' },
    { id: 'E3', name: 'Flip-Up Section Reveal', desc: 'Hardware-accelerated rotateX(18deg) + translateY scroll reveal.' },
    { id: 'E4', name: 'Book-Open Cards', desc: 'Alternating rotateY perspective swing from card edges.' },
    { id: 'E5', name: 'Hero 3D Scene', desc: 'Interactive Three.js / R3F glossy extruded monogram with orbiting nodes.' },
    { id: 'E6', name: 'Image Mask Reveal', desc: 'Dynamic clip-path inset expansion from 0 0 100% 0 to full aspect.' },
    { id: 'E7', name: 'Line-Mask Text Reveal', desc: 'Split typography sliding up smoothly through overflow hidden masks.' },
    { id: 'E8', name: '3D Coverflow Carousel', desc: 'Rotating 3D perspective arc for candidate testimonials with pause-on-hover.' },
    { id: 'E9', name: 'Depth-Scroll Layers', desc: 'Parallax translateZ multi-layer background bands.' },
    { id: 'E10', name: 'Stat Cube Flip', desc: 'Perspective 3D cube rotation revealing metrics and numerical count-ups.' },
    { id: 'E11', name: 'Tilt + Glare Cards', desc: 'Interactive mouse-tracked 3D card tilt with specular glare.' },
    { id: 'E12', name: 'Pinned Horizontal Journey', desc: 'ScrollTrigger pinned horizontal step sequence with active scale.' },
    { id: 'E13', name: 'Footer Curtain Reveal', desc: 'Sticky background footer revealed as page content scrolls upward.' },
    { id: 'E14', name: 'Magnetic Buttons + Ripple', desc: 'Spring-damped button pull with mouse-following radial ripples.' },
    { id: 'E15', name: 'Custom Cursor', desc: 'Smooth spring desktop cursor with magnetic snapping to actionable elements.' },
    { id: 'E16', name: 'SVG Line-Draw Timelines', desc: 'Path length stroke-dashoffset scroll-linked SVG progress rendering.' },
    { id: 'E17', name: 'Gradient-Mesh Backgrounds', desc: 'Continuous slow-drifting radial ambient color blends.' },
    { id: 'E18', name: 'Marquees', desc: 'Continuous smooth horizontal ticker with automatic pause on pointer hover.' },
    { id: 'E19', name: 'Accordion & Tab Motion', desc: 'Smooth height animations and sliding pill indicator transitions.' },
    { id: 'E20', name: 'Success Micro-Animation', desc: 'SVG checkmark draw sequence with particle celebration effects.' },
  ];

  return (
    <div className="section-padding bg-gray-50 min-h-screen">
      <SEO title="Motion & 3D System Demo (E1-E20) | Codex Tech-IT" />
      <div className="container-custom max-w-5xl space-y-12">
        <div>
          <div className="eyebrow">Creative Engineering Catalog</div>
          <h1 className="text-h2 text-navy-900 mb-2">Motion & 3D System (E1 - E20)</h1>
          <p className="text-sm text-slate-500">
            All 20 named kinetic animations built for CODEX TECH-IT with 60fps performance and reduced-motion fallback compliance.
          </p>
        </div>

        {/* Live Motion Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {effects.map((eff) => (
            <SectionReveal key={eff.id} className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 font-mono font-bold text-xs">
                    {eff.id}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Hardware Accelerated</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-navy-900 mb-2">{eff.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{eff.desc}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-semibold">Active in App</span>
                <span className="text-[11px] text-slate-400 font-mono">0.6s - 1.0s cubic-bezier</span>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Live Interactive Samples */}
        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-h3 text-navy-900">Interactive Previews</h2>

          <div className="space-y-6">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">E7 Text Reveal Demo</div>
              <TextReveal className="text-2xl font-heading font-bold text-navy-900">
                Smooth Line Mask Kinetic Typography
              </TextReveal>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">E18 Marquee Demo (Hover to pause)</div>
              <Marquee pauseOnHover={true} speed={25}>
                <span className="mx-6 text-sm font-bold text-navy-900">⚡ We Deliver Jobs Faster</span>
                <span className="mx-6 text-sm font-bold text-blue-600">🎯 Pre-Screened Talent</span>
                <span className="mx-6 text-sm font-bold text-orange-600">🚀 Direct Employer Access</span>
                <span className="mx-6 text-sm font-bold text-navy-900">🔒 100% Verified Placements</span>
              </Marquee>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">E14 Magnetic Buttons</div>
              <div className="flex gap-4">
                <Button variant="primary" size="md">Magnetic Action</Button>
                <Button variant="outline" size="md">Magnetic Secondary</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
