# Kleverbill Revenue Recovery Calculator

A two-view Next.js 14 application that calculates how much money unpaid invoices cost a business each month, and how much Kleverbill can recover.

## Stack

- **Next.js 14** (App Router, single-route client-side view switching)
- **TypeScript** — strict mode throughout
- **Tailwind CSS** — design tokens mapped to the Kleverbill design system
- **Zustand** — lightweight global state (form inputs + slider overrides)
- **Framer Motion** — progressive step reveal + page transitions
- **React Hook Form + Zod** — form validation
- **Vitest** — unit tests for calculation and plan tier logic

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/calculator`.

## Project structure

```
app/
  layout.tsx              Root layout (Nav, Lexend font, metadata)
  page.tsx                Redirects to /calculator
  calculator/
    page.tsx              Single route — renders form or results view

components/
  Nav.tsx                 Frosted glass top nav with inline SVG logo
  Logo.tsx                Kleverbill SVG icon mark
  ui/
    Button.tsx            Primary / CTA / ghost variants
    InputField.tsx        Labelled number input with prefix/suffix
    ToggleGroup.tsx       Pill-style toggle (revenue mode, HSC mode)
    ScenarioCard.tsx      KRR scenario selector card
    PlanBadge.tsx         Coloured plan tier badge
    Slider.tsx            Labelled range slider
    Card.tsx              Surface card wrapper
    ProgressiveStep.tsx   Animated reveal wrapper (Framer Motion)
  calculator/
    CalculatorForm.tsx    Form orchestrator + progressive reveal logic
    StepRevenue.tsx       Step 1 — revenue mode toggle + fields
    StepChasing.tsx       Step 2 — chasing hours toggle + fields
    StepOverrides.tsx     Step 3 — optional overrides (LPR, UR, HIC)
    StepScenario.tsx      Step 4 — KRR scenario cards
  results/
    ResultsPage.tsx       Results orchestrator — derives all outputs
    ResultsHero.tsx       Green gradient hero with live EMRL
    SupportingTiles.tsx   RD / RR / ICC strip
    KleverbillEstimate.tsx  3 green tiles (ERUV range, ELS, ACB)
    ScenarioExplorer.tsx  LPR + UR sliders + show more (HSC, HIC, KRR)
    PricingAnchor.tsx     ROI display with plan-derived price
    PlanRecommendation.tsx  Plan badge + description + CTA
    CtaSection.tsx        Book audit CTA + recalculate link

lib/
  calculations.ts         Pure calculation functions (fully tested)
  planTiers.ts            Plan tier logic and price definitions
  store.ts                Zustand store (formState + sliderState)
  validation.ts           Zod schemas for each form step
  utils.ts                cn() utility (clsx + tailwind-merge)

types/
  calculator.types.ts     All TypeScript interfaces and types

lib/__tests__/
  calculations.test.ts    Unit tests — verified against reference values
  planTiers.test.ts       Unit tests — tier boundary conditions
```

## Calculation logic

All formulas live in `lib/calculations.ts` as pure functions.

```
MIV  = MR  (or IN × AVGIV)
RD   = MIV × LPR
RR   = MIV × UR
ICC  = HSC × HIC  (or HSCI × (IN × LPR) × HIC)
DC   = RD × 0.05
EMRL = RR + ICC + DC           ← primary output
ERUV = RR × KRR                ← displayed as range (40%–75%)
ELS  = ICC × 0.70
ACB  = RD × 0.15
MRV  = ERUV + ELS
ROI  = MRV / plan_price        ← rounded to nearest integer
```

### Plan tier thresholds

| Tier       | Condition                                   | Price      |
|------------|---------------------------------------------|------------|
| Silver     | IN < 25 AND MIV < €20k                      | €39/month  |
| Gold       | IN 25–249 OR MIV €20k–€150k                 | €199/month |
| Platinum   | IN ≥ 250 OR MIV ≥ €150k OR UR ≥ 8%         | €449/month |
| Enterprise | IN ≥ 1000 OR MIV ≥ €500k                   | Custom     |

## Running tests

```bash
npm test              # run all tests
npm run test:ui       # Vitest UI
npm run typecheck     # TypeScript check without emit
```

## Reference test case

Input: MR=€80,000, HSC=10h, HIC=€40, LPR=30%, UR=6%, KRR=60%

| Variable | Expected |
|----------|----------|
| MIV      | €80,000  |
| RD       | €24,000  |
| RR       | €4,800   |
| ICC      | €400     |
| DC       | €1,200   |
| EMRL     | €6,400   |
| ERUV     | €2,880   |
| ELS      | €280     |
| ACB      | €3,600   |
| MRV      | €3,160   |
| ROI      | 16x (at Gold €199) |
