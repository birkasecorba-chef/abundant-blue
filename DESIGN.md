# DESIGN.md — Abundant Blue: Obsessive Precision

**Vision:** If Apple designed a search interface for the world's most obsessive collector. Cinematic storytelling meets data-driven precision. Every pixel serves the hunt.

---

## 1. Color System — Corrected

### True Abundant Blue
**Primary:** `#79B2E6` (The actual color from product photography)
- **Usage:** CTAs, data highlights, brand accents, interactive elements
- **Character:** Vivid cornflower blue with subtle purple undertones

### Palette Variants
```css
:root {
  /* The True Blue */
  --abundant-primary: #79B2E6;      /* 100% - hero color */
  --abundant-soft: #79B2E6CC;       /* 80% - secondary accents */
  --abundant-border: #79B2E699;     /* 60% - borders, dividers */
  --abundant-subtle: #79B2E666;     /* 40% - subtle highlights */
  --abundant-ghost: #79B2E633;      /* 20% - hover states */
  --abundant-whisper: #79B2E61A;    /* 10% - backgrounds */
  
  /* Foundation */
  --bg-primary: #0A1B2E;            /* Deep navy - richer than before */
  --bg-card: #0F2438;               /* Warmer card background */
  --bg-section: #0C1F32;            /* Section variation */
  
  /* Cinema Gradients */
  --hero-glow: radial-gradient(ellipse 65% 70% at 50% 50%, #1a3247 0%, #0a1b2e 75%);
  --section-divide: radial-gradient(ellipse 80% 40% at 50% 50%, #1a3247 0%, #0a1b2e 100%);
  --data-spotlight: radial-gradient(circle at center, transparent 30%, rgba(10,27,46,0.9) 100%);
  
  /* Typography */
  --text-hero: #FFFFFF;
  --text-primary: #F8FAFC;
  --text-secondary: #E2E8F0;
  --text-tertiary: #94A3B8;
  --text-ghost: #475569;
  --text-data: #FFFFFF;             /* Pure white for numbers */
  --text-accent: var(--abundant-primary);
}
```

---

## 2. Typography — Editorial Luxury

### Font System
```css
/* Primary Display - Cinematic Headlines */
--font-display: 'Playfair Display', Georgia, serif;
/* Secondary UI - Precision Interface */
--font-interface: 'Inter', system-ui, sans-serif;  
/* Data/Monospace - Technical Precision */
--font-data: 'SF Mono', Menlo, 'Monaco', Consolas, monospace;
```

### Scale & Hierarchy
```css
/* Display Typography (Playfair Display) */
--text-hero: clamp(3.5rem, 8vw, 7rem);         /* Hero statements */
--text-display-xl: clamp(2.5rem, 6vw, 5rem);   /* Section headlines */
--text-display-lg: clamp(1.8rem, 4vw, 3.5rem); /* Sub-headlines */
--text-display-md: clamp(1.4rem, 3vw, 2.5rem); /* Content headlines */

/* Interface Typography (Inter) */
--text-body-lg: clamp(1rem, 1.3vw, 1.125rem);  /* Primary body */
--text-body: clamp(0.875rem, 1.1vw, 1rem);     /* Standard body */
--text-body-sm: clamp(0.75rem, 1vw, 0.875rem); /* Secondary body */
--text-label: clamp(0.65rem, 0.9vw, 0.75rem);  /* Labels, captions */

/* Data Typography (Monospace) */
--text-data-xl: clamp(3rem, 7vw, 6rem);        /* Hero stats */
--text-data-lg: clamp(2rem, 4vw, 3.5rem);      /* Primary data */
--text-data-md: clamp(1.25rem, 2.5vw, 2rem);   /* Secondary data */
--text-data-sm: clamp(0.875rem, 1.1vw, 1rem);  /* Metadata */

/* Letter Spacing & Line Height */
--tracking-tightest: -0.05em;   /* Large display */
--tracking-tight: -0.025em;     /* Headlines */
--tracking-normal: 0;           /* Body text */
--tracking-wide: 0.1em;         /* Labels */
--tracking-widest: 0.2em;       /* Uppercase labels */

--leading-tight: 1.1;           /* Headlines */
--leading-normal: 1.5;          /* Body */
--leading-relaxed: 1.7;         /* Reading text */
```

---

## 3. Layout System — Collector's Dashboard

### Layout Philosophy
**"Obsessive Precision"** — Every measurement, every spacing, every alignment reflects the meticulous nature of the hunt. Information architecture mirrors how a serious collector organizes their search.

### Grid System
```css
/* Container System */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(24px, 5vw, 64px);
}

.container-wide {
  max-width: 1400px; /* For data dashboards */
}

.container-narrow {
  max-width: 800px;  /* For reading content */
}

/* Section Spacing */
--section-padding: clamp(80px, 12vh, 160px) 0;
--section-gap: clamp(60px, 10vh, 120px);

/* Grid Layouts */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(32px, 5vw, 64px);
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: clamp(24px, 4vw, 48px);
}
```

---

## 4. Component Design — Search Interface

### Hero Section — "The Object"
**Concept:** The jacket as archaeological artifact
```css
.hero {
  height: 100vh;
  position: relative;
  background: var(--bg-primary);
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--hero-glow);
  pointer-events: none;
}

.hero-jacket {
  width: clamp(320px, 60vmin, 700px);
  height: clamp(320px, 60vmin, 700px);
  filter: 
    drop-shadow(0 25px 80px rgba(121, 178, 230, 0.15))
    drop-shadow(0 8px 32px rgba(121, 178, 230, 0.1));
  transform-origin: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-title {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 400;
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-tight);
  color: var(--text-hero);
  text-align: center;
}

.hero-subtitle {
  font-family: var(--font-interface);
  font-size: var(--text-label);
  font-weight: 300;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--abundant-primary);
}
```

### Product Showcase — "The Documentation"
**Five Cinematic Scenes:**
1. **Specifications** — Technical data overlay
2. **Fill Power** — Performance characteristics  
3. **As Worn** — Real-world context
4. **Detail Study** — Forensic examination
5. **The Search** — Transition to hunt narrative

```css
.showcase-scene {
  position: absolute;
  opacity: 0;
  transform: translateX(-40px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.showcase-scene.active {
  opacity: 1;
  transform: translateX(0);
}

.scene-label {
  font-family: var(--font-interface);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--abundant-primary);
  margin-bottom: 16px;
  display: block;
}

.scene-headline {
  font-family: var(--font-display);
  font-size: var(--text-display-md);
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.scene-description {
  font-family: var(--font-interface);
  font-size: var(--text-body);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  max-width: 300px;
}
```

### Stats Dashboard — "The Hunt Metrics"
**Data as Art:** Numbers tell the obsession story
```css
.stat-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.stat-value {
  font-family: var(--font-data);
  font-size: var(--text-data-xl);
  font-weight: 200;
  letter-spacing: var(--tracking-tight);
  color: var(--text-data);
  line-height: 0.9;
}

.stat-value.zero {
  color: #EF4444;
  position: relative;
}

.stat-value.zero::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -8px;
  right: -8px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #EF4444, transparent);
  border-radius: 1px;
}

.stat-label {
  font-family: var(--font-interface);
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--abundant-soft);
}
```

### Platform Grid — "The Network"
**Search Coverage Visualization:**
```css
.platform-card {
  background: var(--bg-card);
  border: 1px solid rgba(121, 178, 230, 0.08);
  border-radius: 12px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.platform-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    var(--abundant-primary), 
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.platform-card:hover {
  transform: translateY(-4px);
  border-color: var(--abundant-border);
  box-shadow: 0 20px 60px rgba(121, 178, 230, 0.1);
}

.platform-card:hover::before {
  transform: translateX(100%);
}

.platform-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  position: relative;
}

.status-dot.active {
  background: #22C55E;
}

.status-dot.active::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: #22C55E;
  opacity: 0.2;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.5); opacity: 0; }
}
```

### Timeline — "The Chronicle"
**Visual Search History:**
```css
.timeline-item {
  display: flex;
  gap: 24px;
  padding-bottom: 32px;
  position: relative;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--abundant-primary);
  border: 2px solid var(--bg-primary);
  position: relative;
  margin-top: 4px;
  flex-shrink: 0;
}

.timeline-dot::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: var(--abundant-whisper);
  z-index: -1;
  animation: ripple 3s infinite;
}

@keyframes ripple {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2); opacity: 0; }
}

.timeline-connector {
  position: absolute;
  left: 5px;
  top: 16px;
  bottom: -16px;
  width: 2px;
  background: linear-gradient(180deg, 
    var(--abundant-ghost) 0%, 
    transparent 100%
  );
}

.timeline-date {
  font-family: var(--font-data);
  font-size: var(--text-data-sm);
  color: var(--abundant-primary);
  margin-bottom: 8px;
}

.timeline-metrics {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.timeline-metric {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.metric-value {
  font-family: var(--font-data);
  font-size: var(--text-body-lg);
  font-weight: 500;
  color: var(--text-primary);
}

.metric-label {
  font-size: var(--text-label);
  color: var(--text-tertiary);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}
```

### Near Matches — "The Leads"
**Almost-but-not-quite discoveries:**
```css
.near-match-card {
  background: var(--bg-card);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  color: inherit;
  display: block;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.near-match-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    #F59E0B, 
    transparent
  );
}

.near-match-card:hover {
  transform: translateY(-3px);
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow: 0 16px 48px rgba(245, 158, 11, 0.1);
}

.near-match-platform {
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: #F59E0B;
  margin-bottom: 12px;
}

.near-match-title {
  font-size: var(--text-body-lg);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: var(--leading-normal);
}

.near-match-details {
  font-size: var(--text-body-sm);
  color: var(--abundant-primary);
  margin-bottom: 12px;
}

.near-match-note {
  font-size: var(--text-body-sm);
  color: var(--text-tertiary);
  line-height: var(--leading-relaxed);
  font-style: italic;
}
```

---

## 5. Animation System — Cinematic Precision

### Scroll Animations
**GSAP ScrollTrigger Configuration:**
```javascript
// Primary scroll speeds
const scrollConfig = {
  hero: { pin: '200%', scrub: 1.5 },
  showcase: { pin: '500%', scrub: 1.5 },
  stats: { trigger: 'top 75%', stagger: 0.1 },
  platforms: { trigger: 'top 80%', stagger: 0.05 },
  timeline: { trigger: 'top 75%', stagger: 0.15 },
}

// Easing functions
const ease = {
  smooth: 'power2.out',
  dramatic: 'power3.inOut',
  bounce: 'back.out(1.7)',
  precision: 'expo.inOut',
}
```

### Micro-interactions
```css
/* Hover States */
.interactive {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive:hover {
  transform: translateY(-2px);
}

/* Focus States */
.interactive:focus {
  outline: 2px solid var(--abundant-primary);
  outline-offset: 2px;
  border-radius: 8px;
}

/* Loading States */
@keyframes shimmer {
  0% { opacity: 0.6; transform: translateX(-100%); }
  100% { opacity: 1; transform: translateX(100%); }
}

.loading-shimmer {
  position: relative;
  overflow: hidden;
  background: var(--bg-card);
}

.loading-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, 
    transparent, 
    var(--abundant-whisper), 
    transparent
  );
  animation: shimmer 2s infinite;
}
```

### Data Animations
```javascript
// Counter Animation
const animateCounter = (element, target, duration = 2000) => {
  gsap.fromTo(element, 
    { innerText: 0 },
    { 
      innerText: target,
      duration: duration / 1000,
      ease: 'power2.out',
      snap: { innerText: 1 },
      onUpdate() {
        element.innerText = Math.ceil(this.targets()[0].innerText);
      }
    }
  );
};

// Stagger Reveals
const staggerReveal = (elements, config = {}) => {
  gsap.fromTo(elements, 
    { 
      opacity: 0, 
      y: 40,
      scale: 0.95 
    },
    { 
      opacity: 1, 
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      ...config
    }
  );
};
```

---

## 6. Responsive Design — Multi-Device Precision

### Breakpoint System
```css
/* Mobile-first approach */
.responsive {
  /* Mobile: Default */
}

@media (min-width: 640px) {
  /* Tablet */
  .responsive {
    --section-padding: clamp(60px, 10vh, 120px) 0;
  }
}

@media (min-width: 768px) {
  /* Tablet Large */
  .showcase-scene {
    position: absolute;
    left: 7vw;
    right: 7vw;
  }
}

@media (min-width: 1024px) {
  /* Desktop */
  .platform-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}

@media (min-width: 1280px) {
  /* Desktop Large */
  .container {
    padding: 0 64px;
  }
}

/* High DPI */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .hero-jacket {
    image-rendering: -webkit-optimize-contrast;
  }
}
```

### Mobile Adaptations
**Touch-First Interactions:**
```css
/* Touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Scroll indicators */
.scroll-hint {
  opacity: 1;
}

@media (min-width: 768px) {
  .scroll-hint {
    opacity: 0.6;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Performance & Technical

### Image Strategy
```javascript
// Image optimization
const imageConfig = {
  formats: ['avif', 'webp', 'jpg'],
  quality: 85,
  loading: 'lazy', // except hero images
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px'
};

// Critical path
const preload = [
  'jacket-flat.png',     // Hero image
  'Inter font subset',   // Critical typography
  'critical.css'         // Above-fold styles
];
```

### Loading States
```css
/* Progressive enhancement */
.no-js .advanced-animation {
  display: none;
}

.loading .content {
  opacity: 0;
}

.loaded .content {
  opacity: 1;
  transition: opacity 0.6s ease;
}

/* Error states */
.error-state {
  background: var(--bg-card);
  border: 1px dashed #EF4444;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  color: var(--text-secondary);
}
```

---

## 8. Content Architecture

### Information Hierarchy
1. **Hero** — The Object of Desire
2. **Showcase** — Technical Documentation
3. **Stats** — The Hunt Metrics
4. **Platforms** — The Search Network
5. **Timeline** — The Chronicle
6. **Near Matches** — The Leads
7. **Closing** — The Commitment

### Data Storytelling
**Narrative Arc:**
- **Setup:** This is what we're hunting for
- **Documentation:** Why it matters (technical specs)
- **Scale:** How big the search has become
- **Method:** Where we're looking
- **Progress:** What we've found so far
- **Promise:** We won't stop

---

## 9. Brand Expression

### Design Principles
1. **Obsessive Precision** — Every detail matters
2. **Cinematic Quality** — Each section is a scene
3. **Data Transparency** — Numbers tell the story
4. **Respectful Documentation** — Honoring the object
5. **Unwavering Commitment** — The hunt continues

### Visual Language
- **Clean geometry** — Nothing superfluous
- **Purposeful animation** — Movement serves narrative
- **Respectful spacing** — Let content breathe
- **Precise typography** — Every word chosen carefully
- **Honest data** — Real numbers, real progress

### Emotional Journey
1. **Wonder** — "What am I looking at?"
2. **Understanding** — "Ah, this is serious"
3. **Respect** — "This level of dedication is impressive"
4. **Investment** — "I want to see how this ends"
5. **Admiration** — "This is how you hunt for something rare"

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Color system update (`#79B2E6` everywhere)
- [ ] Typography implementation (Playfair Display)
- [ ] Grid system and spacing
- [ ] Basic component structure

### Phase 2: Animation (Week 2)  
- [ ] GSAP scroll animations
- [ ] Micro-interactions and hover states
- [ ] Loading and error states
- [ ] Performance optimization

### Phase 3: Polish (Week 3)
- [ ] Mobile responsive refinements
- [ ] Accessibility improvements
- [ ] Cross-browser testing
- [ ] Final performance audit

### Phase 4: Content (Week 4)
- [ ] Copy writing and tone refinement
- [ ] Image optimization and formats
- [ ] SEO and meta tags
- [ ] Analytics implementation

---

**The hunt for Abundant Blue deserves design as obsessive as the search itself. This spec delivers exactly that level of precision and care.**
---

## 🎮 3D & Motion Direction

### Tech Stack
```
React Three Fiber (@react-three/fiber)
Drei (@react-three/drei)
GSAP + ScrollTrigger
three.js postprocessing (bloom, vignette)
```

### Hero 3D Scene (Landing — No Scroll Required)

**Model:** Puffer jacket .glb — source from Sketchfab (search "puffer jacket" or "down jacket") or generate via Meshy.ai from reference photo
- Format: .glb (web-optimized)
- Polycount: <100k faces
- Place in: `public/models/jacket.glb`

**Camera:**
```js
position: [0, 0, 4]
fov: 45
near: 0.1, far: 100
```

**Auto-Animation (idle, no scroll):**
- Y-axis rotation: 0.003 rad/frame (slow spin, ~20s full rotation)
- Floating bob: `sin(time * 0.5) * 0.05` on Y position
- Breathing pulse: scale oscillates `1.0 → 1.02 → 1.0` over 3s

**Lighting:**
```js
// 3-point + accent
<ambientLight intensity={0.15} />
<directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
<directionalLight position={[-3, -2, 4]} intensity={0.3} color="#79B2E6" />  // Abundant Blue fill
<spotLight position={[0, 5, -5]} intensity={0.6} color="#79B2E6" angle={0.4} />  // Blue rim light
```

**Environment:**
- HDRI: "studio_small" from Polyhaven (neutral, lets accent lighting dominate)
- Background: transparent canvas over dark CSS background
- Behind model: radial gradient glow `#79B2E620` → `transparent`

**Post-processing:**
```js
<EffectComposer>
  <Bloom luminanceThreshold={0.8} intensity={0.4} radius={0.8} />
  <Vignette eskil={false} offset={0.1} darkness={0.8} />
</EffectComposer>
```

### Scroll-Driven 3D Transforms

**ScrollTrigger Master Timeline:**

| Scroll %  | 3D Action | Camera | Section |
|-----------|-----------|--------|---------|
| 0-15%     | Idle auto-rotate, floating | Front view [0,0,4] | Hero |
| 15-30%    | Stop rotation, tilt 30° right | [2, 0.5, 3] | Specifications |
| 30-45%    | Rotate to back view | [0, 0, -3] | Color Story |
| 45-55%    | Zoom into fabric (close-up) | [0.5, 0, 1.5] | Fill Power |
| 55-70%    | Scale down to 0.3, move to right | [0, 0, 4] | Search Dashboard |
| 70-85%    | Fade out model | opacity → 0 | Near Matches |
| 85-100%   | Hidden | — | Timeline / Footer |

**GSAP Config:**
```js
ScrollTrigger.create({
  trigger: '.scroll-container',
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1.5,  // smooth 1.5s lag
  onUpdate: (self) => {
    const progress = self.progress
    // Update 3D scene based on progress
    updateScene(progress)
  }
})
```

### Ambient Motion (Always Active)

**Particle System:**
- 50-80 floating particles (small circles, 1-3px)
- Color: `#79B2E6` at 10-20% opacity
- Drift: random velocity, very slow (0.1-0.3 units/s)
- Depth: spread across z: -5 to 5 for parallax feel
- Implement with R3F `<Points>` or Drei `<Sparkles>`

**Gradient Orbs:**
- 2-3 large soft gradient circles (200-400px)
- Colors: `#79B2E615`, `#79B2E610`
- CSS animation: drift slowly (60s loop), slight scale breathing
- Position: absolute, behind content, z-index: 0

**Cursor Parallax (Desktop Only):**
- Hero text layers shift 5-15px based on mouse position
- 3D model rotates ±5° based on cursor X/Y
- Easing: `lerp(current, target, 0.05)` for smooth follow

### Section Transitions

**Default transition (between all sections):**
```js
// Each section wrapper
gsap.from(section, {
  scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 20%', scrub: 0.5 },
  opacity: 0,
  y: 60,
  duration: 1
})
```

**Hero → Specs (special):**
```js
// Title splits and fades
gsap.to('.hero-title', { opacity: 0, y: -40, scale: 0.95 })
// Specs grid slides up from below
gsap.from('.specs-grid', { y: 100, opacity: 0, stagger: 0.1 })
```

**Color Story (special):**
```js
// Full-bleed color wash
gsap.to('.color-section', { backgroundColor: '#79B2E6', duration: 0.5 })
// Then fade to dark with jacket silhouette
gsap.to('.color-section', { backgroundColor: '#080c12', delay: 0.3 })
```

### Mobile Fallback

**No WebGL / Low-end devices:**
- Detect via: `typeof WebGLRenderingContext !== 'undefined'` + performance check
- Replace 3D canvas with high-res static image of jacket (use `paragonsports-84684-abundant-blue-flat-4000px.jpg`)
- Keep CSS animations (gradient orbs, fade-ins)
- Disable cursor parallax
- Simplify scroll animations to opacity + translateY only

**Mobile 3D (if capable):**
- Reduce polycount model (<50k)
- Disable post-processing (bloom, vignette)
- Reduce particles to 20
- Disable scrub animations, use waypoint triggers instead

### Performance Budget

- **LCP:** <2.5s (lazy load 3D canvas, show static image first)
- **3D Canvas:** Load after hero image visible (intersection observer)
- **Model:** Compress with `gltf-transform` or `glTF-Pipeline`
- **Textures:** WebP, max 1024x1024 for mobile, 2048x2048 desktop
- **Bundle:** Three.js tree-shake, dynamic import R3F components
- **Target:** 60fps scroll on M1 MacBook, 30fps+ on mid-range Android

