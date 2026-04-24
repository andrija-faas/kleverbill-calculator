# Calculator App — Initial SEO + AEO Implementation Plan

## Current State Summary

- Metadata exists (title, description, OG basics) with i18n support — but no OG image, Twitter card, or canonical
- No favicon / public directory
- No sitemap, no robots.txt
- No structured data (JSON-LD)
- No footer
- Heading hierarchy is shallow — section labels use `<p>` instead of semantic headings
- No `<main>`, `<section>`, `<footer>` landmark elements
- Results page content is hidden behind JS/state — invisible to crawlers as-is

---

## Phase 1 — Technical Foundation

**1.1 Favicon set**
Create `/public/` with a complete favicon package:
- `favicon.ico` (32×32, multi-res)
- `favicon.svg` (scalable, used by modern browsers)
- `apple-touch-icon.png` (180×180)
- `icon-192.png` + `icon-512.png` (PWA/Android)
- Wire all into `app/layout.tsx` via Next.js `icons` metadata field

**1.2 Social preview image (OG + Twitter)**
- Create `app/opengraph-image.tsx` using Next.js dynamic OG image generation (`ImageResponse`)
- Design: Kleverbill brand colors, calculator headline copy, logo — generated server-side at build time
- Wire `twitter:card = "summary_large_image"` into metadata
- Add locale-aware OG images (`app/[locale]/opengraph-image.tsx`)

**1.3 robots.ts + sitemap.ts**
- `app/robots.ts` — allow all crawlers, point to sitemap
- `app/sitemap.ts` — list `/de/calculator` and `/en/calculator` with `lastModified` and `alternates` (hreflang)

**1.4 Canonical + hreflang**
- Add `alternates.canonical` and `alternates.languages` to `generateMetadata` in `app/[locale]/layout.tsx`

---

## Phase 2 — Structured Data / AEO (Answer Engine Optimization)

This is the core AEO work — making the page machine-readable for AI answer engines (Perplexity, ChatGPT browsing, Google SGE, Bing AI).

**2.1 SoftwareApplication schema**
JSON-LD in `app/[locale]/layout.tsx`:
```json
{
  "@type": "SoftwareApplication",
  "name": "Kleverbill Revenue Recovery Calculator",
  "applicationCategory": "BusinessApplication",
  "offers": [{ "Silver": "€39/mo", "Gold": "€199/mo", "Platinum": "€449/mo", "Enterprise": "Custom" }],
  "operatingSystem": "Web"
}
```

**2.2 Organization schema**
```json
{
  "@type": "Organization",
  "name": "Kleverbill",
  "url": "https://kleverbill.de",
  "logo": "...",
  "contactPoint": { }
}
```

**2.3 FAQ schema on the calculator page**
Add a visually styled FAQ section below the form with 5–8 questions that answer engine queries naturally target:
- "How do I calculate unpaid invoice losses?"
- "What is a late payment rate?"
- "How much does invoice chasing cost?"
- "What does Kleverbill recover?"

These should be rendered as real HTML (visible to crawlers, styled subtly) and also emit `FAQPage` JSON-LD. This is the single highest-leverage AEO move.

**2.4 HowTo schema (optional but strong for calculators)**
Describe the calculation methodology as a `HowTo` — Google and AI engines surface these as featured snippets.

---

## Phase 3 — Semantic HTML + Heading Hierarchy

**3.1 Add `<main>` and `<section>` landmarks**
- Wrap `CalculatorForm` content in `<main>`
- Wrap each results section in `<section>` with `aria-label`

**3.2 Fix heading hierarchy**
Current section labels that are `<p>` tags should become `<h2>` or `<h3>`:
- Form step titles → `<h2>` (e.g. "Step 1: Invoice Volume")
- Results section headers (KleverbillEstimate, ScenarioExplorer, PricingAnchor) → `<h2>`
- Sub-labels inside sections → `<h3>`

No copy changes — just swap the element and ensure styling is preserved via CSS (not headings' default browser styles).

**3.3 Add `<footer>` component**

New `components/Footer.tsx` to be added to `app/[locale]/layout.tsx`. Suggested structure:
- Left: Kleverbill logo + tagline
- Middle: Links — Pricing, Privacy Policy, Imprint (Impressum for DE)
- Right: "Book a Recovery Audit" CTA
- Bottom: © 2025 Kleverbill · Legal disclaimer line

This adds crawlable anchor text, improves internal link structure, and gives the page a defined end — all of which help both SEO and AEO. The footer must be locale-aware (German/English).

**Styling rule:** The footer must match the navbar's visual style exactly — same background colour, same font weights, same padding/height rhythm, same logo treatment. Use the existing `Nav.tsx` as the style reference.

---

## Phase 4 — Metadata Completeness

**4.1 Fill gaps in `generateMetadata`**
- Add `twitter` card fields (currently absent entirely)
- Add `openGraph.siteName`, `openGraph.url`, `openGraph.locale`
- Add `robots` directive (`index, follow`)
- Add `viewport` explicitly

**4.2 Per-page metadata**
The calculator page (`app/[locale]/calculator/page.tsx`) should export its own `generateMetadata` (or pass page-level overrides) for more specific title/description targeting the calculator tool itself.

---

## Phase 5 — Crawler Accessibility of Results Content

**Problem:** The results page content is rendered client-side behind Zustand state (`view === 'results'`). Crawlers see only the form. The results hero copy and pricing info are invisible to search engines.

**Solution:**
- Add a static, SEO-only section below the form (rendered in HTML) that describes what the results look like, the plan pricing table, and the methodology
- OR convert the page to use server-rendered content for the static sections (pricing table, FAQ) that don't depend on user input

The FAQ section from 2.3 handles this partially. A **pricing comparison table** rendered in HTML (even collapsed by default) would let crawlers index Kleverbill's pricing and plan names.

---

## Priority Order

| # | Task | SEO Impact | AEO Impact | Effort |
|---|------|-----------|-----------|--------|
| 1 | Favicon set | Medium | Low | Low |
| 2 | OG image + Twitter card | Medium | Low | Medium |
| 3 | robots.ts + sitemap.ts | High | Low | Low |
| 4 | Canonical + hreflang | High | Low | Low |
| 5 | Organization + SoftwareApp JSON-LD | Medium | High | Low |
| 6 | FAQ section + FAQPage JSON-LD | High | Very High | Medium |
| 7 | Footer component (navbar-matched styling) | Medium | Medium | Medium |
| 8 | Semantic HTML landmarks + heading hierarchy | High | Medium | Medium |
| 9 | Metadata completeness (Twitter, OG fields) | Medium | Low | Low |
| 10 | Static pricing table / crawler-visible content | High | High | High |
