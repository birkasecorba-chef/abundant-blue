# DESIGN.md — Abundant Blue Editorial Showcase

**Mission:** Transform this from a good showcase into a "holy shit this is cool" cinematic experience that feels like a luxury fashion editorial meets obsessive data dashboard.

---

## 1. Color System

### Core Palette

**Primary Accent:** `#6B8FBB` (Abundant Blue)
- **Usage:** CTAs, highlights, data points, progress indicators, link hovers
- **Variants:**
  - `#6B8FBB` (100% — primary accent)
  - `#6B8FBB88` (53% opacity — secondary text, borders)
  - `#6B8FBB44` (27% opacity — subtle borders, dividers)
  - `#6B8FBB22` (13% opacity — hover states, backgrounds)

**Background System:**
- **Primary BG:** `#080C12` (Deep Navy — current, keep)
- **Card BG:** `#0C1822` (Slightly lighter — current, perfect)
- **Section BG:** `#0A0F1A` (Between primary/card — for section breaks)

**Cinema Gradients:**
- **Hero Glow:** `radial-gradient(ellipse 60% 65% at 50% 50%, #0e2035 0%, #080c12 70%)`
- **Section Divider:** `radial-gradient(ellipse 80% 50% at 50% 50%, #0d1e2f 0%, #080c12 100%)`
- **Cinematic Vignette:** `radial-gradient(circle at center, transparent 40%, rgba(8,12,18,0.8) 100%)`

**Text Hierarchy:**
- **Primary Text:** `#FFFFFF` (Headlines, key data)
- **Secondary Text:** `#E8E8E8` (Body copy — current)
- **Tertiary Text:** `#FFFFFF40` (25% opacity — metadata, timestamps)
- **Data Text:** `#F8FAFC` (Stats, numbers — slightly warmer than pure white)

**Status Colors:**
- **Success/Match:** `#22C55E` (Keep current green)
- **Warning/Near:** `#F59E0B` (Keep current amber)
- **Error/None:** `#EF4444` (For zero matches)
- **Pending:** `#6B7280` (Neutral grey)

---

## 2. Typography System

### Font Pairing: Luxury Editorial

**Primary (Headlines):** Playfair Display
- **Import:** `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');`
- **Usage:** Hero titles, section headlines, dramatic emphasis
- **Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Character:** Elegant, editorial, luxury fashion vibes

**Secondary (Body/UI):** Inter (Keep current)
- **Usage:** Body text, UI elements, data labels, captions
- **Weights:** 200 (ultra-light), 300 (light), 400 (regular), 500 (medium), 600 (semibold)
- **Character:** Clean, readable, technical precision

**Data/Code:** SF Mono / Menlo (System monospace)
- **Usage:** Stats, search results, platform data, timestamps
- **Keep current implementation:** `fontFamily: 'monospace'`

### Scale & Rhythm

```css
/* Headlines (Playfair Display) */
--text-hero: clamp(3rem, 7vw, 6rem);        /* Hero titles */
--text-xl: clamp(2.5rem, 5vw, 4.5rem);      /* Section headlines */
--text-lg: clamp(1.8rem, 3.5vw, 3rem);      /* Sub-headlines */

/* Body (Inter) */
--text-base: clamp(0.9rem, 1.2vw, 1rem);    /* Primary body */
--text-sm: clamp(0.75rem, 1vw, 0.88rem);    /* Secondary body */
--text-xs: clamp(0.65rem, 0.9vw, 0.75rem);  /* Captions, metadata */

/* Letter Spacing */
--tracking-tight: -0.025em;  /* Headlines */
--tracking-normal: 0;        /* Body text */
--tracking-wide: 0.1em;      /* Labels, small text */
--tracking-wider: 0.2em;     /* Uppercase labels */
```

---

## 3. Layout Refinements

### Keep (These are perfect):
- ✅ Scroll-triggered storytelling structure
- ✅ Hero jacket zoom effect  
- ✅5-scene product showcase
- ✅ Animated stats counters
- ✅ Platform dashboard grid
- ✅ Timeline with dots
- ✅ Near-match cards
- ✅ Overall dark cinematic vibe

### Enhance:

#### Hero Section
- **Add:** Subtle background particle animation (floating specs of light)
- **Typography:** Switch hero title to Playfair Display
- **Improve:** Add "ghost" typography that appears behind the jacket during zoom
- **Mobile:** Reduce zoom intensity (1.2x instead of 1.4x)

#### Product Showcase  
- **Add:** Fabric texture overlay during "Fill Power" scene
- **Enhance:** Depth-of-field blur effect when images transition
- **Typography:** Scene labels in Playfair Display, keep descriptions in Inter
- **Mobile:** Stack text below images instead of side-by-side

#### Stats Section
- **Add:** Connecting lines between stat cards (like a constellation)
- **Enhance:** Pulse effect on "Exact Matches: 0" to emphasize the quest
- **Typography:** Numbers in monospace, labels in Inter uppercase

#### Platform Dashboard
- **Add:** Live status animations (subtle pulse for "checking now")
- **Enhance:** Hover states reveal additional metadata
- **Grouping:** Add visual separators between retail/resale/aggregator sections

#### Timeline
- **Add:** "Distance traveled" metaphor (miles of scrolling through listings)
- **Enhance:** Connection lines have gradient opacity
- **Typography:** Dates in monospace, descriptions in Inter

---

## 4. Animation Refinements

### Scroll Physics
```javascript
// Current scrub: 1.5 — perfect balance
// For mobile, reduce to scrub: 1.2

// Pin durations:
// Hero: 200% (keep)
// Showcase: 500% (keep) 
// Consider adding 300% "data dive" section
```

### Micro-interactions

**Card Hover States:**
```css
.platform-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 20px 60px rgba(107, 143, 187, 0.15);
  border-color: #6B8FBB44;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Data Counter Animations:**
- **Current:** Good 1.8s duration
- **Add:** Subtle "typewriter" effect for monospace numbers
- **Add:** Glow effect when numbers update

**Image Transitions:**
- **Add:** Magnetic cursor effect on hover (subtle pull toward center)
- **Enhance:** Edge feathering during opacity transitions

### New Animation Ideas

**"Search Beam" Effect:**
- Animated search radius expanding from jacket center during stats section
- Represents the ever-widening search across platforms

**Fabric Pattern Overlay:**
- Subtle down-fill texture animation during showcase scenes
- CSS `::before` overlay with animated background-position

---

## 5. Component Improvements

### Platform Cards

**Current Status:** Good foundation
**Enhancements:**
- **Visual hierarchy:** Platform name larger, status badge more prominent
- **Data richness:** Add "last checked" timestamps
- **Interaction:** Click to expand with search history for that platform
- **Loading states:** Subtle shimmer when status is updating

### Timeline Dots

**Current:** Basic colored dots
**Enhanced:**
```css
.timeline-dot {
  position: relative;
  width: 12px;
  height: 12px;
  border: 2px solid #6B8FBB;
  background: radial-gradient(circle, #6B8FBB 40%, transparent 40%);
}

.timeline-dot::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(107, 143, 187, 0.2);
  animation: pulse 2s infinite;
  top: -4px;
  left: -4px;
}
```

### Near-Match Cards

**Add:** Confidence score (visual bar showing how "near" the match is)
**Enhance:** Color extraction from product image as card accent
**Interaction:** Hover reveals larger product image

---

## 6. Mobile Adaptations

### Breakpoints
```css
/* Mobile First approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Hero Adaptations
- **Scroll speed:** 20% slower (scrub: 1.2)
- **Jacket size:** Min 240px, max 60vmin
- **Typography:** More aggressive clamp() scaling
- **Touch:** Add subtle "swipe up" indicator

### Showcase Adaptations  
- **Layout:** Text below images (not beside)
- **Scenes:** Reduce from 5 to 3 key scenes
- **Gestures:** Allow swipe between scenes manually
- **Performance:** Reduce animation complexity

### Dashboard Adaptations
- **Grid:** Single column below 640px
- **Cards:** Full-width with better touch targets
- **Timeline:** Horizontal scroll with snap points
- **Stats:** 2x2 grid instead of 1x4

---

## 7. New Interactive Elements

### Search Progress Visualization
**Concept:** Real-time visual of the search expanding
**Implementation:** SVG animation showing platforms being "pinged"
**Location:** Between hero and showcase

### Platform Map
**Concept:** World map showing geographic coverage  
**Visual:** Dots pulsing where platforms are checking
**Interaction:** Hover over region shows platform list

### "Hunt Intensity" Meter
**Concept:** Visual gauge showing search frequency
**Data:** Based on daily search runs
**Animation:** Fills/drains based on recent activity

### Search History Heatmap
**Concept:** Calendar-style grid showing daily search intensity
**Color:** Gradations of #6B8FBB based on activity
**Interaction:** Click day for detailed breakdown

---

## 8. Performance & Polish

### Image Optimization
- **Current PNGs:** Perfect for transparent backgrounds
- **Add:** WebP versions with fallback
- **Lazy loading:** Implement for showcase images
- **Preload:** Hero image only

### Loading States
- **Shimmer effect:** For loading platform data
- **Progressive enhancement:** Start with basic layout, enhance with animations
- **Error states:** Graceful degradation when JSON fails to load

### SEO & Accessibility
- **Alt text:** Descriptive for all jacket images
- **Focus states:** High contrast outlines using #6B8FBB
- **Motion reduction:** `@media (prefers-reduced-motion: reduce)`
- **Color contrast:** All text meets WCAG AA standards

---

## 9. Brand Assets

### OG Image Direction
**Concept:** Cinematic still of the jacket against dark background
**Composition:**
- Jacket centered, slight 3/4 angle
- Dark background with subtle #6B8FBB rim lighting
- Text overlay: "The Hunt for Abundant Blue"
- Subtitle: "Patagonia Style 84684 • Still Searching"
**Dimensions:** 1200x630px
**Typography:** Playfair Display for headline, Inter for subtitle

### Favicon System
**Primary:** Simplified jacket silhouette in #6B8FBB
**Background:** Dark #080C12
**Sizes:** 16x16, 32x32, 180x180 (Apple), 192x192 (Android)
**Format:** SVG preferred for scalability

### Loading Icon
**Concept:** Subtle "searching" animation
**Design:** Concentric circles expanding (like radar/sonar)
**Color:** #6B8FBB with opacity fade
**Duration:** 2s infinite

---

## 10. Technical Implementation Notes

### CSS Custom Properties
```css
:root {
  /* Colors */
  --accent-primary: #6B8FBB;
  --accent-secondary: #6B8FBB88;
  --accent-subtle: #6B8FBB44;
  --accent-ghost: #6B8FBB22;
  
  /* Typography */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'SF Mono', 'Menlo', monospace;
  
  /* Spacing */
  --section-padding: clamp(8vh, 12vw, 14vh) 8vw;
  --card-padding: clamp(16px, 3vw, 24px);
  
  /* Animations */
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.6, 1);
}
```

### GSAP Enhancements
```javascript
// Add magnetic cursor effect
gsap.set('.jacket-image', { transformOrigin: 'center' });

// Enhanced hover interactions
gsap.to('.platform-card', {
  y: -4,
  scale: 1.01,
  duration: 0.3,
  ease: 'power2.out',
  scrollTrigger: 'hover'
});
```

---

## Final Thoughts

This design spec builds on the already excellent foundation. The current site is 80% of the way to "holy shit this is cool" — these refinements should push it to 100%.

**Key success metrics:**
- Time on page >3 minutes
- Scroll completion >80%  
- Social sharing ("you have to see this site")
- Mobile experience feels just as cinematic

**Implementation priority:**
1. Typography update (Playfair Display)
2. Enhanced hover states & micro-interactions  
3. Mobile optimizations
4. New interactive elements
5. Brand assets (OG image, favicon)

The obsessive hunt for Abundant Blue deserves an obsessively crafted showcase. This spec should deliver exactly that.