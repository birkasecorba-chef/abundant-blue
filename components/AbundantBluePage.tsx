'use client'

import { useEffect, useRef, useState } from 'react'

/* ─── image paths ────────────────────────────────────────── */
const IMG = {
  flat:   '/paragonsports-84684-abundant-blue-flat-4000px.jpg',
  model:  '/paragonsports-84684-abundant-blue-model-4000px.jpg',
  back:   '/paragonsports-84684-abundant-blue-back.jpg',
  alt:    '/paragonsports-84684-abundant-blue-2-2000px.jpg',
}

/* ─── types ──────────────────────────────────────────────── */
interface SearchData {
  lastUpdated: string
  searchStarted: string
  totalSearches: number
  totalPlatformsChecked: number
  exactMatches: number
  nearMatches: number
  platforms: Platform[]
  searchHistory: HistoryEntry[]
  nearMatchExamples: NearMatch[]
}
interface Platform {
  name: string; category: string; region: string
  status: string; totalListings: number; notes?: string; lastChecked?: string | null
}
interface HistoryEntry {
  date: string; platformsChecked: number; exactMatches: number
  nearMatches: number; totalListingsScanned: number
}
interface NearMatch {
  platform: string; title: string; color: string; size: string
  price: string | null; url: string; note: string
}

/* ─── counter hook ───────────────────────────────────────── */
function useCounter(target: number, active: boolean, duration = 1.8) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / (duration * 1000), 1)
      setV(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])
  return v
}

/* ─── product image with proper blending ────────────────── */
/*
 * The product JPEGs have opaque white backgrounds.
 * Trick: multiply blend mode + light-blue radial gradient behind the image.
 *   - white areas of JPG × light-blue bg = light-blue (tinted, matches jacket color)
 *   - jacket blue × light-blue bg ≈ jacket blue (slightly deeper, still reads correctly)
 *   - edges of container: bg transitions to dark page color = seamless blend
 * A dark vignette overlay on top adds the final fade to darkness at edges.
 */
function ProductImage({
  src, alt, style = {}, containerStyle = {},
}: {
  src: string; alt: string; style?: React.CSSProperties; containerStyle?: React.CSSProperties
}) {
  return (
    <div style={{
      position: 'relative',
      width: '100%', height: '100%',
      /* Light center → jacket-blue mid → dark edges — backdrop for multiply */
      background: 'radial-gradient(ellipse 72% 78% at 50% 50%, #d6eaf8 0%, #7ab5d4 18%, #2a6080 36%, #0d2133 55%, #080c12 75%)',
      ...containerStyle,
    }}>
      {/* The actual image — multiply blend removes white, jacket colors stay */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%', height: '100%',
          objectFit: 'contain',
          mixBlendMode: 'multiply',
          display: 'block',
          ...style,
        }}
      />
      {/* Dark vignette overlay: hides residual light at edges */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 54% 58% at 50% 50%, transparent 0%, transparent 20%, rgba(8,12,18,0.45) 48%, rgba(8,12,18,0.82) 65%, #080c12 82%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />
    </div>
  )
}

/* ─── stat card with counter ─────────────────────────────── */
function StatCard({ label, value, trigger }: { label: string; value: number; trigger: boolean }) {
  const count = useCounter(value, trigger)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ fontFamily: 'monospace', fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', fontWeight: 200, color: '#fff', letterSpacing: '-0.02em' }}>
        {count.toLocaleString()}
      </span>
      <span style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#4A7C9B' }}>
        {label}
      </span>
    </div>
  )
}

/* ─── spec row ───────────────────────────────────────────── */
function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4A7C9B88' }}>{k}</span>
      <span style={{ fontSize: '0.82rem', fontWeight: 300, color: '#e8e8e8' }}>{v}</span>
    </div>
  )
}

/* ─── overlay text block ─────────────────────────────────── */
function SceneText({ eyebrow, headline, sub, body }: {
  eyebrow: string; headline: string; sub: string; body?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 280 }}>
      <span style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#4A7C9B' }}>{eyebrow}</span>
      <span style={{ fontSize: 'clamp(1.6rem, 3vw, 2.8rem)', fontWeight: 200, color: '#fff', lineHeight: 1.1 }}>{headline}</span>
      <span style={{ fontSize: '0.9rem', fontWeight: 300, color: '#4A7C9B', lineHeight: 1.5 }}>{sub}</span>
      {body && <span style={{ fontSize: '0.75rem', color: '#ffffff40', lineHeight: 1.7 }}>{body}</span>}
    </div>
  )
}

/* ─── main page ──────────────────────────────────────────── */
export default function AbundantBluePage() {
  const [data, setData] = useState<SearchData | null>(null)
  const [statsVisible, setStatsVisible] = useState(false)

  /* hero */
  const heroRef      = useRef<HTMLElement>(null)
  const heroImgRef   = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLDivElement>(null)
  const heroSubRef   = useRef<HTMLDivElement>(null)
  const heroScrollRef= useRef<HTMLDivElement>(null)

  /* showcase */
  const showcaseRef  = useRef<HTMLElement>(null)
  const imgFlatRef   = useRef<HTMLDivElement>(null)
  const imgModelRef  = useRef<HTMLDivElement>(null)
  const imgBackRef   = useRef<HTMLDivElement>(null)
  const specsRef     = useRef<HTMLDivElement>(null)
  const downRef      = useRef<HTMLDivElement>(null)
  const asWornRef    = useRef<HTMLDivElement>(null)
  const backRef      = useRef<HTMLDivElement>(null)

  /* scrolling sections */
  const statsRef     = useRef<HTMLElement>(null)
  const platformsRef = useRef<HTMLDivElement>(null)
  const timelineRef  = useRef<HTMLDivElement>(null)
  const nearRef      = useRef<HTMLDivElement>(null)

  /* fetch data */
  useEffect(() => {
    fetch('/search-data.json').then(r => r.json()).then(setData).catch(console.error)
  }, [])

  /* GSAP init */
  useEffect(() => {
    let ctx: any = null
    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia()

        /* ── HERO — desktop ──────────────────────────── */
        mm.add('(min-width: 768px)', () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: '+=220%',
              pin: true,
              anticipatePin: 1,
              scrub: 1.8,
            },
          })

          /* phase 0→0.25: title fades in */
          tl.fromTo(heroTitleRef.current,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, ease: 'none', duration: 0.25 },
            0
          )
          /* jacket subtly grows */
          tl.to(heroImgRef.current, { scale: 1.18, ease: 'none', duration: 1 }, 0)

          /* phase 0.28→0.5: title fades out */
          tl.to(heroTitleRef.current, { opacity: 0, y: -24, ease: 'none', duration: 0.18 }, 0.28)

          /* phase 0.5→0.7: subtitle fades in */
          tl.fromTo(heroSubRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, ease: 'none', duration: 0.18 },
            0.52
          )
          /* jacket continues growing */
          tl.to(heroImgRef.current, { scale: 1.55, ease: 'none', duration: 0.4 }, 0.65)

          /* phase 0.75→0.9: subtitle fades out */
          tl.to(heroSubRef.current, { opacity: 0, y: -20, ease: 'none', duration: 0.14 }, 0.78)
          tl.to(heroScrollRef.current, { opacity: 0, ease: 'none', duration: 0.1 }, 0.0)
        })

        /* ── HERO — mobile ───────────────────────────── */
        mm.add('(max-width: 767px)', () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: '+=150%',
              pin: true,
              scrub: 1.2,
            },
          })
          tl.fromTo(heroTitleRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0)
          tl.to(heroTitleRef.current, { opacity: 0, duration: 0.2 }, 0.4)
          tl.fromTo(heroSubRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.55)
          tl.to(heroSubRef.current, { opacity: 0, duration: 0.15 }, 0.8)
        })

        /* ── PRODUCT SHOWCASE — desktop ─────────────── */
        mm.add('(min-width: 768px)', () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: showcaseRef.current,
              start: 'top top',
              end: '+=500%',
              pin: true,
              anticipatePin: 1,
              scrub: 1.4,
            },
          })

          /* Scene 1 (0→0.18): flat jacket + specs appear */
          tl.fromTo(specsRef.current,
            { opacity: 0, x: -50 }, { opacity: 1, x: 0, ease: 'none', duration: 0.18 }, 0)

          /* Scene 2 (0.2→0.4): specs out, jacket zooms + tilts, 800-fill text */
          tl.to(specsRef.current, { opacity: 0, x: -50, ease: 'none', duration: 0.12 }, 0.2)
          tl.to(imgFlatRef.current, { scale: 1.75, rotateY: -10, ease: 'none', duration: 0.22 }, 0.2)
          tl.fromTo(downRef.current,
            { opacity: 0, x: 55 }, { opacity: 1, x: 0, ease: 'none', duration: 0.14 }, 0.35)

          /* Scene 3 (0.45→0.62): 800-fill out, flat→model crossfade, "As Worn" */
          tl.to(downRef.current, { opacity: 0, x: 55, ease: 'none', duration: 0.1 }, 0.46)
          tl.to(imgFlatRef.current,
            { opacity: 0, scale: 1.8, rotateY: -10, ease: 'none', duration: 0.12 }, 0.48)
          tl.fromTo(imgModelRef.current,
            { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, ease: 'none', duration: 0.14 }, 0.56)
          tl.fromTo(asWornRef.current,
            { opacity: 0, x: 55 }, { opacity: 1, x: 0, ease: 'none', duration: 0.12 }, 0.67)

          /* Scene 4 (0.73→0.88): "As Worn" out, model→back crossfade, zoomed detail */
          tl.to(asWornRef.current, { opacity: 0, x: 55, ease: 'none', duration: 0.08 }, 0.74)
          tl.to(imgModelRef.current, { opacity: 0, ease: 'none', duration: 0.1 }, 0.76)
          tl.fromTo(imgBackRef.current,
            { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1.35, ease: 'none', duration: 0.12 }, 0.82)
          tl.fromTo(backRef.current,
            { opacity: 0, y: 28 }, { opacity: 1, y: 0, ease: 'none', duration: 0.1 }, 0.87)

          /* Scene 5 (0.92→1): pull back all — flat reappears at normal scale */
          tl.to(backRef.current, { opacity: 0, y: -20, ease: 'none', duration: 0.06 }, 0.93)
          tl.to(imgBackRef.current, { opacity: 0, scale: 1.35, ease: 'none', duration: 0.08 }, 0.93)
          tl.fromTo(imgFlatRef.current,
            { opacity: 0, scale: 1.8, rotateY: -10 },
            { opacity: 1, scale: 1, rotateY: 0, ease: 'none', duration: 0.1 }, 0.94)
        })

        /* ── STATS visibility ────────────────────────── */
        if (statsRef.current) {
          ScrollTrigger.create({
            trigger: statsRef.current,
            start: 'top 72%',
            onEnter: () => setStatsVisible(true),
          })
        }

        /* ── PLATFORM CARDS stagger ──────────────────── */
        if (platformsRef.current) {
          const cards = platformsRef.current.querySelectorAll('.p-card')
          if (cards.length) {
            gsap.fromTo(cards,
              { opacity: 0, y: 36 },
              {
                opacity: 1, y: 0, stagger: 0.045, ease: 'power2.out',
                scrollTrigger: { trigger: platformsRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
              }
            )
          }
        }

        /* ── TIMELINE items ──────────────────────────── */
        if (timelineRef.current) {
          gsap.fromTo(timelineRef.current.querySelectorAll('.t-item'),
            { opacity: 0, x: -28 },
            {
              opacity: 1, x: 0, stagger: 0.14, ease: 'power2.out',
              scrollTrigger: { trigger: timelineRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
            }
          )
        }

        /* ── NEAR MATCH cards ────────────────────────── */
        if (nearRef.current) {
          gsap.fromTo(nearRef.current.querySelectorAll('.n-card'),
            { opacity: 0, scale: 0.93, y: 20 },
            {
              opacity: 1, scale: 1, y: 0, stagger: 0.1, ease: 'power2.out',
              scrollTrigger: { trigger: nearRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
            }
          )
        }
      })
    }

    init()
    return () => ctx?.revert()
  }, [data])

  /* helpers */
  const daysSince = data
    ? Math.max(0, Math.floor((Date.now() - new Date(data.searchStarted).getTime()) / 86_400_000))
    : 0

  const totalScanned = data?.searchHistory?.reduce((s, h) => s + h.totalListingsScanned, 0) ?? 0

  const statusColor = (s: string) => ({
    exact_match: '#22c55e', near_match: '#f59e0b', pending: '#6b7280',
  } as any)[s] ?? '#1e3040'

  const statusLabel = (s: string) => ({
    exact_match: 'MATCH', near_match: 'CLOSE', pending: 'PENDING',
  } as any)[s] ?? 'CLEAR'

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  /* ── render ─────────────────────────────────────────── */
  return (
    <div style={{ background: '#080c12', color: '#e8e8e8', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowX: 'hidden' }}>

      {/* ══════ HERO ══════ */}
      <section ref={heroRef} style={{
        position: 'relative', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* radial page bg glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 80% at 50% 55%, #0c1e30 0%, #080c12 65%)',
          pointerEvents: 'none',
        }} />

        {/* jacket image — center stage */}
        <div ref={heroImgRef} style={{
          position: 'absolute',
          width: 'clamp(280px, 58vmin, 680px)',
          height: 'clamp(280px, 58vmin, 680px)',
          transformOrigin: 'center center',
        }}>
          <ProductImage src={IMG.flat} alt="Patagonia Down Sweater — Abundant Blue" />
        </div>

        {/* title (opacity 0 → GSAP animates it) */}
        <div ref={heroTitleRef} style={{
          position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center', zIndex: 20, opacity: 0, whiteSpace: 'nowrap',
        }}>
          <h1 style={{
            fontSize: 'clamp(1.7rem, 4.5vw, 4rem)',
            fontWeight: 200, letterSpacing: '-0.01em',
            color: '#ffffff', margin: 0,
          }}>
            The Hunt for Abundant Blue
          </h1>
        </div>

        {/* subtitle */}
        <div ref={heroSubRef} style={{
          position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center', zIndex: 20, opacity: 0,
        }}>
          <p style={{
            fontSize: 'clamp(0.72rem, 1.3vw, 0.95rem)',
            fontWeight: 300, letterSpacing: '0.16em',
            color: '#4A7C9B', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap',
          }}>
            Patagonia Down Sweater&nbsp;·&nbsp;Style 84684&nbsp;·&nbsp;Discontinued
          </p>
        </div>

        {/* scroll cue */}
        <div ref={heroScrollRef} style={{
          position: 'absolute', bottom: '5%', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          color: '#4A7C9B', opacity: 0.45, zIndex: 20,
        }}>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Scroll</span>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
            <rect x="1" y="1" width="12" height="18" rx="6" stroke="#4A7C9B" strokeWidth="1.2"/>
            <circle cx="7" cy="6" r="2" fill="#4A7C9B">
              <animate attributeName="cy" from="5" to="13" dur="1.8s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="1" to="0" dur="1.8s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>
      </section>

      {/* ══════ PRODUCT SHOWCASE ══════ */}
      <section ref={showcaseRef} style={{ position: 'relative', height: '100vh' }}>
        <div style={{
          position: 'sticky', top: 0, height: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', perspective: '1400px',
        }}>
          {/* bg */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 75% 80% at 50% 50%, #0e2032 0%, #080c12 70%)',
          }} />

          {/* product image stack — absolute center */}
          <div style={{
            position: 'absolute',
            width: 'clamp(260px, 52vmin, 620px)',
            height: 'clamp(260px, 52vmin, 620px)',
            transformStyle: 'preserve-3d',
          }}>
            {/* flat */}
            <div ref={imgFlatRef} style={{
              position: 'absolute', inset: 0,
              transformOrigin: 'center center',
            }}>
              <ProductImage src={IMG.flat} alt="Flat jacket view" />
            </div>
            {/* model */}
            <div ref={imgModelRef} style={{
              position: 'absolute', inset: 0, opacity: 0,
              transformOrigin: 'center center',
            }}>
              <ProductImage src={IMG.model} alt="Model wearing jacket" />
            </div>
            {/* back */}
            <div ref={imgBackRef} style={{
              position: 'absolute', inset: 0, opacity: 0,
              transformOrigin: 'center center',
            }}>
              <ProductImage src={IMG.back} alt="Jacket back view" />
            </div>
          </div>

          {/* Scene texts */}

          {/* Specs — left */}
          <div ref={specsRef} style={{
            position: 'absolute', left: '7vw', top: '50%', transform: 'translateY(-50%)',
            opacity: 0, zIndex: 30,
            display: 'flex', flexDirection: 'column', gap: 18,
          }}>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4A7C9B', marginBottom: 6 }}>
              Specifications
            </p>
            {[['Brand','Patagonia'],['Style','84684'],['Color','Abundant Blue'],['Code','ABDB'],
              ['Size',"Women's Small"],['Fill','800-Fill Down'],['Status','Discontinued']].map(([k,v]) => (
              <Spec key={k} k={k} v={v} />
            ))}
          </div>

          {/* 800-Fill — right */}
          <div ref={downRef} style={{
            position: 'absolute', right: '7vw', top: '50%', transform: 'translateY(-50%)',
            opacity: 0, zIndex: 30, textAlign: 'right',
          }}>
            <SceneText eyebrow="Fill Power" headline="800-Fill" sub="Traceable Down"
              body="Responsibly sourced. Ethically certified. Exceptionally warm." />
          </div>

          {/* As Worn — right */}
          <div ref={asWornRef} style={{
            position: 'absolute', right: '7vw', top: '50%', transform: 'translateY(-50%)',
            opacity: 0, zIndex: 30, textAlign: 'right',
          }}>
            <SceneText eyebrow="As Worn" headline={"Women's\nSmall"} sub="Hooded or Non-hooded"
              body="The exact size we're searching for. Somewhere out there." />
          </div>

          {/* Back view text — bottom */}
          <div ref={backRef} style={{
            position: 'absolute', bottom: '12%', left: '50%', transform: 'translateX(-50%)',
            opacity: 0, zIndex: 30, textAlign: 'center',
          }}>
            <SceneText eyebrow="Detail" headline="Back Panel" sub="Style 84684 · ABDB"
              body="Every stitch documented. Every angle considered." />
          </div>
        </div>
      </section>

      {/* ══════ THE SEARCH ══════ */}
      <section ref={statsRef} style={{ padding: '14vh 8vw', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#4A7C9B', marginBottom: 24 }}>
          The Mission
        </p>
        <h2 style={{
          fontSize: 'clamp(2.2rem, 5.5vw, 5rem)', fontWeight: 200, letterSpacing: '-0.015em',
          marginBottom: '10vh', lineHeight: 1.08,
        }}>
          Searching {data?.totalPlatformsChecked ?? 26} Platforms<br />
          <span style={{ color: '#4A7C9B' }}>Every Single Day.</span>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '5vh 5vw',
        }}>
          <StatCard label="Days Active" value={daysSince} trigger={statsVisible} />
          <StatCard label="Platforms Monitored" value={data?.totalPlatformsChecked ?? 26} trigger={statsVisible} />
          <StatCard label="Listings Scanned" value={totalScanned} trigger={statsVisible} />
          <StatCard label="Exact Matches" value={data?.exactMatches ?? 0} trigger={statsVisible} />
        </div>
      </section>

      {/* ══════ DIVIDER ══════ */}
      <hr style={{ border: 'none', height: 1, background: 'linear-gradient(90deg, transparent, #4A7C9B28, transparent)', margin: '0 8vw' }} />

      {/* ══════ PLATFORM DASHBOARD ══════ */}
      <section style={{ padding: '14vh 8vw' }}>
        <p style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#4A7C9B', marginBottom: 16 }}>
          Coverage
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)', fontWeight: 200, marginBottom: '7vh' }}>
          Platform Dashboard
        </h2>

        {data && ['retail', 'resale', 'aggregator'].map(cat => {
          const items = data.platforms.filter(p => p.category === cat)
          if (!items.length) return null
          return (
            <div key={cat} style={{ marginBottom: '5vh' }}>
              <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4A7C9B55', marginBottom: 16 }}>
                {cat}
              </p>
              <div ref={cat === 'retail' ? platformsRef : undefined}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
                {items.map(p => (
                  <div key={p.name + p.region} className="p-card" style={{
                    background: '#0c1822',
                    border: `1px solid ${p.status !== 'no_match' && p.status !== 'pending' ? '#4A7C9B33' : '#ffffff07'}`,
                    borderRadius: 10, padding: '14px 18px',
                    display: 'flex', flexDirection: 'column', gap: 10,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 300, lineHeight: 1.3 }}>{p.name}</span>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: '0.58rem', letterSpacing: '0.1em',
                        color: statusColor(p.status), whiteSpace: 'nowrap',
                      }}>
                        <span style={{
                          width: 5, height: 5, borderRadius: '50%',
                          background: statusColor(p.status), flexShrink: 0,
                        }} />
                        {statusLabel(p.status)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#ffffff30' }}>
                      <span>{p.region}</span>
                      {p.totalListings > 0 && <span>{p.totalListings.toLocaleString()} listings</span>}
                    </div>
                    {p.notes && (
                      <p style={{ fontSize: '0.68rem', color: '#4A7C9B77', margin: 0, lineHeight: 1.55 }}>{p.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* ══════ DIVIDER ══════ */}
      <hr style={{ border: 'none', height: 1, background: 'linear-gradient(90deg, transparent, #4A7C9B28, transparent)', margin: '0 8vw' }} />

      {/* ══════ SEARCH TIMELINE ══════ */}
      <section style={{ padding: '14vh 8vw', maxWidth: 760, margin: '0 auto' }}>
        <p style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#4A7C9B', marginBottom: 16 }}>
          History
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)', fontWeight: 200, marginBottom: '6vh' }}>
          Search Timeline
        </h2>

        <div ref={timelineRef} style={{ display: 'flex', flexDirection: 'column' }}>
          {(data?.searchHistory ?? []).map((entry, i, arr) => (
            <div key={entry.date} className="t-item" style={{ display: 'flex', gap: 22, paddingBottom: 36 }}>
              {/* dot + line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 9, height: 9, borderRadius: '50%', marginTop: 2,
                  background: entry.exactMatches > 0 ? '#22c55e' : entry.nearMatches > 0 ? '#f59e0b' : '#4A7C9B',
                }} />
                {i < arr.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: '#ffffff0e', marginTop: 6 }} />
                )}
              </div>
              {/* data */}
              <div style={{ paddingBottom: 4 }}>
                <p style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#4A7C9B', marginBottom: 12 }}>
                  {entry.date}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px 20px', alignItems: 'baseline' }}>
                  {[
                    [entry.platformsChecked, 'platforms checked'],
                    [entry.totalListingsScanned, 'listings scanned'],
                    [entry.nearMatches, 'near matches'],
                  ].map(([v, l]) => (
                    <>
                      <span key={String(l)+'v'} style={{
                        fontFamily: 'monospace', fontSize: '1.05rem',
                        color: l === 'near matches' && Number(v) > 0 ? '#f59e0b' : '#ffffff',
                      }}>{Number(v).toLocaleString()}</span>
                      <span key={String(l)+'l'} style={{
                        fontSize: '0.68rem', textTransform: 'uppercase',
                        letterSpacing: '0.12em', color: '#ffffff28',
                      }}>{String(l)}</span>
                    </>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ NEAR MATCHES ══════ */}
      {data?.nearMatchExamples?.length ? (
        <section style={{ padding: '14vh 8vw' }}>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: 16 }}>
            Promising Leads
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)', fontWeight: 200, marginBottom: '6vh' }}>
            Near Matches
          </h2>
          <div ref={nearRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14 }}>
            {data.nearMatchExamples.map((m, i) => (
              <a key={i} href={m.url} target="_blank" rel="noopener noreferrer"
                className="n-card"
                style={{
                  display: 'block', background: '#0c1822',
                  border: '1px solid #f59e0b1a', borderRadius: 14, padding: '22px 24px',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'border-color 0.25s, transform 0.25s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#f59e0b44'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#f59e0b1a'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f59e0b' }}>
                    {m.platform}
                  </span>
                  <span style={{ color: '#ffffff22', fontSize: '0.8rem' }}>↗</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 400, marginBottom: 10, lineHeight: 1.35, color: '#f0f0f0' }}>{m.title}</h3>
                <p style={{ fontSize: '0.78rem', color: '#4A7C9B', marginBottom: 10 }}>{m.color} · {m.size}</p>
                {m.note && <p style={{ fontSize: '0.72rem', color: '#ffffff38', lineHeight: 1.65, margin: 0 }}>{m.note}</p>}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* ══════ CLOSING VISUAL ══════ */}
      <section style={{
        padding: '16vh 8vw 12vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        background: 'radial-gradient(ellipse 65% 55% at 50% 50%, #0d1e2f 0%, #080c12 100%)',
      }}>
        <div style={{ width: 'clamp(200px, 36vmin, 440px)', height: 'clamp(200px, 36vmin, 440px)', marginBottom: '6vh' }}>
          <ProductImage src={IMG.alt} alt="Abundant Blue jacket" />
        </div>
        <p style={{
          fontSize: 'clamp(1.5rem, 3.5vw, 3rem)', fontWeight: 200,
          maxWidth: 560, lineHeight: 1.3, marginBottom: 20, color: '#ffffff',
        }}>
          Still searching.<br />
          <span style={{ color: '#4A7C9B' }}>Won&apos;t stop until we find it.</span>
        </p>
        <p style={{ fontSize: '0.78rem', color: '#4A7C9B66', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Patagonia Women&apos;s Down Sweater · Abundant Blue · Style 84684
        </p>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer style={{
        borderTop: '1px solid #ffffff08',
        padding: '5vh 8vw',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 12, textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.88rem', color: '#ffffff55' }}>
          Built by Chef 👨🏼‍🍳 for <span style={{ color: '#4A7C9B' }}>@birkasecorba</span>
        </p>
        {data && (
          <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#ffffff22' }}>
            Last updated {fmtDate(data.lastUpdated)}&nbsp;·&nbsp;{data.totalSearches} search runs
          </p>
        )}
        <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#ffffff14' }}>
          {data?.totalPlatformsChecked ?? 26} platforms · {data?.exactMatches ?? 0} exact matches · the hunt continues
        </p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400&display=swap');
        * { box-sizing: border-box; }
        h1,h2,h3,h4,h5,h6,p,span,div { margin: 0; padding: 0; }
      `}</style>
    </div>
  )
}
