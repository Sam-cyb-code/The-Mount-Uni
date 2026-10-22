# The Mount Uni — Layout Shell & Responsive Mega-Menu Architecture

A production-grade, highly responsive web application shell for premier educational institution **The Mount Uni**, featuring an Oxford blue and limestone parchment aesthetic, continuous emergency alert ticker, sticky responsive mega-menu with full-width Framer Motion Academics dropdown, tabbed dual-stream matrices, and a nested accordion mobile drawer.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural direction incorporates all preferences confirmed in Phase 1:

- **Confirmed Palette & Mood**: Oxford blue (`#0A192F` / `#0F172A`) and limestone parchment (`#FBF9F5` / `#F4EFE6`) with deep lapis highlights (`#1E3A8A` / `#2563EB`) and curatorial antique bronze rules.
- **Confirmed Senior Dual-Track Presentation**: Tabbed subject matrices comparing Cambridge International (IGCSE, O-Levels, A-Levels) against National BISE (Matriculation in Science/Arts, FSc Pre-Medical & Pre-Engineering) with syllabus breakdown, subject electives, and grading criteria.
- **Portal Integration Default**: Unified SSO institutional access gateway dialog supporting Student, Parent, Faculty, and Alumni credentials with instant role switching.

---

## 1. Overview & Core Concept

### What It Does
Provides an institutional layout shell and navigation architecture for The Mount Uni. It connects prospective students, current scholars, parents, and faculty to academic faculties, admissions dispatches, campus life, and authenticated gateways across both desktop and mobile viewports.

### Target Audience
- **Prospective Families & Candidates**: Seeking admissions criteria, curriculum comparisons (Cambridge vs. Matric/FSc), and campus tours.
- **Current Students & Parents**: Requiring immediate single-click access to term notices, LMS coursework, timetables, and fee portals.
- **Faculty & Academic Regents**: Accessing institutional governance, syllabi repositories, and research circulars.

### Key Value
- **Zero-Latency Information Discovery**: Emergency announcements marquee for real-time notices without obstructive popups.
- **Comprehensive Academic Transparency**: Instant full-width dropdown inspection of all 4 tiers (Early Years, Primary, Middle, Senior School) with dual-stream curriculum matrix details.
- **Strict Component Decoupling**: Completely modular React 18 + TypeScript architecture (`Navbar`, `MegaMenuDropdown`, `MobileDrawer`, `EmergencyTicker`, `navigationUtils`).

---

## 2. User Experience & Visual Design

### Visual Identity & Theme
- **Aesthetic Direction**: Curatorial institutional prestige — inspired by historical collegiate libraries, British and national university charters, and classical typographic rigor.
- **Color Tokens**:
  - *Primary Ground (Limestone Canvas & Warm Alabaster)*: `#FBF9F5` (Light mode base) / `#0A1120` (Oxford Midnight Dark mode canvas).
  - *Structural Surfaces (Oxford Navy & Slate)*: `#0F1E36` / `#1E293B`, bound by hairline dividers (`border-stone-300/60` and `border-slate-800`).
  - *Curatorial Accents (Deep Lapis & Antique Gold)*: Deep Lapis (`#1E3A8A` / `#2563EB`) for academic track focus, accompanied by warm amber/bronze (`#D97706` / `#F59E0B`) for heraldic crest accents.
- **Typography**:
  - *Display / Headings*: `Playfair Display` & `Cinzel` serif for institutional pedigree.
  - *Body Prose*: `Plus Jakarta Sans` for optical clarity.
  - *Metadata & Numerals*: Tabular numerals (`tabular-nums`) with subdued tracking for admissions statistics and dates.

### Component Layout & Interaction Specifications

```
+-----------------------------------------------------------------------------------------+
| [NOTICE] THE MOUNT UNI DISPATCH : Admissions Open for 2027 ... [Pause] [x]              | <- EmergencyTicker
+-----------------------------------------------------------------------------------------+
| [Crest] THE MOUNT UNI    About Us  Academics [v]  Campus Life  Admissions  News  Portals | <- Sticky Navbar
|                          ────────────────                                   [Apply 2027]|
+-----------------------------------------------------------------------------------------+
| [FULL-WIDTH MEGA-MENU DROPDOWN (<AnimatePresence>)]                                     |
|  Early Years        Primary School       Middle School       Senior School (Dual Track) |
|  - EYFS & Reggio    - Cambridge Primary  - Lower Secondary   - Cambridge IGCSE & O-Level|
|  - Sensory Atelier  - STEAM & Robotics   - Science Labs      - Cambridge Adv A-Levels   |
|  - Forest School    - Bilingual Immersion- MUN & Debate      - Matric (Science/Arts)    |
|                                                              - FSc Pre-Med & Pre-Eng    |
|  [Featured Spotlight: Atrium Library & Research Quads | Download 2026/27 Prospectus]    |
|  [Utility Bar: Cambridge vs Matric Guide | Academic Calendar | Fellowship Directory]     |
+-----------------------------------------------------------------------------------------+
```

### Mobile Responsive Drawer
- **Drawer Slide-Out**: Slides smoothly from right using Framer Motion with backdrop blur.
- **Integrated Program Search**: Live search bar to filter directly into specific subjects, O/A Levels, or Matric/FSc modules.
- **Multi-Level Nested Accordions**: First tier expands main navigation tabs; inner tier expands individual academic phases with links and badges.
- **Quick Sticky Footer**: Prominent "Apply for Admissions 2027" button and direct admissions telephone inquiry.

---

## 3. Key Product Decisions & Trade-Offs

### 1. Motion Strategy: `motion/react` (Motion v12)
- **Decision**: Utilize `motion/react` components for transitions (`AnimatePresence`, `motion.div`).
- **Why**: Ensures native React 19 compatibility without package collisions or dual-React bundle overhead.
- **Motion Budget**: Micro-interactions settle in $\le 200\text{ms}$ with cubic-bezier easing; ticker pauses gracefully on hover.

### 2. Tabbed Dual-Track Matrix Modal & Section
- **Decision**: Provide an interactive tabbed comparison matrix for the Senior School tier comparing Cambridge O/A Levels with BISE Matric/FSc.
- **Why**: Satisfies user choice in Phase 1, allowing parents and students to toggle between compulsory subjects, science/pre-med electives, examination boards, and international university placement criteria.

### 3. Strict Decoupling Contract
- **Decision**: Maintain strict file decoupling:
  - `EmergencyTicker.tsx`
  - `Navbar.tsx`
  - `MegaMenuDropdown.tsx`
  - `MobileDrawer.tsx`
  - `CurriculumMatrixModal.tsx`
  - `PortalAuthModal.tsx`
  - `navigationData.ts` & `navigationUtils.ts`

---

## 4. Technical Architecture & Data Strategy

### System & Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                          App.tsx                            │
│  (Manages layout shell, portal dialogs, & toast dispatches) │
└──────┬───────────────────────┬───────────────────────┬──────┘
       │                       │                       │
       ▼                       ▼                       ▼
┌──────────────┐      ┌─────────────────┐      ┌───────────────┐
│EmergencyTicker│     │     Navbar      │      │AcademicContinuum│
│ (Marquee loop│      │ (Sticky 3-Zone) │      │(Tabbed Matrix)│
│ & Controls)  │      └────────┬────────┘      └───────────────┘
└──────────────┘               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
     ┌──────────────────┐            ┌───────────────────┐
     │ MegaMenuDropdown │            │   MobileDrawer    │
     │  (Full-width     │            │(Nested Accordions │
     │  Academics Panel)│            │& Instant Filter)  │
     └──────────────────┘            └───────────────────┘
```

### Data Schema Mapping

```typescript
// Core Navigation Models in src/types/navigation.ts
export interface AcademicLevel {
  id: string;
  title: string;
  ageSpan: string;
  curriculumBadge: string;
  summary: string;
  keyLinks: Array<{ label: string; href: string; badge?: string }>;
  matrixData?: {
    streams: Array<{
      name: string;
      board: string;
      duration: string;
      subjects: string[];
      careerOutcomes: string;
    }>;
  };
}

export interface NavTabConfig {
  id: TabKey;
  label: string;
  href: string;
  hasDropdown?: boolean;
  featured?: FeaturedSpotlight;
  sections?: NavSection[];
}
```

### State Transitions & Handlers
- `activeTab` (Desktop): Controlled by debounced mouse hover with 180ms hysteresis, closing on Escape or outside click.
- `isDrawerOpen` (Mobile): Controlled by hamburger trigger, locks background scroll, accessible via `aria-expanded` and Escape key.
- `isPaused` (Ticker): Hover-triggered or manual button toggle.
- `activeMatrixTab` (Curriculum): Switches seamlessly between Cambridge O/A Levels and Matric/FSc Pre-Med/Pre-Eng subject matrices.

---

## 5. Visual Animation Integrations

### 1. `LaserFlow` (WebGL2 Particle Beam Shader)
- **Path**: `src/components/LaserFlow.tsx` & `src/components/LaserFlow.css`
- **Features**: Interactive WebGL2 raymarched laser beam, surface bounding box tracking via `surfaceRef={heroSurfaceRef}`, fluid dust, fog streaks, atmospheric flares, and real-time color grading picker (Sapphire Lapis, Crest Amber, Verdant Emerald, Imperial Violet).

### 2. `GradientText` (Dynamic Fluid Text Engine)
- **Path**: `src/components/GradientText.tsx` & `src/components/GradientText.css`
- **Features**: Multi-mode gradient animations (`linear`, `flow`, `conic`), pointer-following physical dampening (`followPointer`), custom angle configurations, yoyo oscillation, and glow diffusion.
- **Placements**:
  - Hero headline punchline: *"Cultivating Characters of Honor."*
  - Institutional Portals headline: *"Academic Terminals"*
  - Academics Showcase heading: *"Uncompromising Rigor"*

### 3. `GlassIcons` (WebGL2 3D Liquid Refraction Tiles)
- **Path**: `src/components/GlassIcons.tsx` & `src/components/GlassIcons.css`
- **Features**: WebGL2 normal map refraction, chromatic dispersion, 3D tilting backing plates (`tilt`, `offset`, `circle`), hover state responses (`lift`, `float`, `press`), SVG displacement map fallback, and spring physics.
- **Placements**:
  - Executive Institutional Gateways section in `Home.tsx` featuring 5 key portals:
    1. Parent Gateway (`Users`, orange)
    2. Student SIS & LMS (`GraduationCap`, blue)
    3. Faculty Regent (`BookOpen`, purple)
    4. Admissions 2027 (`Award`, teal)
    5. Alumni Network (`Compass`, indigo)
  - Interactive physics toolbar for real-time switching of plate geometry and surface response mode.

