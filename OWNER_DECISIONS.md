# Codex Tech-IT: Owner Decisions & Truth Audit Log

This document records all discrepancies, claims, and legacy content items identified between the previous WordPress site (`https://www.codextech-it.com`) and the current modern web application (`client/src`).

In accordance with strict **Truth Rules**, no conflicting or unconfirmed claims are published. Content on live pages defaults to verified facts, active database records, or explicit illustrations with clear labels.

---

## 1. Discrepancy & Conflict Audit Table

| Item / Claim | Old Site Claim (`codextech-it.com`) | Current / Live Site State | Location in Code / Page | Action Taken & Rationale | Status / Owner Action Required |
|---|---|---|---|---|---|
| **Referral Reward Amount** | Up to $500 per candidate paid in two installments (on enrollment and placement) + lucky draws / gadgets | Tiers up to $1,500 ($500 Entry, $1,000 Mid, $1,500 Senior) defined in `SiteSetting` | `/refer-earn`, `server/db/seed.ts` | Kept live `SiteSetting` values dynamically fetched from `/api/settings/public`. No hardcoded $500 figures or gadget raffles shown. | **Needs Owner Confirmation:** Confirm official referral fee structure and payout milestones. |
| **Response Time SLA** | Career advisor responds "within 24 hours" | General response without rigid 24h guarantee | `/services/job-placement`, `/services/custom-job-campaigns` | Removed "24 hours" claim. Replaced with prompt advisor consultation to prevent unbacked SLA commitments. | **Needs Owner Confirmation:** Confirm if 24-hour turnaround is guaranteed across all inquiries. |
| **Placement Guarantee** | Phrases resembling job guarantee in legacy marketing | Strict no-guarantee policy; merit and market-driven | All 9 service pages | Banned all "guaranteed job" phrasing. Replaced with transparent skill development and candidate representation. | **Enforced:** No guarantee wording permitted. |
| **Corporate Addresses** | Legacy footer mentions single contact / generic address | Dual Global Talent Corridor: Plano, Texas (USA) & Hyderabad, Telangana (India) | Footer, `/about`, `/contact` | Preserved active dual-office addresses live on new site. Added timezone clocks and operational desk info. | **Live & Verified:** Retained current live office coordinates. |
| **Unbacked Performance Chips** | "180+ Active US Enterprise Requisitions Live", "+32% Avg. Base Salary Uplift", "100% Free for Job Seekers" | Displayed as static high-conviction badges | `JobPlacementPage.tsx`, `FeaturedOpenings` | Removed unbacked chips from live flow or replaced with dynamic/truthful labels. Salary tool labeled strictly as "Illustration". | **Needs Owner Confirmation:** Confirm verified enterprise requisition metrics and salary uplift telemetry. |
| **Placement Logo Wall** | 11 named corporate logos (e.g. Cisco, Deloitte, Morgan Stanley) shown on legacy home/about | Candidate cards with roles, package estimates, and tech stacks | Home & Services | Banned display of corporate logo wall without explicit written consent from employers. Replaced with role-based tech stacks and skill cohorts. | **Enforced:** No named enterprise logos without verified client consent. |
| **Legacy Testimonials (7 Candidates)** | 7 candidate testimonials (Raj Chauhan, Anjana Thomas, Ramandeep Kaur, Smit Patel, Shweta Singh, Sonia Rajput, Maharshi Bhardwaj) | Modern review cards with verified LinkedIn/Google attributions | `About.tsx`, `server/prisma/seed.ts` | Imported all 7 old testimonials into `Testimonial` table as **UNPUBLISHED drafts** (`is_published: false`, `consent_confirmed: false`) with initial avatars. None displayed publicly until approved in Admin. | **Action Required in Admin:** Review and toggle `is_published: true` after candidate consent confirmation. |
| **Custom Software Development & Outsourcing** | Offered custom software development and IT project outsourcing | Dedicated purely to Tech Recruitment, Staffing, and Training | Potential new service | Not added to navigation or services. Kept pure recruitment/training focus. | **Decision Required:** Decide whether Codex Tech-IT wishes to offer bespoke software engineering services alongside staffing. |
| **Legal / Compliance Disclaimer** | Implicit advice on payroll taxes and background clearance | Educational summary of onboarding procedures | `/services/payroll-taxes`, `/services/background-verification` | Added prominent statutory disclaimer: *"General information only; not formal legal or tax advice."* | **Enforced:** Compliance safety barrier in place. |

---

## 2. Summary of Governance Policies

1. **Testimonial Integrity:** Any testimonial displayed on the site must have verified candidate consent (`consent_confirmed: true`) and active publication flag (`is_published: true`).
2. **Reward Transparency:** All referral terms cite clear criteria (`"T&C apply"`, manual payout verification, minimum 60-day assignment tenure).
3. **Illustrative Visuals:** Any data visualization containing sample candidate trajectories or salary estimators is visibly badged as `Illustration` or `Sample Benchmark Data`.

