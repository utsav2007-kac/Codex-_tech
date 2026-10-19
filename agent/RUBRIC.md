# CODEX TECH-IT SCORING RUBRIC (0.3)

Each criterion is scored from 0 to 5.
**Exit Condition for Loop / Page**: Every criterion >= 4 and Total Score >= 45 / 50.

| # | Criterion | Weight / Max | Description & Acceptance Standards |
|---|---|---|---|
| 1 | **Visual Hierarchy** | 5 | Clear focal points, distinct scale contrasts, balanced composition, prominent CTAs, no competing elements. |
| 2 | **Typography** | 5 | Sora (600/700/800) for headings, Inter (400/500/600) for body, tabular-nums for stats. Fluid clamp scales, 1-2 words highlighted in H1/H2 with brand gradient or hand-drawn orange underline, max 65ch per paragraph, `text-wrap: balance / pretty`, no orphan words. |
| 3 | **Color & Contrast** | 5 | Brand palette: Orange-500 (#F15A34), Orange-600 (#D94822), Blue-600 (#1F6AA5), Blue-700 (#17527F), Navy-900 (#0B1B2E), Navy-800 (#12304D), Slate-600 (#475569), Gray-50 (#F5F7FA), White. 100% WCAG AA compliant contrast ratios on all text/background pairs. |
| 4 | **Spacing & Alignment** | 5 | Strict 8px grid system, consistent component margins and paddings, clamp(4rem, 8vw, 8rem) section spacing, container max 1280px, max 3 font sizes per card. |
| 5 | **Motion & 3D Quality** | 5 | High aesthetic quality with smooth 60fps animations (E1-E20). Cubic-bezier(0.22, 1, 0.36, 1), 0.6-1.0s, transform/opacity/clip-path only. Zero layout shift. Perfect reduced-motion fallback and WebGL fallbacks. Triggers properly cleaned up on unmount. |
| 6 | **Responsiveness** | 5 | Seamless presentation across all screen widths: 375px (mobile), 768px (tablet), 1280px / 1440px (desktop), 1920px (ultrawide). Zero horizontal overflow. Functional mobile navigation and sticky mobile CTA bar. |
| 7 | **Content Completeness & Quality** | 5 | High-converting, benefit-led, human-grade copywriting. Word counts: Service >= 600, Course >= 450, Industry >= 450, About >= 700, Blog >= 800, Case study >= 400. 24+ comprehensive FAQs. 0 lorem ipsum, 0 stray TODOs. |
| 8 | **Functionality (UI + API + DB)** | 5 | End-to-end operational functionality. Forms submit through shared zod validation to Express API, write to MySQL tables, and log emails. All tools compute deterministic, explainable results. Search, filter, pagination sync to URL. Admin CRUD & JWT authentication work. |
| 9 | **Accessibility** | 5 | Axe audit reports 0 critical and 0 serious violations. Full keyboard navigation with visible focus rings. Descriptive ARIA labels, semantic HTML5, skip-to-content links, alt attributes on all media. |
| 10 | **Performance** | 5 | Core Web Vitals optimized: LCP < 2.5s, CLS < 0.1, INP responsive. Lazy loaded 3D scenes, optimized image loading with explicit dimensions, route code splitting. Lighthouse mobile target >= 90. |

---

### Scoring Guide
- **5 (Exemplary)**: Meets all strict guidelines, exceeds visual polish, flawless performance, passes all automated and manual verifications.
- **4 (Passing)**: Robust, fully functional, compliant with design tokens and responsive constraints, 0 critical/serious defects.
- **3 (Substandard)**: Minor layout, copy, or accessibility defects; requires immediate diagnose & fix iteration.
- **1-2 (Failing)**: Broken links, missing database integration, unhandled error states, severe style breakage.
