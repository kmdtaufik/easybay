# EasyBay Design System & Brand Guidelines

## 1. Core Aesthetic: "Stark Minimalism"
EasyBay uses an ultra-clean, highly professional, and strictly minimalist aesthetic. We avoid trends like glowing gradients, glassmorphism, or heavy drop shadows (which can feel generic or "AI-generated"). The platform feels like a high-end enterprise tool: utilitarian, precise, and completely focused on the content.

**Keywords:** Minimalist, Brutalist, Professional, High-Contrast, Flat.

## 2. Color Palette
The color system relies entirely on a strict monochromatic scale. There are no vibrant accent colors; hierarchy is established through contrast.

### Base / Neutrals (Zinc Scale)
- **Backgrounds:** `white` and `zinc-50` (for subtle contrast panels).
- **Dark Mode Background:** `zinc-950` and `zinc-900`.
- **Borders & Dividers:** `zinc-200` (Light) / `zinc-800` (Dark). All inputs and cards use thin, crisp 1px borders.
- **Typography:** `zinc-950` (Primary Light) / `white` (Primary Dark), with `zinc-500` used heavily for secondary descriptive text.

### Brand Accents
- **Primary Brand (Action):** **Pure Black** (`zinc-900` / `zinc-950`) in Light mode, or Pure White (`white`) in Dark Mode. No neon accents.
- **Hover States:** Instead of color shifts, we use subtle alpha changes (e.g. `hover:bg-zinc-800`) or standard outline transitions.

## 3. Typography
We use **Geist Variable** as our single, universal typeface. 
- **Headings (H1-H3):** Tight tracking (`tracking-tight`), medium to semi-bold weights (`font-medium`, `font-semibold`).
- **Body Text:** Standard tracking, regular weight. Always optimized for legibility (usually `text-zinc-500`).
- **Monospace/Numbers:** `Geist Mono` for SKUs, order numbers, and pricing data to ensure tabular alignment.

## 4. UI Components & Borders
We modify `shadcn/ui` to be as flat and structural as possible.
- **Cards & Containers:** Flat. Zero drop shadows (`shadow-none`). We rely entirely on 1px borders (`border-zinc-200`) to define edges.
- **Buttons:** 
  - Primary: High contrast (Black/White depending on mode). Flat styling. 
  - Secondary/Ghost: `variant="outline"` with transparent backgrounds and strict 1px borders.

## 5. Motion & Micro-Interactions
Motion is kept to an absolute minimum to preserve the utilitarian feel.
- **Hover States:** Fast, utilitarian transitions. Icons inside buttons (like arrows) shift slightly (`group-hover:translate-x-1`), but we avoid excessive scaling or bouncing.

## 6. Iconography
- **Library:** `lucide-react`.
- **Style:** Consistent 2px stroke width, used sparingly. Icons should generally be sized at `h-4 w-4` for inline button usage or `h-5 w-5` for headers.

## 7. Layout Strategy
- **Grid System:** Based on Tailwind's standard 8pt grid.
- **Auth Pages:** Full-bleed, 50/50 split screen on desktop. Left side contains the form, right side contains a muted brand panel. 
- **Mobile First:** Side-by-side split screens collapse into stacked columns on mobile, maintaining the flat, bordered aesthetic. 
