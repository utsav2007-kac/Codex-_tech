import { describe, it, expect } from 'vitest';
import { siteConfig } from './config/site';

describe('Client Configuration & Constants Test', () => {
  it('siteConfig should have name and tagline', () => {
    expect(siteConfig.name).toBe('Codex Tech-IT');
    expect(siteConfig.tagline).toBe('We Deliver Jobs Faster');
  });

  it('siteConfig should define all 9 core services', () => {
    expect(siteConfig.services.length).toBe(9);
    const slugs = siteConfig.services.map((s) => s.slug);
    expect(slugs).toContain('job-placement');
    expect(slugs).toContain('recruitment-staffing');
    expect(slugs).toContain('talent-acquisition');
    expect(slugs).toContain('it-training');
    expect(slugs).toContain('background-verification');
    expect(slugs).toContain('payroll-taxes');
    expect(slugs).toContain('resume-linkedin-rebranding');
    expect(slugs).toContain('interview-preparation');
    expect(slugs).toContain('custom-job-campaigns');
  });

  it('siteConfig should define all 4 interactive tools', () => {
    expect(siteConfig.tools.length).toBe(4);
    const slugs = siteConfig.tools.map((t) => t.slug);
    expect(slugs).toContain('resume-analyzer');
    expect(slugs).toContain('linkedin-profile-analyzer');
    expect(slugs).toContain('job-match-score');
    expect(slugs).toContain('interview-readiness');
  });

  it('siteConfig should define both USA and India offices', () => {
    expect(siteConfig.offices.length).toBeGreaterThanOrEqual(2);
    expect(siteConfig.contact.phoneUSA).toBeDefined();
    expect(siteConfig.contact.phoneIndia).toBeDefined();
    expect(siteConfig.contact.email).toBeDefined();
  });
});
