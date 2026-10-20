# CODEX TECH-IT ITERATION LOG (LOG.md)

Append-only iteration ledger for tracking Universal Loops, defect diagnosis, fixes, and regression outcomes.

| Loop ID | Target Task / Slice | Iteration | Score (/50) | Top Defects Diagnosed | Remediation Applied | Outcome |
|---|---|---|---|---|---|---|
| L0-INIT | Agent protocol initialization | #1 | 50/50 | None | Created PLAN.md, TASKS.md, RUBRIC.md, LOG.md | PASS |
| L0-DB | Schema & seed execution | #1 | 50/50 | PowerShell file redirection syntax | Piped schema.sql through Get-Content into mysql.exe | PASS |
| L1-COMP | Shared primitives & motion E1-E20 | #1 | 49/50 | None | Built Buttons, Cards, Modals, Breadcrumbs, Motion catalog | PASS |
| L2-PAGES | Full sitemap implementation | #1 | 48/50 | Breadcrumbs and Marquee optional props | Aligned interfaces and fixed imports in resources pages | PASS |
| L3-INSIGHTS | Insights page array extraction | #1 | 49/50 | /api/posts returns { items, pagination } | Extracted list from res.data.data.items safely | PASS |
| L-CMS-STEP0 | Delete old hero right side scene & chips | #1 | 50/50 | Old scene elements: maroon sphere, torus rings, nodes, old chips, watermark | Deleted HeroScene.tsx, removed watermark from GradientMesh.tsx, removed chips from Home.tsx, deleted .vite, created empty CodexMonogramStage.tsx with data-hero-scene="codex-stage" | PASS |
| L-CMS-STAGE | Build Codex Monogram Stage & 3 Chips | #1 | 50/50 | None | Built 3D glass CX monogram (ExtrudeGeometry, MeshPhysicalMaterial with clearcoat), light wash, 3 hairline orbits, 3 info chips with hairline pulses, ACES tone mapping, studio lightformers | PASS |
| L-SPACE-STEP0 | Whitespace audit & PageHero for /services/job-placement | #1 | 50/50 | 4 baseline failures: 860px text wall, empty hero right col (512-1152px blank), stray quotes on tagline | Built PageHero component, PlacementPipelineVisual, VisualRegistry, whitespace-audit script; eliminated all hero failures | PASS |
| L-HERO-THROW-FIX | 3D Monogram cursor throw & upright stand | #1 | 50/50 | Throw velocity retained on pause, pitch unclamped, roll tilt at rest | Stalled pointer velocity zeroed out, pitch clamped [-0.55, 0.55], resting roll tilt eliminated, smooth exponential upright return lerp to (0,0) | PASS |
| L-SPACE-ALLPAGES | Universal companion visual & whitespace elimination | #1 | 50/50 | Blank space on right column of all public pages & subpages | Migrated all public pages to PageHero with 25+ distinct, non-repeated companion visuals from VisualRegistry | PASS |
| L-HERO-ONLYJOBS-UNCOVER | Monogram 3D animation, only-jobs cards & clean perimeter | #1 | 50/50 | Monogram covered by cards, cards showed interview/offer instead of only-jobs, animation looked static | Transformed all cards to ONLY TECH JOBS (Python Dev, DevOps Lead, AI/ML Eng), repositioned cards to perimeter so monogram is never covered, added independent floating/bobbing loops, enabled continuous 3D tourbillon sway (+/-28deg) with pulsing core spark | PASS |

