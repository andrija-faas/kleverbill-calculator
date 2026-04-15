# Design System Specification: Editorial Precision
 
## 1. Overview & Creative North Star
 
### Creative North Star: "The Financial Architect"
In an industry often defined by either cold utility or excessive tech-playfulness, this design system carves out a third path: **Editorial Precision**. It treats fintech software not as a tool, but as a high-end publication. The aesthetic is anchored in high-contrast typography, mathematical spacing, and a tonal depth that replaces traditional borders with architectural layering.
 
This system moves away from the "standard dashboard" look by embracing **Intentional Asymmetry**. We utilize the "breathing room" of white space as a structural element, allowing the bold, precision-tuned typography of Manrope to command attention. Elements do not just sit on a page; they are curated within a hierarchy of surfaces that feel as physical and tactile as premium stationery.
 
---
 
## 2. Colors
 
The palette is a sophisticated evolution of the brand’s heritage green, grounded by a comprehensive suite of "Slate Neutrals" to ensure a professional, trustworthy fintech environment.
 
### Color Strategy
*   **The Signature Green:** The `primary` (#466800) and its variants provide the energetic pulse of the system. It is used sparingly for high-impact actions and key brand moments.
*   **Neutral Dominance:** The system relies heavily on the `surface` and `surface-container` tiers to create a calm, organized workspace. 
 
### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off large areas of the UI. Separation must be achieved through:
1.  **Background Shifts:** Placing a `surface-container-low` component against a `surface` background.
2.  **Strategic Spacing:** Utilizing the 8px-based grid to create clear "gutters" of negative space.
 
### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. To define a sub-section within a module:
*   **Level 0 (Base):** `surface` (#f8f9fa)
*   **Level 1 (Section):** `surface-container-low` (#f1f4f6)
*   **Level 2 (Card/Action):** `surface-container-lowest` (#ffffff) — This creates a "lifted" effect through pure color contrast.
 
### The "Glass & Gradient" Rule
For hero sections or floating navigation, use **Glassmorphism**. Combine `surface` colors at 80% opacity with a `24px` backdrop-blur. For main CTAs, apply a subtle linear gradient from `primary` (#466800) to `primary_dim` (#3d5b00) at a 135-degree angle to add "soul" and depth.
 
---
 
## 3. Typography
 
**Primary Typeface:** Manrope  
Manrope is a semi-geometric sans-serif that excels in high-precision environments. Its wide apertures and tall x-height maintain readability in complex financial data while feeling modern and editorial.
 
*   **Display (lg, md, sm):** Used for "The Hook." These should have a tight letter-spacing (-0.02em) to feel like a high-end magazine header.
*   **Headline & Title:** Used for module headers. Use `on_surface` (#2b3437) to ensure an authoritative tone.
*   **Body (lg, md):** The workhorse for data and descriptions. Always use `on_surface_variant` (#586064) for long-form text to reduce eye strain.
*   **Labels:** All-caps labels should be used for metadata, with a slight letter-spacing increase (+0.05em) for a "pro-tool" feel.
 
---
 
## 4. Elevation & Depth
 
We move away from the "shadow-everything" approach of Material Design, favoring **Tonal Layering**.
 
### The Layering Principle
Hierarchy is achieved by stacking. An inner card should never use a border; it should use `surface_container_lowest` against a `surface_container` background. This creates a soft, natural edge that feels integrated into the UI.
 
### Ambient Shadows
When an element must float (e.g., a Modal or a Dropdown), use a precision shadow:
*   **Shadow:** `0px 12px 32px rgba(43, 52, 55, 0.06)`
*   The shadow is never black; it is a tinted version of `on_surface` at very low opacity to mimic natural ambient light.
 
### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., input fields), use a **Ghost Border**:
*   **Value:** `outline_variant` (#abb3b7) at **15% opacity**.
*   **Constraint:** 100% opaque, high-contrast borders are strictly forbidden.
 
---
 
## 5. Components
 
### Buttons
*   **Primary:** `primary` background with `on_primary` text. Border radius: `lg` (8px). 
*   **Secondary:** `surface_container_high` background. No border. This feels like a part of the UI rather than an "added" button.
*   **Tertiary (Editorial):** Text-only with a `primary` underline that expands on hover.
 
### Cards & Lists
*   **No Dividers:** Forbid the use of 1px lines between list items. Use 16px or 24px of vertical white space to separate items.
*   **The Container:** Cards should use the `xl` (12px) radius for a sharper, more professional fintech look.
 
### Input Fields
*   **Style:** Minimalist. No background fill. Only a "Ghost Border" at the bottom or a subtle 1px stroke at 10% opacity. 
*   **Focus State:** The border transitions to `primary` with a 2px weight—precision is key.
 
### Precision Data Chips
*   **Usage:** For status (e.g., "Paid", "Pending"). 
*   **Style:** Use `secondary_container` with `on_secondary_container` text. Keep the radius at `md` (6px) to maintain the "sharper" system aesthetic.
 
---
 
## 6. Do's and Don'ts
 
### Do
*   **Do** use asymmetrical layouts for Hero sections to create an editorial feel.
*   **Do** use `surface-dim` for footers to "ground" the application.
*   **Do** prioritize typography scale over color for hierarchy. If a header isn't standing out, make it larger/bolder before changing its color.
*   **Do** use `8px` (lg) and `12px` (xl) radiuses consistently to maintain a "sharp" professional tone.
 
### Don't
*   **Don't** use 1px solid borders to define "boxes." Use color blocks.
*   **Don't** use pure black (#000000) for shadows or text. Always use the `on_surface` or `on_background` tokens.
*   **Don't** use "default" system fonts. Manrope must be used to maintain the signature identity.
*   **Don't** crowd the interface. If the UI feels busy, increase the spacing between `surface_container` modules.