# CODEX TECH-IT MASTER ARCHITECTURE & EXECUTION PLAN

## 1. System Overview & Monorepo Structure
The system is built as an npm workspace monorepo adhering to strict TypeScript typing across all tiers.

```
/ (Workspace Root)
├── package.json               # Monorepo workspaces: ["client", "server", "shared", "e2e"]
├── .gitignore
├── docker-compose.yml         # MySQL 8 service container (optional convenience)
├── README.md                  # Complete local setup, XAMPP/Workbench instructions, deployment
├── agent/                     # Autonomous Loop Engineering control files
│   ├── PLAN.md                # System blueprints, data contracts, token specs
│   ├── TASKS.md               # Sitemapped single-source-of-truth task board
│   ├── RUBRIC.md              # 10-point scoring rubric (>= 45/50 exit condition)
│   └── LOG.md                 # Append-only loop iteration records
├── shared/                    # Isomorphic domain models & validation
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── types/             # Shared entities and response structures
│       └── schemas/           # Zod schemas for forms, filters, and admin payloads
├── server/                    # Node.js 20 + Express + TypeScript API
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma      # Provider: mysql, snake_case models, utf8mb4
│   │   └── migrations/
│   ├── db/
│   │   ├── schema.sql         # Plain MySQL SQL export for Workbench / phpMyAdmin / XAMPP
│   │   └── seed.ts            # Idempotent realistic sample seeder
│   └── src/
│       ├── config/            # Env variables, database client, logger, storage setup
│       ├── controllers/       # Endpoints for public feeds, forms, tools, and admin
│       ├── middleware/        # JWT auth, rate limits, error handler, file upload, honeypot
│       ├── routes/            # /api routing manifests
│       ├── services/          # Business logic, email logger/mailer, tool scoring engines
│       └── index.ts           # Express server bootstrap with SPA fallback
├── client/                    # React 18 + Vite + TypeScript Frontend
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── public/
│   │   ├── assets/logo.png    # Primary brand logo
│   │   ├── favicon.ico
│   │   └── robots.txt
│   └── src/
│       ├── config/site.ts     # Global site config, markets, contact metadata
│       ├── data/              # Static siteContent, copy, FAQ seed
│       ├── hooks/             # Custom motion, query, and responsive hooks
│       ├── layouts/           # RootLayout, AdminLayout, DevLayout
│       ├── components/        # UI primitives, Motion system (E1-E20), 3D canvas
│       ├── pages/             # All mapped views (Home, Services, Courses, etc.)
│       ├── services/api.ts    # Axios client with credentials and interceptors
│       ├── styles/index.css   # Tailored design system tokens & font declarations
│       └── App.tsx            # Routes configuration & AnimatePresence
└── e2e/                       # Playwright test suite
    ├── playwright.config.ts
    └── tests/
```

---

## 2. MySQL Database Schema (23 Tables, utf8mb4, InnoDB)
1. `admin_users` (id, email UNIQUE, password_hash, name, role, created_at)
2. `leads` (id, name, email, phone, country_code, current_role, experience_level, visa_status ENUM, service_interest, preferred_datetime, source, plan, message, consent, status ENUM, created_at)
3. `contacts` (id, name, email, phone, subject, message, status, created_at)
4. `employer_requests` (id, company, contact_person, email, phone, roles_needed, tech_stack, headcount, hiring_model, timeline, notes, status, created_at)
5. `job_openings` (id, slug UNIQUE, title, department, location, type, description LONGTEXT, requirements LONGTEXT, is_active, created_at)
6. `applications` (id, job_id FK, name, email, phone, linkedin_url, resume_path, resume_original_name, cover_note, status, created_at)
7. `referrals` (id, referrer_name, referrer_email, referrer_phone, referee_name, referee_email, referee_phone, role_skill, status, created_at)
8. `subscribers` (id, email UNIQUE, is_active, created_at)
9. `courses` (id, slug UNIQUE, title, summary, duration, mode, level, curriculum JSON, tools JSON, outcomes JSON, faqs JSON, is_active, created_at)
10. `enrollments` (id, course_id FK, name, email, phone, batch_pref, message, status, created_at)
11. `webinars` (id, slug UNIQUE, title, description, starts_at, host, join_url, is_past)
12. `webinar_registrations` (id, webinar_id FK, name, email, phone, created_at)
13. `posts` (id, slug UNIQUE, title, excerpt, content LONGTEXT, category, author_name, author_role, cover_alt, read_minutes, is_published, published_at, created_at)
14. `success_stories` (id, slug UNIQUE, name, role, company_type, location, situation LONGTEXT, approach LONGTEXT, results LONGTEXT, is_sample, is_published, created_at)
15. `live_placements` (id, role, company_type, location, package_range, summary, is_sample, is_published, created_at)
16. `faqs` (id, category, question, answer, sort_order, is_published)
17. `testimonials` (id, name, role, quote, is_sample, is_published)
18. `interview_questions` (id, role_track, level, question, answer, sort_order)
19. `downloads` (id, resource_key, name, email, created_at)
20. `tool_reports` (id, tool ENUM, name, email, score, report_json JSON, created_at)
21. `site_settings` (key PK, value JSON)
22. `email_logs` (id, to_email, subject, body, status, error, created_at)
23. `chat_faq` (id, keywords, answer)

---

## 3. API Contract Map (`/api/*`)
- **Public GET**:
  - `/posts`, `/posts/:slug`
  - `/jobs`, `/jobs/:slug`
  - `/courses`, `/courses/:slug`
  - `/stories`, `/stories/:slug`
  - `/live-placements`
  - `/faqs`
  - `/testimonials`
  - `/webinars`
  - `/interview-questions` (with role_track and level query filters)
  - `/settings/public`
  - `/chat/answer?q=`
  - `/health`
  - `/sitemap.xml`, `/robots.txt`
- **Public POST**:
  - `/leads` (Consultation)
  - `/contact`
  - `/employer-requests`
  - `/applications` (multipart upload)
  - `/referrals`
  - `/subscribe` (Newsletter)
  - `/enrollments`
  - `/webinar-registrations`
  - `/downloads`
  - `/tools/resume-analyzer` (multipart/paste)
  - `/tools/linkedin-analyzer`
  - `/tools/job-match`
  - `/tools/interview-readiness`
  - `/tools/email-report`
- **Admin Endpoints (JWT Guarded)**:
  - `POST /admin/login`, `POST /admin/logout`, `GET /admin/me`, `GET /admin/stats`
  - Full CRUD + status updates + CSV export for each submission model
  - Full CRUD for content tables (posts, jobs, courses, stories, live-placements, webinars, faqs, testimonials, interview-questions)
  - `GET /admin/settings`, `PUT /admin/settings`
  - `GET /admin/resume/:id` (authorized download stream)

---

## 4. Design System Tokens & Brand Visuals
- **Color Targets**:
  - `--orange-500`: `#F15A34` (Primary actions, key accents)
  - `--orange-600`: `#D94822` (Interactive hover states)
  - `--blue-600`: `#1F6AA5` (Trust indicators, active links)
  - `--blue-700`: `#17527F` (Deep info accents)
  - `--navy-900`: `#0B1B2E` (Primary dark background, bold typography)
  - `--navy-800`: `#12304D` (Elevated dark surfaces)
  - `--slate-600`: `#475569` (Body copy, high readability)
  - `--gray-50`: `#F5F7FA` (Alternating section backgrounds)
  - `--white`: `#FFFFFF`
- **Typography**:
  - Headings: `@fontsource/sora` (600, 700, 800)
  - Body & UI: `@fontsource/inter` (400, 500, 600)
  - Numbers: Sora tabular-nums
  - Fluid scales configured with clamp definitions
- **Motion Catalog (E1 to E20)**:
  - E1 Loader Curtain | E2 Prism Wipe | E3 Flip-Up Reveal | E4 Book-Open Cards
  - E5 Hero 3D R3F Scene | E6 Image Mask Reveal | E7 Line-Mask Text Reveal
  - E8 3D Coverflow Carousel | E9 Depth-Scroll Parallax | E10 Stat Cube Flip
  - E11 Tilt & Glare Card | E12 Pinned Horizontal Journey | E13 Footer Curtain
  - E14 Magnetic Buttons | E15 Custom Desktop Cursor | E16 SVG Line-Draw
  - E17 Gradient Mesh Background | E18 Hover-Pause Marquee
  - E19 Animated Accordion / Tabs | E20 Confetti & Micro-Check Animation

---

## 5. Execution Workflow Across Phases
- **Phase A (L0)**: Scaffold monorepo packages, configure TypeScript, initialize Prisma + MariaDB/MySQL connection, generate SQL export and seed data, bootstrap Express API with security and error handlers, configure Vite frontend with design system, layout, and motion primitives.
- **Phase B (L1)**: Build shared UI components and test them on `/dev/components` and `/dev/motion`.
- **Phase C (L2)**: Develop each sitemap page with full copy, fluid typography, responsive layout, and visual motion.
- **Phase D (L3)**: Wire end-to-end functionality for forms, 4 deterministic tools, dynamic search/filter/pagination, and admin management suite.
- **Phase E (L4)**: Global quality sweeps (link integrity, responsive check, accessibility, security probes, content verification).
- **Phase F (L5)**: Comprehensive Definition of Done regressions until passing twice consecutively.
