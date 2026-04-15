# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server at http://localhost:3000
npm run build      # production build
npm run lint       # ESLint via Next.js
npm test           # Vitest (watch mode)
npm run test:ui    # Vitest browser UI
npm run typecheck  # tsc --noEmit
```

Run a single test file:
```bash
npx vitest lib/__tests__/calculations.test.ts
```

## Architecture

Single Next.js 14 App Router route (`/calculator`). The page never navigates — it switches between two views (`form` | `results`) via a Zustand store flag (`view`).

**Data flow:**
1. `CalculatorForm` (multi-step with Framer Motion progressive reveal) writes to `formState` in the store via React Hook Form + Zod validation.
2. On submit, `store.submitForm()` syncs `sliderState` to match the submitted form values and flips `view` to `'results'`.
3. `ResultsPage` reads from `sliderState` (not `formState`) so the results sliders can adjust outputs live without touching the form.
4. All calculation logic is pure functions in `lib/calculations.ts` — no side effects, fully unit-tested.

**State split (important):**
- `formState` — what the user typed in the form; immutable once submitted
- `sliderState` — live overrides on the results page (LPR, UR, HSC, HIC, KRR); seeded from `formState` on submit

**Plan tier logic** lives entirely in `lib/planTiers.ts`. Tier is derived from `IN`, `MIV`, and `UR` at calculation time — see `types/calculator.types.ts` for thresholds.

## Calculation variables (abbreviations used throughout the codebase)

| Abbrev | Meaning |
|--------|---------|
| MIV | Monthly invoiced value (`MR` or `IN × AVGIV`) |
| RD | Revenue delayed (`MIV × LPR`) |
| RR | Revenue at risk (`MIV × UR`) |
| ICC | Internal chasing cost (`HSC × HIC` or `HSCI × IN × LPR × HIC`) |
| DC | Delay cost (`RD × 0.05`) |
| EMRL | Estimated monthly receivables lost — primary hero output |
| ERUV | Estimated recoverable unpaid value (`RR × KRR`) |
| ELS | Estimated labour savings (`ICC × 0.70`) |
| ACB | Accelerated cash benefit (`RD × 0.15`) |
| MRV | Monthly recoverable value (`ERUV + ELS`) |
| ROI | `MRV / plan_price` |

## Key conventions

- All rate/percentage fields are stored as decimals (0.20 = 20%) in both `FormState` and `SliderState`.
- `cn()` from `lib/utils.ts` (clsx + tailwind-merge) is used for all conditional className composition.
- UI primitives live in `components/ui/`; calculator steps in `components/calculator/`; results sections in `components/results/`.
- The reference test case (MR=€80k, HSC=10h, HIC=€40, LPR=30%, UR=6%, KRR=60%) in `lib/__tests__/calculations.test.ts` is the canonical correctness check — do not break it.

## Kleverbill Pricing Plans

Source: https://www.kleverbill.de/en/pricing

### Silver — €39/mo
- Up to 25 invoices/month
- PDF Export & Email Dispatch
- Document Upload & Internal Notes
- Basic Dunning Automation
- Payment Monitoring
- Email Support

### Gold — €199/mo ⭐ Most Popular
Includes all Silver features, plus:
- Up to 250 invoices/month
- API & SMTP Integration
- White-Label Reminders & Templates
- CSV Import & Banking Interface
- Customized Reminder Levels & Workflows
- Phone and Email Support

### Platinum — €449/mo
Includes all Gold features, plus:
- Up to 1000 invoices/month
- Automated Payment Reminders & Pauses
- ERP/CRM Integration & Data Export
- CSV Import/Export & Banking Interface
- Personal Account Manager
- Optional Back-Office Service

### Enterprise — Custom pricing
- Unlimited Invoices
- PDF Export & Email Delivery
- Tailored Workflows
- Dedicated server & interface for debt collection
- Personal Support & Consulting
- Premium Support
- Optional Back-Office Service