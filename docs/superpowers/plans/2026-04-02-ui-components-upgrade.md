# DIGITX Website UI Components Upgrade

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the DIGITX lab website with premium UI components from shadcn, ReactBits, and 21st.dev while fixing critical UX gaps (mobile nav, SEO, accessibility).

**Architecture:** Incremental component upgrades to the existing React + Tailwind + Framer Motion SPA. Each task modifies one section of the site independently. New components are self-contained files in `src/components/`. Data arrays are extracted from `Index.tsx` into `src/data/` files. No new npm dependencies required (all components use existing Framer Motion or are CSS-only).

**Tech Stack:** React 18, TypeScript, Tailwind CSS 3.4, Framer Motion 12, shadcn/ui (Radix), Vite 7

---

## File Structure

### New files to create:
- `src/components/MobileNav.tsx` — Sheet-based mobile navigation drawer
- `src/components/SpotlightCard.tsx` — Cursor-following spotlight card (CSS-only)
- `src/components/CountUp.tsx` — Animated number counter triggered on scroll
- `src/components/RotatingText.tsx` — 3D flip text rotation for hero
- `src/components/FadeIn.tsx` — Universal scroll-triggered fade entrance wrapper
- `src/components/NumberTicker.tsx` — Ticker for stats section
- `src/data/focus-areas.ts` — Focus areas data extracted from Index.tsx
- `src/data/principles.ts` — Principles data extracted from Index.tsx
- `src/data/team.ts` — Team members data extracted from Index.tsx
- `src/data/tools.ts` — Software tools data extracted from Index.tsx
- `src/data/collaborators.ts` — Collaborators data extracted from Index.tsx
- `public/favicon.svg` — SVG favicon for the site
- `public/og-image.png` — Open Graph social preview image (generated)

### Files to modify:
- `src/pages/Index.tsx` — Refactor into sections using new components; add mobile nav, stats bar, spotlight cards, fade-in wrappers, rotating text
- `src/index.css` — Add `prefers-reduced-motion` media query, spotlight card styles, stats bar styles
- `index.html` — Fix canonical URL, add og:image, add favicon, add robots meta
- `tailwind.config.ts` — Add marquee animation keyframes (if needed)

---

## Task 1: Extract Data Arrays from Index.tsx

**Files:**
- Create: `src/data/focus-areas.ts`
- Create: `src/data/principles.ts`
- Create: `src/data/team.ts`
- Create: `src/data/tools.ts`
- Create: `src/data/collaborators.ts`
- Modify: `src/pages/Index.tsx`

This unblocks all other tasks by shrinking Index.tsx from ~894 lines and making data independently importable.

- [ ] **Step 1: Create focus-areas.ts**

```typescript
// src/data/focus-areas.ts
export interface FocusArea {
  num: string;
  title: string;
  desc: string;
  example: string;
}

export const focusAreas: FocusArea[] = [
  {
    num: '01',
    title: 'Autonomous Structuring of Clinical Data',
    desc: 'Make PDFs, dictated notes, images, and labs computable. Normalize names, keep provenance, and deliver structured data without endless prep.',
    example: 'Example: Radiology PDF → FHIR bundle with SNOMED/LOINC codes and time stamps preserved.',
  },
  {
    num: '02',
    title: 'Knowledge Graphs as a Common Substrate',
    desc: 'Link that data into a clinical graph that understands people, time, and relationships — not just isolated fields.',
    example: 'Example: patient → has_diagnosis → ICD/SNOMED node → linked to meds, labs, imaging, and time points with causal hints.',
  },
  {
    num: '03',
    title: 'Reasoning Interfaces for Clinicians',
    desc: 'Give clinicians ways to ask grounded questions, see the evidence path, and challenge the logic — safely and quickly.',
    example: 'Example: "Show tumor response over 6 months" → evidence-backed trend with cited sources.',
  },
  {
    num: '04',
    title: 'Scalable Infrastructure for Health Evidence',
    desc: 'Run analyses across thousands of datasets with audit trails, reproducibility, and guardrails built in.',
    example: 'Example: Cohort builder + reproducible pipelines with lineage, so results are portable across sites.',
  },
];
```

- [ ] **Step 2: Create principles.ts**

```typescript
// src/data/principles.ts
export interface Principle {
  title: string;
  desc: string;
}

export const principles: Principle[] = [
  { title: 'Begin with Clinical Reality', desc: 'Health data is messy. We sit with clinicians and build for the workflows that already exist, not the ones we wish existed.' },
  { title: 'Structure Enables Intelligence', desc: 'Predictions without meaning are brittle. We encode semantics, time, and provenance so reasoning has firm ground.' },
  { title: 'LLMs Are Tools, Not Oracles', desc: 'We use language models where they help, and we always anchor them in verifiable knowledge graphs with clear evidence.' },
  { title: 'Reproducibility and Scale Matter', desc: 'Methods should generalize across institutions and populations. We test for that and build for that.' },
  { title: 'Quiet Ambition', desc: 'We take on foundational work with humility and patience. We measure progress by safer care and stronger science.' },
];
```

- [ ] **Step 3: Create team.ts**

```typescript
// src/data/team.ts
export interface TeamMember {
  name: string;
  role: string;
  label: string;
  tags: string[];
  bio: string;
  university: string;
  github?: string;
  linkedin?: string;
  scholar?: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Prof. Dr. Lalith Kumar Shiyam Sundar',
    role: 'Group Lead',
    label: 'Group Lead',
    tags: ['Medical imaging', 'Multimodal integration', 'Knowledge graphs'],
    bio: 'Focuses on clinically grounded AI that fuses imaging, text, and structured data into explainable knowledge graphs for real-world decisions.',
    university: 'LMU Radiology · LMU University Hospital',
    github: 'https://github.com/LalithShiyam',
    linkedin: 'https://de.linkedin.com/in/lalith-kumar-shiyam-sundar-phd-3a2aaba0',
    scholar: 'https://scholar.google.com/citations?user=L6iMPN4AAAAJ&hl=en',
  },
  {
    name: 'Dr. Sahib Julka',
    role: 'Post Doctoral Researcher',
    label: 'Post Doctoral Researcher',
    tags: ['LLMs', 'Knowledge graphs', 'Automation'],
    bio: 'Focuses on LLM-based knowledge graph creation from clinical text and structured sources.',
    university: 'LMU University Hospital',
    github: 'https://github.com/julka01',
    linkedin: 'https://www.linkedin.com/in/julka01/',
    scholar: 'https://scholar.google.com/citations?user=GaEUyB0AAAAJ&hl=en',
  },
  {
    name: 'Sameer Singh Rawat',
    role: 'Master thesis student',
    label: 'Master thesis student',
    tags: ['AI automation', 'Ontology', 'LLMs'],
    bio: 'Focuses on automated ontology induction from medical documents using large language models.',
    university: 'Ludwig Maximilian University of Munich',
    github: 'https://github.com/SameerR007',
    linkedin: 'https://www.linkedin.com/in/sameer-s-1333a6172',
  },
];
```

- [ ] **Step 4: Create tools.ts**

```typescript
// src/data/tools.ts
export interface Tool {
  name: string;
  desc: string;
  tags: string[];
  status: string;
  github: string;
  paper?: string;
  stars: number;
}

export const imagingTools: Tool[] = [
  {
    name: 'MOOSE',
    desc: 'Segments 130+ tissues from CT using nnU-Net; built for multicenter PET/CT workflows and opportunistic screening.',
    tags: ['PET/CT', 'Segmentation', 'Multicenter'],
    status: 'Stable',
    github: 'https://github.com/ENHANCE-PET/MOOSE',
    paper: 'https://pubmed.ncbi.nlm.nih.gov/35772962/',
    stars: 304,
  },
  {
    name: 'FALCON',
    desc: 'One-stop total-body PET motion correction using the greedy diffeomorphic registration engine.',
    tags: ['PET/CT', 'Motion correction', 'Registration'],
    status: 'Stable',
    github: 'https://github.com/ENHANCE-PET/FALCON',
    paper: 'https://pubmed.ncbi.nlm.nih.gov/37290795/',
    stars: 48,
  },
  {
    name: 'PUMA',
    desc: 'PET segmentation-guided diffeomorphic framework for multiplexing tracers to characterise tissue biology.',
    tags: ['PET/CT', 'Segmentation', 'Diffeomorphic'],
    status: 'Stable',
    github: 'https://github.com/ENHANCE-PET/PUMA',
    paper: 'https://jnm.snmjournals.org/content/early/2025/09/18/jnumed.125.269688',
    stars: 21,
  },
];

export const llmTools: Tool[] = [
  {
    name: 'MosaicX',
    desc: 'Autonomous structuring engine that turns PDFs, dictated notes, images, and labs into FHIR-ready, provenance-preserved data.',
    tags: ['FHIR', 'SNOMED/LOINC', 'Provenance', 'Pipelines'],
    status: 'In development',
    github: 'https://github.com/DIGIT-X-Lab/MOSAICX',
    stars: 4,
  },
  {
    name: 'AnnotateX',
    desc: 'GUI web app for rapid text annotation to build gold standards and evaluate structured extraction.',
    tags: ['Annotation', 'Quality', 'Gold standards'],
    status: 'In development',
    github: 'https://github.com/DIGIT-X-Lab/ANNOTATEX',
    stars: 3,
  },
  {
    name: 'KnowledgeX',
    desc: 'A discovery platform that builds graphs from unstructured text with LLMs and supports grounded chat over the graph.',
    tags: ['Knowledge graph', 'LLM-grounding', 'Reasoning'],
    status: 'In development',
    github: 'https://github.com/DIGIT-X-Lab/KnowledgeX',
    stars: 0,
  },
];
```

- [ ] **Step 5: Create collaborators.ts**

```typescript
// src/data/collaborators.ts
export interface Collaborator {
  name: string;
  url: string;
}

export const collaborators: Collaborator[] = [
  { name: 'Hermes Medical Solutions', url: 'https://www.hermesmedical.com' },
  { name: 'deepc', url: 'https://www.deepc.ai/' },
  { name: 'Visage Imaging', url: 'https://visageimaging.com/' },
  { name: 'Zenta', url: 'https://www.zenta.solutions/' },
  { name: 'dottxt', url: 'https://dottxt.ai/' },
  { name: 'Radixlab Medical', url: 'https://radixlabmedical.com/' },
  { name: 'Melbourne Theranostics Innovation Center', url: 'https://www.mtic.net.au/' },
  { name: 'ICPO Foundation', url: 'https://www.icpo.foundation/' },
];
```

- [ ] **Step 6: Update Index.tsx imports**

Replace the inline data arrays in `src/pages/Index.tsx` with imports from the new data files. Remove the `focusAreas`, `principles`, `teamMembers`, `tools`, `imagingTools` const declarations (lines 53-178) and add:

```typescript
import { focusAreas } from '@/data/focus-areas';
import { principles } from '@/data/principles';
import { teamMembers } from '@/data/team';
import { imagingTools, llmTools } from '@/data/tools';
import { collaborators } from '@/data/collaborators';
```

In the JSX, replace `tools.map` with `llmTools.map` and update the collaborators section to use `collaborators.map` instead of hardcoded `<a>` tags. The `initialStarCounts` computation should change from `[...tools, ...imagingTools]` to `[...llmTools, ...imagingTools]`.

- [ ] **Step 7: Verify the dev server runs**

Run: `npm run dev` and confirm the site loads identically at http://localhost:8080. All sections should render unchanged.

- [ ] **Step 8: Commit**

```bash
git add src/data/focus-areas.ts src/data/principles.ts src/data/team.ts src/data/tools.ts src/data/collaborators.ts src/pages/Index.tsx
git commit -m "refactor: extract data arrays from Index.tsx into separate data files"
```

---

## Task 2: Fix Critical Issues (Mobile Nav, SEO, Accessibility)

**Files:**
- Create: `src/components/MobileNav.tsx`
- Create: `public/favicon.svg`
- Modify: `src/pages/Index.tsx` (nav section, lines ~238-253)
- Modify: `index.html`
- Modify: `src/index.css`

- [ ] **Step 1: Create MobileNav.tsx using shadcn Sheet**

The project already has `src/components/ui/sheet.tsx` installed. Create a mobile navigation drawer:

```typescript
// src/components/MobileNav.tsx
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
  { label: 'Vision', href: '#vision' },
  { label: 'Focus', href: '#focus' },
  { label: 'Software', href: '#tools' },
  { label: 'Approach', href: '#approach' },
  { label: 'People', href: '#people' },
  { label: 'Publications', href: '#publications' },
  { label: 'Careers', href: '#careers' },
  { label: 'Connect', href: '#connect' },
];

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="md:hidden p-2 -ml-2 text-[hsl(var(--text-primary))] hover:text-[hsl(var(--accent))] transition-colors"
          aria-label="Open navigation menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 bg-[hsl(var(--bg-primary))] border-[hsl(var(--border))]"
      >
        <SheetHeader>
          <SheetTitle className="text-left font-semibold tracking-tight text-[hsl(var(--text-primary))]">
            DIGITX
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 mt-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-[0.9375rem] text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-secondary))] transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
```

- [ ] **Step 2: Add MobileNav to the navbar in Index.tsx**

In `src/pages/Index.tsx`, import and add MobileNav to the nav bar. Replace the nav section (around lines 238-253):

Find this block:
```tsx
<div className="max-w-7xl mx-auto flex items-center justify-between">
  <div className="w-10 hidden md:block" />
  <div className="hidden md:flex items-center gap-10">
```

Replace with:
```tsx
<div className="max-w-7xl mx-auto flex items-center justify-between">
  <MobileNav />
  <div className="w-10 hidden md:block" />
  <div className="hidden md:flex items-center gap-10">
```

Add the import at the top:
```typescript
import MobileNav from '@/components/MobileNav';
```

- [ ] **Step 3: Create favicon.svg**

Create a minimal SVG favicon using the DIGITX accent coral color:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="hsl(18, 76%, 48%)"/>
  <text x="16" y="23" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="18" fill="white">Dx</text>
</svg>
```

- [ ] **Step 4: Fix index.html — canonical, favicon, og:image, robots**

Replace the contents of `index.html` `<head>`:

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="index, follow" />
  <title>DIGITX Lab | Foundations for Health Intelligence | LMU Klinikum</title>
  <meta name="description" content="DIGITX is an academic lab at LMU Klinikum building the foundations of health intelligence: autonomous structuring of clinical data, clinical knowledge graphs, and explainable reasoning interfaces for safer care." />
  <meta name="author" content="DIGITX Lab" />
  <meta name="keywords" content="health intelligence, clinical knowledge graphs, healthcare data infrastructure, LMU Klinikum, digital health, clinical informatics" />

  <meta property="og:title" content="DIGITX Lab | Foundations for Health Intelligence" />
  <meta property="og:description" content="We turn raw clinical signals into structured, connected evidence — building trustworthy tools for clinicians, researchers, and patients." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/og-image.png" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="DIGITX Lab | LMU Klinikum" />
  <meta name="twitter:description" content="Autonomous structuring, clinical knowledge graphs, and explainable interfaces for safer care." />
  <meta name="twitter:image" content="/og-image.png" />

  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
```

Key changes: removed the incorrect `<link rel="canonical" href="https://digit-x.lab" />` (add it back once you have the real deployed domain), added `robots` meta, added `og:image` and `twitter:image`, added favicon link.

- [ ] **Step 5: Add prefers-reduced-motion to index.css**

Add this block at the very end of `src/index.css`:

```css
/* Accessibility: respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 6: Create a placeholder og-image.png**

Use a simple HTML-to-canvas approach or create a minimal placeholder. For now, create a simple 1200x630 SVG placeholder that can be replaced with a proper designed image later:

```bash
# Create a simple OG image placeholder using an inline SVG converted to PNG
# For now, create a note that this needs a real designed image
echo "TODO: Replace with designed 1200x630 OG image" > public/og-image-README.txt
```

Note: The og:image tag is in place. The actual image file (`public/og-image.png`) should be a designed 1200x630px image showing the DIGITX branding. This can be created separately using a design tool or by rendering an HTML template. For now, the meta tags are correctly configured.

- [ ] **Step 7: Verify mobile nav works**

Run: `npm run dev` and test:
1. Resize browser to < 768px width
2. Hamburger icon should appear on the left
3. Clicking it opens a slide-out Sheet from the left
4. Clicking a nav item scrolls to the section and closes the sheet
5. Desktop nav (>768px) remains unchanged

- [ ] **Step 8: Commit**

```bash
git add src/components/MobileNav.tsx src/pages/Index.tsx index.html src/index.css public/favicon.svg public/og-image-README.txt
git commit -m "fix: add mobile navigation, favicon, OG meta tags, and reduced-motion support"
```

---

## Task 3: SpotlightCard Component

**Files:**
- Create: `src/components/SpotlightCard.tsx`
- Modify: `src/index.css`
- Modify: `src/pages/Index.tsx` (Software section)

- [ ] **Step 1: Create SpotlightCard.tsx**

A CSS-only card with a cursor-following radial spotlight. Zero new dependencies.

```typescript
// src/components/SpotlightCard.tsx
import { useRef, useState } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'hsl(18 76% 48% / 0.08)',
}: SpotlightCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--spot-x': `${position.x}px`,
        '--spot-y': `${position.y}px`,
        '--spot-color': spotlightColor,
        '--spot-opacity': isHovered ? '1' : '0',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default SpotlightCard;
```

- [ ] **Step 2: Add spotlight-card CSS to index.css**

Add this inside the `@layer components` block in `src/index.css`, after the existing `.software-card` styles:

```css
  /* Spotlight card effect */
  .spotlight-card {
    position: relative;
    overflow: hidden;
  }
  .spotlight-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      600px circle at var(--spot-x) var(--spot-y),
      var(--spot-color),
      transparent 40%
    );
    opacity: var(--spot-opacity);
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 1;
  }
  .spotlight-card > * {
    position: relative;
    z-index: 2;
  }
```

- [ ] **Step 3: Wrap software cards with SpotlightCard in Index.tsx**

Import SpotlightCard and wrap both the imaging and LLM tool card `<div>` elements. In the Software section, change:

```tsx
<div key={tool.name} className="software-card h-full flex flex-col">
```

to:

```tsx
<SpotlightCard key={tool.name} className="software-card h-full flex flex-col">
```

And close with `</SpotlightCard>` instead of `</div>`. Do this for both the `imagingTools.map` and `llmTools.map` loops.

Add the import:
```typescript
import SpotlightCard from '@/components/SpotlightCard';
```

- [ ] **Step 4: Verify spotlight effect**

Run: `npm run dev`. Navigate to the Software section. Hover over each tool card. A warm coral radial gradient should follow the cursor within the card bounds and fade out on mouse leave.

- [ ] **Step 5: Commit**

```bash
git add src/components/SpotlightCard.tsx src/index.css src/pages/Index.tsx
git commit -m "feat: add cursor-following spotlight effect to software cards"
```

---

## Task 4: CountUp Component + Stats Bar

**Files:**
- Create: `src/components/CountUp.tsx`
- Modify: `src/pages/Index.tsx` (add stats section between Hero and Vision)

- [ ] **Step 1: Create CountUp.tsx**

A Framer Motion animated number counter that triggers when scrolled into view:

```typescript
// src/components/CountUp.tsx
import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

interface CountUpProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

const CountUp = ({
  target,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, target, {
      duration,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (value) => {
        setDisplay(Math.round(value).toLocaleString());
      },
    });

    return () => controls.stop();
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
};

export default CountUp;
```

- [ ] **Step 2: Add the Stats Bar section to Index.tsx**

Add a new section between the Hero section and the Vision section. After the closing `</section>` of the Hero (the one with `min-h-screen`) and before `{/* Vision */}`, insert:

```tsx
{/* Stats Bar */}
<section className="relative py-12 md:py-16 px-6 md:px-12 lg:px-20 border-y border-[hsl(var(--border))]">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
      {[
        { target: 370, suffix: '+', label: 'GitHub Stars' },
        { target: 11, suffix: '', label: 'Publications (2025)' },
        { target: 6, suffix: '', label: 'Open-Source Tools' },
        { target: 5235, suffix: '+', label: 'Patients Analyzed' },
      ].map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-3xl md:text-4xl lg:text-5xl font-light text-[hsl(var(--text-primary))] tabular-nums">
            <CountUp target={stat.target} suffix={stat.suffix} />
          </div>
          <div className="text-xs uppercase tracking-[0.12em] text-[hsl(var(--text-secondary))] mt-2">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

Add the import:
```typescript
import CountUp from '@/components/CountUp';
```

- [ ] **Step 3: Verify stats bar**

Run: `npm run dev`. Scroll past the hero. The stats bar should appear with numbers animating from 0 to their targets when scrolled into view. The animation should only trigger once.

- [ ] **Step 4: Commit**

```bash
git add src/components/CountUp.tsx src/pages/Index.tsx
git commit -m "feat: add animated stats bar with scroll-triggered counters"
```

---

## Task 5: RotatingText in Hero

**Files:**
- Create: `src/components/RotatingText.tsx`
- Modify: `src/pages/Index.tsx` (Hero heading)

- [ ] **Step 1: Create RotatingText.tsx**

A Framer Motion component that cycles through words with a smooth vertical flip animation:

```typescript
// src/components/RotatingText.tsx
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface RotatingTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

const RotatingText = ({
  words,
  interval = 3000,
  className = '',
}: RotatingTextProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className={`inline-block relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 20, opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -20, opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;
```

- [ ] **Step 2: Update the hero heading in Index.tsx**

Replace the static hero heading. Find:

```tsx
<h1 className="text-display text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] text-[hsl(var(--text-primary))] mb-10">
  <BlurText delay={0.2}>Shaping Health</BlurText>
  <br />
  <span className="text-[hsl(var(--accent))] italic">
    <BlurText delay={0.5}>Intelligence</BlurText>
  </span>
</h1>
```

Replace with:

```tsx
<h1 className="text-display text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] text-[hsl(var(--text-primary))] mb-10">
  <BlurText delay={0.2}>Shaping</BlurText>{' '}
  <span className="text-[hsl(var(--accent))] italic">
    <RotatingText
      words={['Health', 'Radiology', 'Oncology', 'Clinical']}
      interval={3000}
    />
  </span>
  <br />
  <span className="text-[hsl(var(--accent))] italic">
    <BlurText delay={0.5}>Intelligence</BlurText>
  </span>
</h1>
```

Add the import:
```typescript
import RotatingText from '@/components/RotatingText';
```

- [ ] **Step 3: Verify rotating text**

Run: `npm run dev`. The hero should show "Shaping [Health]" where [Health] cycles through Health → Radiology → Oncology → Clinical every 3 seconds with a smooth blur-flip transition.

- [ ] **Step 4: Commit**

```bash
git add src/components/RotatingText.tsx src/pages/Index.tsx
git commit -m "feat: add rotating text animation to hero heading"
```

---

## Task 6: FadeIn Scroll Animation Wrapper

**Files:**
- Create: `src/components/FadeIn.tsx`
- Modify: `src/pages/Index.tsx` (wrap all major sections)

- [ ] **Step 1: Create FadeIn.tsx**

A reusable Framer Motion wrapper that fades+slides content in when scrolled into view:

```typescript
// src/components/FadeIn.tsx
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
}

const FadeIn = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 24,
  duration = 0.6,
}: FadeInProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  const offset = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
```

- [ ] **Step 2: Wrap major section headers and content blocks in Index.tsx**

Import FadeIn and wrap the header blocks of each major section. Apply FadeIn to the section header `<div>` in these sections:

1. **Vision** — wrap the `<div className="lg:col-span-4">` and `<div className="lg:col-span-8">` blocks
2. **Problem** — wrap the heading div and cards div
3. **Focus Areas** — wrap the header `<div className="mb-20 max-w-4xl">` and the `<div className="max-w-6xl">` containing the focus area rows
4. **Software** — wrap the header div and the two tool grid sections
5. **Approach** — wrap the header div and principles list
6. **People** — wrap the header and team members
7. **Publications** — wrap the header and list
8. **Careers** — wrap the header and job list
9. **Connect** — wrap the centered content block

Example pattern for each section header:

```tsx
<FadeIn>
  <div className="mb-20 max-w-4xl">
    <span className="text-label text-[hsl(var(--accent))] block mb-4">What We Work On</span>
    ...
  </div>
</FadeIn>
```

For content blocks, use a slight delay:

```tsx
<FadeIn delay={0.15}>
  <div className="max-w-6xl">
    {focusAreas.map(...)}
  </div>
</FadeIn>
```

Add the import:
```typescript
import FadeIn from '@/components/FadeIn';
```

- [ ] **Step 3: Verify scroll animations**

Run: `npm run dev`. Scroll through the page. Each section's header and content should fade+slide up into view as it enters the viewport. The animation should only trigger once per element.

- [ ] **Step 4: Commit**

```bash
git add src/components/FadeIn.tsx src/pages/Index.tsx
git commit -m "feat: add scroll-triggered fade-in animations to all sections"
```

---

## Task 7: Tabs for Software Section

**Files:**
- Modify: `src/pages/Index.tsx` (Software section)

Uses the already-installed shadcn `Tabs` component (`src/components/ui/tabs.tsx`).

- [ ] **Step 1: Replace the stacked tool grids with Tabs**

Import Tabs:
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
```

Replace the Software section content (the two grid blocks for Imaging Stack and LLM Stack) with:

```tsx
<Tabs defaultValue="imaging" className="max-w-7xl mx-auto">
  <TabsList className="mb-8 bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--border))]">
    <TabsTrigger
      value="imaging"
      className="data-[state=active]:bg-[hsl(var(--bg-primary))] data-[state=active]:text-[hsl(var(--accent))] data-[state=active]:shadow-sm"
    >
      Imaging Stack
    </TabsTrigger>
    <TabsTrigger
      value="llm"
      className="data-[state=active]:bg-[hsl(var(--bg-primary))] data-[state=active]:text-[hsl(var(--accent))] data-[state=active]:shadow-sm"
    >
      LLM Stack
    </TabsTrigger>
  </TabsList>

  <TabsContent value="imaging">
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {imagingTools.map((tool) => (
        <SpotlightCard key={tool.name} className="software-card h-full flex flex-col">
          {/* ... existing tool card content unchanged ... */}
        </SpotlightCard>
      ))}
    </div>
  </TabsContent>

  <TabsContent value="llm">
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {llmTools.map((tool) => (
        <SpotlightCard key={tool.name} className="software-card h-full flex flex-col">
          {/* ... existing tool card content unchanged ... */}
        </SpotlightCard>
      ))}
    </div>
  </TabsContent>
</Tabs>
```

Keep all the existing card inner content (title, tags, description, GitHub/paper links) exactly as-is. Only the outer container changes from two separate grid divs with labels to a single Tabs component.

Remove the now-unused `<span className="text-label ...">Imaging Stack</span>` and `<span className="text-label ...">LLM Stack</span>` labels since the tab triggers replace them.

- [ ] **Step 2: Verify tabs work**

Run: `npm run dev`. The Software section should now show two tabs: "Imaging Stack" (default active) and "LLM Stack". Clicking each tab switches the displayed cards. Spotlight effect should work within both tabs.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Index.tsx
git commit -m "feat: replace stacked software grids with shadcn Tabs"
```

---

## Task 8: Accordion for Focus Areas

**Files:**
- Modify: `src/pages/Index.tsx` (Focus Areas section)

Uses the already-installed shadcn `Accordion` component.

- [ ] **Step 1: Replace focus area rows with Accordion**

Import Accordion:
```typescript
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
```

Replace the focus areas rendering (the `<div className="max-w-6xl">` containing `focusAreas.map`) with:

```tsx
<div className="max-w-6xl">
  <Accordion type="single" collapsible className="space-y-2">
    {focusAreas.map((area) => (
      <AccordionItem
        key={area.num}
        value={area.num}
        className="border border-[hsl(var(--border))] rounded-lg px-6 bg-[hsl(var(--bg-primary)/0.5)] backdrop-blur-sm"
      >
        <AccordionTrigger className="hover:no-underline py-5 gap-4">
          <div className="flex items-center gap-5 text-left">
            <span className="text-2xl md:text-3xl font-light text-[hsl(var(--accent))] tabular-nums shrink-0 w-10">
              {area.num}
            </span>
            <span className="text-lg md:text-xl font-semibold text-[hsl(var(--text-primary))]">
              {area.title}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-5 pl-[3.75rem]">
          <p className="text-[hsl(var(--text-secondary))] leading-[1.8] mb-3">
            {area.desc}
          </p>
          <p className="text-sm text-[hsl(var(--accent))] leading-[1.8]">
            {area.example}
          </p>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
</div>
```

- [ ] **Step 2: Verify accordion works**

Run: `npm run dev`. The Focus Areas section should show 4 collapsible items. Clicking a title expands its description and example. Only one item can be open at a time (`type="single"`). Clicking the open item collapses it (`collapsible`).

- [ ] **Step 3: Commit**

```bash
git add src/pages/Index.tsx
git commit -m "feat: replace focus area list with collapsible accordion"
```

---

## Task 9: Dot Pattern Background Texture

**Files:**
- Modify: `src/index.css`
- Modify: `src/pages/Index.tsx` (add dot pattern to alternating sections)

- [ ] **Step 1: Add dot-pattern CSS class to index.css**

Add inside `@layer components`:

```css
  /* Dot pattern background texture */
  .dot-pattern {
    position: relative;
  }
  .dot-pattern::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      hsl(var(--text-primary) / 0.07) 1px,
      transparent 1px
    );
    background-size: 24px 24px;
    pointer-events: none;
    z-index: 0;
  }
  .dot-pattern > * {
    position: relative;
    z-index: 1;
  }
```

- [ ] **Step 2: Add dot-pattern class to bg-secondary sections**

In `src/pages/Index.tsx`, add `dot-pattern` to the className of sections that use `bg-[hsl(var(--bg-secondary))]`:

1. **Vision section** (line ~291): `className="relative py-28 md:py-40 ... bg-[hsl(var(--bg-secondary))] dot-pattern ..."`
2. **Focus Areas section** (line ~373): `className="relative py-32 md:py-48 ... bg-[hsl(var(--bg-secondary))] dot-pattern ..."`
3. **People section** (line ~551): `className="relative py-32 md:py-48 ... bg-[hsl(var(--bg-secondary))] dot-pattern ..."`

- [ ] **Step 3: Verify dot pattern**

Run: `npm run dev`. The Vision, Focus Areas, and People sections should have a subtle dot grid overlay visible on their backgrounds. The dots should be very faint (7% opacity) and not interfere with readability. They should look good in both light and dark mode.

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/pages/Index.tsx
git commit -m "feat: add subtle dot pattern texture to alternating sections"
```

---

## Task 10: Final Polish and Build Verification

**Files:**
- Modify: `src/pages/Index.tsx` (any cleanup)

- [ ] **Step 1: Remove unused imports from Index.tsx**

Check for any imports that are no longer used after the refactoring (e.g., if FocusCard is no longer used, remove its import). Run:

```bash
npx tsc --noEmit
```

Fix any TypeScript errors.

- [ ] **Step 2: Production build test**

Run: `npm run build`

Expected: Build completes with no errors. Fix any issues.

- [ ] **Step 3: Preview production build**

Run: `npm run preview`

Manually check:
1. Mobile nav works (resize to < 768px, tap hamburger)
2. Stats bar animates on scroll
3. Hero rotating text cycles through words
4. Software tabs switch between Imaging/LLM
5. Focus areas accordion expands/collapses
6. Spotlight cards follow cursor on tool cards
7. All sections fade in on scroll
8. Dot pattern visible on bg-secondary sections
9. Dark mode toggle works throughout
10. Favicon appears in browser tab

- [ ] **Step 4: Final commit with any cleanup**

```bash
git add -A
git commit -m "chore: final cleanup and build verification"
```
