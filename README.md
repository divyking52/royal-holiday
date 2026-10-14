# Royal Holiday — Vacation-Club Membership Landing Experience

Production-oriented Next.js website for **Royal Holiday** vacation-club / timeshare membership lead generation (U.S. prospects).

Primary conversion: **booked and attended vacation ownership presentation** → membership sale.

Medical tourism campaigns are intentionally isolated at `/medical` and must not be mixed into this funnel.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger
- Framer Motion
- Lucide icons
- Zod validation

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Project structure

```
src/
  app/                 # Routes, layout, API
  components/          # Page sections + UI
  content/site.ts      # Copy & verified/placeholder content
  hooks/
  lib/                 # Analytics, CRM, attribution, form schema, motion
```

### Homepage sections

| Section | Component |
| --- | --- |
| A Loader | `CinematicLoader` |
| B Hero | `Hero` |
| C Destinations | `DestinationGallery` |
| D Membership explainer | `MembershipExplainer` |
| E Benefits | `BenefitsSection` |
| F Experiences | `ExperienceGallery` |
| G Trust / testimonials | `Testimonials` |
| H FAQ | `FAQ` |
| I Conversion CTA | `ConversionCTA` |
| J Footer | `Footer` |
| Qualification form | `QualificationForm` |

## Lead qualification API

`POST /api/leads` validates the multi-step form server-side and calls `submitLeadToCrm()`.

**Important:** If `CRM_WEBHOOK_URL` or `CRM_API_KEY` are missing, the API returns **503 / NOT_CONFIGURED** and the UI shows an honest error — it never fakes a successful save.

### Required / outstanding configuration

| Item | Status |
| --- | --- |
| `CRM_WEBHOOK_URL` + `CRM_API_KEY` | Required for live lead capture |
| `BOOKING_SCHEDULER_URL` | Optional appointment deep-link |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | Optional consent-aware analytics |
| Official logo & brand tokens | Pending approval |
| Official resort photography | Replace Unsplash placeholders |
| Approved testimonials | Placeholder only until supplied |
| U.S. membership terms URL | Pending |
| U.S. inquiry email | Pending |
| Legal review of consent copy | Pending |

See `pendingApprovals` in `src/content/site.ts`.

## Analytics & attribution

- First-touch UTM capture via `src/lib/attribution.ts` (sessionStorage)
- Event schema in `src/lib/analytics.ts` (deduped, consent-aware)
- Cookie banner gates analytics consent
- Do **not** send PII to analytics unless explicitly permitted

Tracked events include landing views, CTA clicks, destination interactions, form start/step/abandon/submit, qualified leads, and hooks for appointment / sale / revenue reporting.

## Content policy

- Destinations reference publicly listed Park Royal / Royal Holiday materials
- No fabricated testimonials, awards, pricing, savings, or guarantees
- Stock photography is clearly marked as placeholder
- Vacation ownership only — not whole-property / real-estate investment advertising

## Three-month trial framing

1. **Month 1 — Foundation:** approve copy/assets, connect CRM + analytics, launch
2. **Month 2 — Optimization:** headline/CTA/form tests, lead quality, handoff fixes
3. **Month 3 — Outcomes:** attended presentations, CAC, attributable revenue, scale/pause decision

Do not invent target conversion rates without measured data.

## Accessibility & motion

- Semantic landmarks, keyboard FAQ accordion, visible focus states
- `prefers-reduced-motion` short-circuits loader/hero/GSAP timelines
- Desktop pinning / magnetic buttons disabled on small or reduced-motion contexts

## Separate medical journey

`/medical` is an architecture stub only. Build procedure-specific flows there (or a dedicated app) with healthcare privacy safeguards — never inside the vacation-club form.
