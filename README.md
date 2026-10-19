# CODEX TECH-IT — "We Deliver Jobs Faster"
### Complete Enterprise Technical Staffing, Placement & IT Training Platform

A high-performance, animated multi-page web platform and recruitment operations system built with **React 18 (Vite + TypeScript)**, **Tailwind CSS**, **GSAP & Framer Motion**, **Three.js (@react-three/fiber)**, **Node.js 20 (Express + TypeScript)**, and **MySQL 8 (Prisma + Raw SQL Export)**.

---

## 1. System Architecture & Tech Stack

- **Monorepo**: npm workspaces (`shared`, `server`, `client`, `e2e`)
- **Frontend (`/client`)**:
  - React 18 + TypeScript + Vite 5
  - Tailwind CSS with fluid clamp typography (Sora for headings, Inter for UI/body)
  - Motion suite: Framer Motion, GSAP ScrollTrigger, Lenis smooth scrolling
  - 3D hero scene: Three.js / @react-three/fiber with graceful CSS/SVG fallback
  - React Hook Form + Zod validation with `@codex/shared` schemas
  - React Helmet Async for per-page SEO, OpenGraph tags, and JSON-LD schema
- **Backend (`/server`)**:
  - Node.js 20 + Express + TypeScript
  - MySQL 8 / MariaDB (utf8mb4, InnoDB) via Prisma ORM + plain SQL export (`/server/db/schema.sql`)
  - JWT auth in httpOnly, SameSite cookies with bcrypt hashing
  - Multer upload storage abstraction with MIME, extension, and magic-byte checks
  - Deterministic ATS resume analyzer, LinkedIn auditor, job matching, and readiness engines
  - Nodemailer email notifications with fallback audit logging to `email_logs` table
  - Centralized error handler and rate limiting on all public forms and auth routes
- **Shared Package (`/shared`)**:
  - Isomorphic Zod validation schemas and TypeScript types shared by client and server

---

## 2. Quickstart & Local Setup

### Prerequisites
- Node.js 20+ installed
- MySQL 8.0+ or XAMPP (MariaDB 10.4+) running on port `3306`

### Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   - Copy `.env.example` in `/server` to `.env`:
     ```bash
     cp server/.env.example server/.env
     ```
   - Ensure `DATABASE_URL` matches your local MySQL credentials:
     ```env
     DATABASE_URL="mysql://root:@localhost:3306/codex_tech_it"
     PORT=5000
     JWT_SECRET="codex_super_secret_jwt_key_2026_change_in_production"
     ```

3. **Initialize Database & Seed Data:**
   You have two convenient methods:

   * **Option A: Using the CLI Seed Script (Recommended)**
     ```powershell
     $env:PATH = "C:\Windows\System32;$env:PATH"
     npm run db:seed
     ```

   * **Option B: MySQL Workbench / phpMyAdmin / XAMPP**
     Open `server/db/schema.sql` in MySQL Workbench or phpMyAdmin and execute it against database `codex_tech_it`.

4. **Start the Development Environment:**
   Run both the Express API and Vite frontend simultaneously:
   ```powershell
   $env:PATH = "C:\Windows\System32;$env:PATH"
   npm run dev
   ```

---

## 3. Live Service Endpoints

| Service | Local URL | Description |
| :--- | :--- | :--- |
| **Frontend Website** | `http://localhost:5173` | Public client application |
| **Backend API Health** | `http://localhost:5000/api/health` | System and MySQL database health check |
| **Admin Portal** | `http://localhost:5173/admin/login` | Backoffice dashboard for inquiries and content |
| **Dynamic Sitemap** | `http://localhost:5000/sitemap.xml` | Generated dynamically from MySQL records |
| **Robots.txt** | `http://localhost:5000/robots.txt` | Crawler directives |

### Default Admin Credentials (Seed)
- **Login URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@codextechit.com`
- **Password**: `CodexAdmin2026!`

---

## 4. Complete Sitemap Overview

### Core Pages
- `/` — Homepage (21 distinct sections, 3D Hero E5, Journey E12, Comparison table, Readiness widget, Live placement feed, Plans)
- `/about` — Company history, mission, vision, 6 core values, leadership team, milestones
- `/services` — Services hub with 9 comprehensive sub-pages:
  - `/services/job-placement`
  - `/services/recruitment-staffing`
  - `/services/talent-acquisition`
  - `/services/it-training`
  - `/services/background-verification`
  - `/services/payroll-taxes`
  - `/services/resume-linkedin-rebranding`
  - `/services/interview-preparation`
  - `/services/custom-job-campaigns`
- `/services/it-training/:course` — 10 course tracks (Java, Python, Data Science & AI, Data Engineering, AWS/Azure Cloud, DevOps, QA Automation, Cybersecurity, Salesforce, SAP)
- `/industries` — 7 industry verticals (Banking/Finance, Healthcare, Insurance, Retail/E-Commerce, Telecom, Manufacturing, Public Sector)
- `/technologies` — Tech stack matrix and roles filled
- `/how-it-works` — Dual tabs for Job Seekers and Employers with animated timeline
- `/employers` — Hiring models, SLAs, and Request Talent form
- `/plans` — 3 tier plans, feature comparison matrix, and consultation booking
- `/success-stories` & `/success-stories/:slug` — Real candidate placement case studies with Situation, Approach, and Results
- `/live-placements` — Real-time filterable board of recent placements from MySQL
- `/careers` & `/careers/:slug` — Open internal positions with resume upload application form
- `/refer-earn` — 3-step referral program with tiered bonus payouts
- `/resources` — Resource toolkit:
  - `/resources/salary-guide` — Email-gated 2026 salary guide with real PDF download
  - `/resources/resume-templates` — Email-gated ATS resume template kit
  - `/resources/interview-question-bank` — 200+ questions searchable by role & seniority level
  - `/resources/webinars` — Upcoming & past live webinars with registration modal
- `/insights` & `/insights/:slug` — 8 technical guides with auto Table of Contents and reading progress bar
- `/faq` — 24+ categorized Q&As with search and accordion
- `/contact` — Global office addresses (Dallas & Hyderabad), direct phone lines, map, and inquiry form
- Legal Pages:
  - `/privacy-policy`
  - `/terms-and-conditions`
  - `/cookie-policy`
  - `/refund-policy`
  - `/accessibility-statement`
- `/thank-you` — Celebration confirmation page with E20 micro-animation
- `/dev/components` & `/dev/motion` — Component sandbox and E1-E20 motion catalog

---

## 5. Four Deterministic Diagnostic Tools

All 4 tools run deterministically on the backend without requiring third-party paid APIs:
1. **ATS Resume Analyzer** (`/tools/resume-analyzer`): Parses text or uploaded PDF/DOCX files, scoring out of 100 on contact fields, section titles, action verbs, quantified accomplishments, and keyword coverage.
2. **LinkedIn Profile Analyzer** (`/tools/linkedin-profile-analyzer`): Evaluates headline impact, About length, CTA inclusion, and skill keyword distribution.
3. **Job Match Score** (`/tools/job-match-score`): Extracts skills from a resume and compares against target job descriptions, outputting match percentage and missing technical skills.
4. **Interview Readiness Quiz** (`/tools/interview-readiness`): Multi-step assessment calculating technical confidence and generating a customized 14-day study roadmap.

---

## 6. Testing & Quality Assurance

- **Link Integrity Audit**:
  ```bash
  npm run check:links
  ```
  Asserts 0 broken internal links, 0 `#` placeholders, and 0 empty hrefs.

- **API Integration Tests (Vitest + Supertest)**:
  ```bash
  npm run test --workspace=server
  ```
  Validates public GET feeds, form submissions, rate limits, honeypot rejections, tool calculations, and admin authentication.

- **Production Build Validation**:
  ```bash
  npm run build
  ```
  Compiles shared types, server TypeScript, and client Vite bundle with 0 errors.

---

## 7. Customization & Site Configuration

To customize contact numbers, office addresses, branding taglines, and social links:
Edit `client/src/config/site.ts`. All contact metadata is centralized there for single-file maintenance.

---

## 8. License

Proprietary — CODEX TECH-IT. All rights reserved.
