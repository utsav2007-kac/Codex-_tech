import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SEO } from '../components/ui/SEO';
import { TiltCard } from '../components/motion/TiltCard';

export const DevComponents: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="section-padding bg-gray-50 min-h-screen">
      <SEO title="Dev Components Playground | Codex Tech-IT" />
      <div className="container-custom max-w-5xl space-y-12">
        <div>
          <h1 className="text-h2 text-navy-900 mb-2">Dev Components Library</h1>
          <p className="text-sm text-slate-500">Design token validation and interactive component playground.</p>
        </div>

        {/* Buttons */}
        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-h3 text-navy-900">1. Buttons & Variants</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" size="sm">Primary Sm</Button>
            <Button variant="primary" size="md">Primary Md</Button>
            <Button variant="primary" size="lg">Primary Lg</Button>
            <Button variant="secondary" size="md">Secondary</Button>
            <Button variant="outline" size="md">Outline</Button>
            <Button variant="ghost" size="md">Ghost</Button>
          </div>
        </div>

        {/* Tilt Cards */}
        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-h3 text-navy-900">2. 3D Tilt Cards (E11)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TiltCard className="p-6 rounded-2xl bg-white border border-gray-200">
              <h3 className="font-heading font-bold text-navy-900 mb-2">Interactive Tilt 1</h3>
              <p className="text-xs text-slate-500">Hover over this card to observe the 3D perspective tilt and light glare.</p>
            </TiltCard>
            <TiltCard className="p-6 rounded-2xl bg-white border border-gray-200">
              <h3 className="font-heading font-bold text-navy-900 mb-2">Interactive Tilt 2</h3>
              <p className="text-xs text-slate-500">Fluid hardware-accelerated transforms with touch detection safeguards.</p>
            </TiltCard>
            <TiltCard className="p-6 rounded-2xl bg-white border border-gray-200">
              <h3 className="font-heading font-bold text-navy-900 mb-2">Interactive Tilt 3</h3>
              <p className="text-xs text-slate-500">Maintains accessibility and gracefully flattens on mobile viewports.</p>
            </TiltCard>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-h3 text-navy-900">3. Breadcrumb Navigation</h2>
          <Breadcrumbs
            items={[
              { label: 'Parent Hub', href: '/services' },
              { label: 'Sub-Category', href: '/services/job-placement' },
              { label: 'Current Active Page' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
