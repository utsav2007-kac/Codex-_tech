import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function createAssets() {
  const authorsDir = path.resolve('client/public/assets/authors');
  const blogDir = path.resolve('client/public/assets/blog');
  if (!fs.existsSync(authorsDir)) fs.mkdirSync(authorsDir, { recursive: true });
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

  // 1. Author Avatars (300x300 WebP)
  const authors = [
    { name: 'Sarah Jenkins', initials: 'SJ', bg: '#0F172A', accent: '#F25C2A', file: 'avatar-1.webp' },
    { name: 'David Chen', initials: 'DC', bg: '#064E3B', accent: '#10B981', file: 'avatar-2.webp' },
    { name: 'Elena Rostova', initials: 'ER', bg: '#1E1B4B', accent: '#8B5CF6', file: 'avatar-3.webp' },
    { name: 'Marcus Vance', initials: 'MV', bg: '#451A03', accent: '#F59E0B', file: 'avatar-4.webp' }
  ];

  for (const a of authors) {
    const svg = `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${a.initials}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${a.bg}"/>
          <stop offset="100%" stop-color="#0A0F1D"/>
        </linearGradient>
      </defs>
      <circle cx="150" cy="150" r="148" fill="url(#grad-${a.initials})" stroke="${a.accent}" stroke-width="4"/>
      <circle cx="150" cy="115" r="52" fill="#FFFFFF" fill-opacity="0.12" stroke="${a.accent}" stroke-width="3"/>
      <path d="M 70 240 C 70 180, 230 180, 230 240 Z" fill="#FFFFFF" fill-opacity="0.1" stroke="${a.accent}" stroke-width="3"/>
      <text x="150" y="130" font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">${a.initials}</text>
    </svg>`;
    await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(path.join(authorsDir, a.file));
    console.log('Created avatar:', a.file);
  }

  // 2. 12 Visually Distinct 16:9 Cover Images (1280x720) with NO full title text
  const covers = [
    { id: 1, topic: 'ATS ALGORITHM AUDIT', bg1: '#0B1329', bg2: '#1C1938', accent: '#F25C2A' },
    { id: 2, topic: 'DISTRIBUTED ARCHITECTURE', bg1: '#07162C', bg2: '#0F2B48', accent: '#06B6D4' },
    { id: 3, topic: 'EMPLOYMENT CONTRACT MODELS', bg1: '#1A1836', bg2: '#281B4B', accent: '#F59E0B' },
    { id: 4, topic: 'EXECUTIVE BEHAVIORAL FRAMEWORK', bg1: '#1E101E', bg2: '#3B122D', accent: '#F43F5E' },
    { id: 5, topic: 'FULL-STACK COMPETENCY RADAR', bg1: '#06241C', bg2: '#0B3B2E', accent: '#10B981' },
    { id: 6, topic: 'GLOBAL MOBILITY &amp; IMMIGRATION', bg1: '#081D38', bg2: '#133563', accent: '#3B82F6' },
    { id: 7, topic: 'DEVOPS COMPENSATION DATA', bg1: '#0A2024', bg2: '#0F383E', accent: '#14B8A6' },
    { id: 8, topic: 'LINKEDIN SOURCING ALGORITHMS', bg1: '#1E0E38', bg2: '#381666', accent: '#A855F7' },
    { id: 9, topic: 'CAREER REBOUND PROTOCOL', bg1: '#1F1410', bg2: '#3D2012', accent: '#FB923C' },
    { id: 10, topic: 'KUBERNETES PRODUCTION TOPOLOGY', bg1: '#08182B', bg2: '#112C4A', accent: '#38BDF8' },
    { id: 11, topic: 'EXECUTIVE EQUITY &amp; LEVERAGE', bg1: '#261F0D', bg2: '#3D3114', accent: '#EAB308' },
    { id: 12, topic: 'STAFFING VELOCITY COMPARISON', bg1: '#121927', bg2: '#24253B', accent: '#FF6B4A' }
  ];

  for (const c of covers) {
    const svg = `<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-${c.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c.bg1}"/>
          <stop offset="100%" stop-color="${c.bg2}"/>
        </linearGradient>
        <radialGradient id="glow-${c.id}" cx="75%" cy="50%" r="45%">
          <stop offset="0%" stop-color="${c.accent}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${c.accent}" stop-opacity="0"/>
        </radialGradient>
        <pattern id="grid-${c.id}" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" stroke-opacity="0.04" stroke-width="1"/>
        </pattern>
      </defs>

      <rect width="1280" height="720" fill="url(#bg-${c.id})"/>
      <rect width="1280" height="720" fill="url(#grid-${c.id})"/>
      <rect width="1280" height="720" fill="url(#glow-${c.id})"/>

      <g transform="translate(780, 160)">
        <circle cx="200" cy="200" r="180" fill="none" stroke="${c.accent}" stroke-opacity="0.2" stroke-width="2" stroke-dasharray="6 8"/>
        <circle cx="200" cy="200" r="130" fill="none" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1.5"/>
        <circle cx="200" cy="200" r="75" fill="${c.accent}" fill-opacity="0.15" stroke="${c.accent}" stroke-width="2.5"/>
        <line x1="20" y1="200" x2="380" y2="200" stroke="${c.accent}" stroke-opacity="0.25" stroke-width="1.5"/>
        <line x1="200" y1="20" x2="200" y2="380" stroke="${c.accent}" stroke-opacity="0.25" stroke-width="1.5"/>
        <circle cx="70" cy="200" r="8" fill="${c.accent}"/>
        <circle cx="330" cy="200" r="8" fill="${c.accent}"/>
        <circle cx="200" cy="70" r="8" fill="${c.accent}"/>
        <circle cx="200" cy="330" r="8" fill="${c.accent}"/>
        <circle cx="290" cy="110" r="12" fill="#FFFFFF" fill-opacity="0.8"/>
        <circle cx="110" cy="290" r="10" fill="${c.accent}" fill-opacity="0.6"/>
      </g>

      <g transform="translate(100, 180)">
        <rect x="0" y="0" width="300" height="38" rx="19" fill="${c.accent}" fill-opacity="0.15" stroke="${c.accent}" stroke-width="1.5"/>
        <circle cx="20" cy="19" r="5" fill="${c.accent}"/>
        <text x="34" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" fill="${c.accent}" letter-spacing="1.5">${c.topic}</text>
        <text x="0" y="110" font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="900" fill="#FFFFFF" fill-opacity="0.9" letter-spacing="-1">ENGINEERING REPORT #${String(c.id).padStart(2, '0')}</text>
        <text x="0" y="150" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#94A3B8" letter-spacing="0.5">CODEX TECH-IT RESEARCH &#8226; TECHNICAL CAREER INTELLIGENCE</text>
        <rect x="0" y="185" width="120" height="4" rx="2" fill="${c.accent}"/>
      </g>
    </svg>`;

    const fileName = `blog-${c.id}.webp`;
    await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(path.join(blogDir, fileName));
    console.log('Created cover:', fileName);
  }
}

createAssets().catch(console.error);
