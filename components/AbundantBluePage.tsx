'use client'

import { useEffect, useRef, useState } from 'react'

/* ─── transparent PNGs (white bg removed) ─────────────── */
const IMG = {
  flat:  '/jacket-flat.png',
  model: '/jacket-model.png',
  back:  '/jacket-back.png',
  alt:   '/jacket-alt.png',
}

const ACCENT = '#6B8FBB'
const BG = '#080c12'

/* ─── types ───────────────────────────────────────────── */
interface SearchData {
  lastUpdated: string; searchStarted: string; totalSearches: number
  totalPlatformsChecked: number; exactMatches: number; nearMatches: number
  platforms: Platform[]; searchHistory: HistoryEntry[]; nearMatchExamples: NearMatch[]
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

/* ─── animated counter ────────────────────────────────── */
function useCounter(target: number, active: boolean, dur = 1.8) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / (dur * 1000), 1)
      setV(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, dur])
  return v
}

/* ═══════════════════════════════════════════════════════ */
export default function AbundantBluePage() {
  const [data, setData] = useState<SearchData | null>(null)
  const [statsVisible, setStatsVisible] = useState(false)

  // Refs
  const heroRef = useRef<HTMLElement>(null)
  const heroImgRef = useRef<HTMLImageElement>(null)
  const heroTitleRef = useRef<HTMLDivElement>(null)
  const heroSubRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)

  const showcaseRef = useRef<HTMLElement>(null)
  const scImgFlat = useRef<HTMLImageElement>(null)
  const scImgModel = useRef<HTMLImageElement>(null)
  const scImgBack = useRef<HTMLImageElement>(null)
  const scSpecs = useRef<HTMLDivElement>(null)
  const scFill = useRef<HTMLDivElement>(null)
  const scWorn = useRef<HTMLDivElement>(null)
  const scDetail = useRef<HTMLDivElement>(null)

  const statsRef = useRef<HTMLElement>(null)
  const platformRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const nearRef = useRef<HTMLDivElement>(null)

  // Fetch search data
  useEffect(() => {
    fetch('/search-data.json').then(r => r.json()).then(setData).catch(() => {})
  }, [])

  // GSAP animations
  useEffect(() => {
    let ctx: any = null
    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {

        /* ── HERO: pin + zoom jacket + reveal text ── */
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 1.5,
            anticipatePin: 1,
          },
        })
        // Jacket grows
        heroTl.to(heroImgRef.current, { scale: 1.4, duration: 1, ease: 'none' }, 0)
        // Title in
        heroTl.fromTo(heroTitleRef.current,
          { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2, ease: 'none' }, 0)
        // Title out
        heroTl.to(heroTitleRef.current,
          { opacity: 0, y: -25, duration: 0.15, ease: 'none' }, 0.3)
        // Subtitle in
        heroTl.fromTo(heroSubRef.current,
          { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.15, ease: 'none' }, 0.5)
        // Subtitle out
        heroTl.to(heroSubRef.current,
          { opacity: 0, y: -15, duration: 0.12, ease: 'none' }, 0.75)
        // Scroll cue out
        heroTl.to(scrollCueRef.current, { opacity: 0, duration: 0.08, ease: 'none' }, 0)

        /* ── SHOWCASE: pin + 5 scenes ── */
        const showTl = gsap.timeline({
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: 'top top',
            end: '+=500%',
            pin: true,
            scrub: 1.5,
            anticipatePin: 1,
          },
        })

        // Scene 1 (0–0.18): Specs slide in from left
        showTl.fromTo(scSpecs.current,
          { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.16, ease: 'none' }, 0.02)

        // Scene 2 (0.2–0.4): Specs out, jacket zooms + rotates, fill text in
        showTl.to(scSpecs.current,
          { opacity: 0, x: -60, duration: 0.1, ease: 'none' }, 0.2)
        showTl.to(scImgFlat.current,
          { scale: 2, rotateY: -12, duration: 0.2, ease: 'none' }, 0.2)
        showTl.fromTo(scFill.current,
          { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.12, ease: 'none' }, 0.35)

        // Scene 3 (0.45–0.65): Fill out, flat fades, model fades in, worn text
        showTl.to(scFill.current,
          { opacity: 0, x: 50, duration: 0.08, ease: 'none' }, 0.46)
        showTl.to(scImgFlat.current,
          { opacity: 0, scale: 2, duration: 0.1, ease: 'none' }, 0.48)
        showTl.fromTo(scImgModel.current,
          { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.12, ease: 'none' }, 0.55)
        showTl.fromTo(scWorn.current,
          { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.1, ease: 'none' }, 0.62)

        // Scene 4 (0.7–0.88): Worn out, model out, back in zoomed
        showTl.to(scWorn.current,
          { opacity: 0, x: 50, duration: 0.06, ease: 'none' }, 0.72)
        showTl.to(scImgModel.current,
          { opacity: 0, duration: 0.08, ease: 'none' }, 0.74)
        showTl.fromTo(scImgBack.current,
          { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1.6, duration: 0.12, ease: 'none' }, 0.8)
        showTl.fromTo(scDetail.current,
          { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08, ease: 'none' }, 0.86)

        // Scene 5 (0.92–1): Everything out, flat jacket returns
        showTl.to(scDetail.current, { opacity: 0, duration: 0.05, ease: 'none' }, 0.93)
        showTl.to(scImgBack.current, { opacity: 0, duration: 0.06, ease: 'none' }, 0.93)
        showTl.fromTo(scImgFlat.current,
          { opacity: 0, scale: 2, rotateY: -12 },
          { opacity: 1, scale: 1, rotateY: 0, duration: 0.08, ease: 'none' }, 0.94)

        /* ── STATS counter trigger ── */
        if (statsRef.current) {
          ScrollTrigger.create({
            trigger: statsRef.current,
            start: 'top 75%',
            onEnter: () => setStatsVisible(true),
          })
        }

        /* ── PLATFORM CARDS stagger ── */
        if (platformRef.current) {
          gsap.fromTo(platformRef.current.querySelectorAll('.p-card'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, stagger: 0.04, ease: 'power2.out', duration: 0.6,
              scrollTrigger: { trigger: platformRef.current, start: 'top 82%' } })
        }

        /* ── TIMELINE stagger ── */
        if (timelineRef.current) {
          gsap.fromTo(timelineRef.current.querySelectorAll('.t-item'),
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, stagger: 0.12, ease: 'power2.out',
              scrollTrigger: { trigger: timelineRef.current, start: 'top 80%' } })
        }

        /* ── NEAR MATCH cards ── */
        if (nearRef.current) {
          gsap.fromTo(nearRef.current.querySelectorAll('.n-card'),
            { opacity: 0, scale: 0.95, y: 15 },
            { opacity: 1, scale: 1, y: 0, stagger: 0.08, ease: 'power2.out',
              scrollTrigger: { trigger: nearRef.current, start: 'top 82%' } })
        }
      })
    }
    init()
    return () => ctx?.revert()
  }, [data])

  // Computed values
  const daysSince = data
    ? Math.max(1, Math.floor((Date.now() - new Date(data.searchStarted).getTime()) / 86_400_000))
    : 1
  const totalScanned = data?.searchHistory?.reduce((s, h) => s + h.totalListingsScanned, 0) ?? 0

  const statusDot = (s: string) =>
    s === 'exact_match' ? '#22c55e' : s === 'near_match' ? '#f59e0b' : s === 'pending' ? '#6b7280' : '#1e3a4f'
  const statusText = (s: string) =>
    s === 'exact_match' ? 'MATCH' : s === 'near_match' ? 'CLOSE' : s === 'pending' ? 'PENDING' : 'CLEAR'

  /* ═════ RENDER ═════ */
  return (
    <div style={{ background: BG, color: '#e8e8e8', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════
          PHASE 1: HERO — Jacket on dark bg
          ══════════════════════════════════════════════ */}
      <section ref={heroRef} style={{
        position: 'relative', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', background: BG,
      }}>
        {/* Subtle radial glow behind jacket */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 60% 65% at 50% 50%, #0e2035 0%, ${BG} 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Jacket image — transparent PNG, no blend mode needed */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={heroImgRef}
          src={IMG.flat}
          alt="Patagonia Down Sweater — Abundant Blue"
          style={{
            position: 'relative', zIndex: 5,
            width: 'clamp(280px, 55vmin, 620px)',
            height: 'clamp(280px, 55vmin, 620px)',
            objectFit: 'contain',
            transformOrigin: 'center center',
            filter: 'drop-shadow(0 20px 60px rgba(74, 124, 155, 0.15))',
          }}
        />

        {/* Title */}
        <div ref={heroTitleRef} style={{
          position: 'absolute', top: '15%', left: 0, right: 0,
          textAlign: 'center', zIndex: 20, opacity: 0,
        }}>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4.5vw, 4.2rem)',
            fontWeight: 200, letterSpacing: '-0.02em', color: '#fff', margin: 0,
          }}>
            The Hunt for Abundant Blue
          </h1>
        </div>

        {/* Subtitle */}
        <div ref={heroSubRef} style={{
          position: 'absolute', bottom: '18%', left: 0, right: 0,
          textAlign: 'center', zIndex: 20, opacity: 0,
        }}>
          <p style={{
            fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)',
            fontWeight: 300, letterSpacing: '0.18em',
            color: ACCENT, textTransform: 'uppercase', margin: 0,
          }}>
            Patagonia Down Sweater&ensp;·&ensp;Style 84684&ensp;·&ensp;Discontinued
          </p>
        </div>

        {/* Scroll indicator */}
        <div ref={scrollCueRef} style={{
          position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          color: ACCENT, opacity: 0.4, zIndex: 20,
        }}>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
            <rect x="1" y="1" width="12" height="18" rx="6" stroke={ACCENT} strokeWidth="1.2"/>
            <circle cx="7" cy="6" r="2" fill={ACCENT}>
              <animate attributeName="cy" from="5" to="13" dur="1.8s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="1" to="0" dur="1.8s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PHASE 2: PRODUCT SHOWCASE — 5 pinned scroll scenes
          ══════════════════════════════════════════════ */}
      <section ref={showcaseRef} style={{
        position: 'relative', height: '100vh',
        background: BG, overflow: 'hidden',
      }}>
        <div style={{
          position: 'relative', width: '100%', height: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Radial glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse 65% 70% at 50% 50%, #0e2035 0%, ${BG} 70%)`,
          }} />

          {/* Image stack */}
          <div style={{
            position: 'relative', zIndex: 5,
            width: 'clamp(240px, 48vmin, 560px)',
            height: 'clamp(240px, 48vmin, 560px)',
            perspective: '1400px',
          }}>
            {/* Flat */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={scImgFlat} src={IMG.flat} alt="Jacket flat"
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'contain', transformOrigin: 'center center',
                filter: 'drop-shadow(0 15px 50px rgba(74,124,155,0.12))',
              }} />
            {/* Model */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={scImgModel} src={IMG.model} alt="Model wearing jacket"
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'contain', opacity: 0, transformOrigin: 'center center',
                filter: 'drop-shadow(0 15px 50px rgba(74,124,155,0.12))',
              }} />
            {/* Back */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={scImgBack} src={IMG.back} alt="Jacket back"
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'contain', opacity: 0, transformOrigin: 'center center',
                filter: 'drop-shadow(0 15px 50px rgba(74,124,155,0.12))',
              }} />
          </div>

          {/* Scene text: Specs */}
          <div ref={scSpecs} style={{
            position: 'absolute', left: '7vw', top: '50%', transform: 'translateY(-50%)',
            opacity: 0, zIndex: 30, display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT }}>Specifications</span>
            {[['Brand','Patagonia'],['Style','84684'],['Color','Abundant Blue'],['Code','ABDB'],
              ['Size',"Women's Small"],['Fill','800-Fill Down'],['Status','Discontinued']].map(([k,v]) => (
              <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: `${ACCENT}66` }}>{k}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 300 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Scene text: Fill */}
          <div ref={scFill} style={{
            position: 'absolute', right: '7vw', top: '50%', transform: 'translateY(-50%)',
            opacity: 0, zIndex: 30, textAlign: 'right', maxWidth: 280,
          }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, display: 'block', marginBottom: 12 }}>Fill Power</span>
            <span style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)', fontWeight: 200, display: 'block', marginBottom: 8 }}>800-Fill</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 300, color: ACCENT, display: 'block', marginBottom: 8 }}>Traceable Down</span>
            <span style={{ fontSize: '0.75rem', color: '#ffffff40', lineHeight: 1.7 }}>Responsibly sourced. Ethically certified. Exceptionally warm.</span>
          </div>

          {/* Scene text: As Worn */}
          <div ref={scWorn} style={{
            position: 'absolute', right: '7vw', top: '50%', transform: 'translateY(-50%)',
            opacity: 0, zIndex: 30, textAlign: 'right', maxWidth: 280,
          }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, display: 'block', marginBottom: 12 }}>As Worn</span>
            <span style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)', fontWeight: 200, display: 'block', marginBottom: 8 }}>Women&apos;s Small</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 300, color: ACCENT, display: 'block', marginBottom: 8 }}>Hooded or Non-hooded</span>
            <span style={{ fontSize: '0.75rem', color: '#ffffff40', lineHeight: 1.7 }}>The exact size. The exact color. Somewhere.</span>
          </div>

          {/* Scene text: Detail */}
          <div ref={scDetail} style={{
            position: 'absolute', bottom: '12%', left: '50%', transform: 'translateX(-50%)',
            opacity: 0, zIndex: 30, textAlign: 'center', maxWidth: 320,
          }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, display: 'block', marginBottom: 12 }}>Detail</span>
            <span style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', fontWeight: 200, display: 'block', marginBottom: 8 }}>Every Angle</span>
            <span style={{ fontSize: '0.75rem', color: '#ffffff40', lineHeight: 1.7 }}>Style 84684 · ABDB · Documented from every perspective.</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PHASE 3: INFOGRAPHICS / DASHBOARD
          ══════════════════════════════════════════════ */}

      {/* ── Stats Section ── */}
      <section ref={statsRef} style={{ padding: '14vh 8vw', maxWidth: 1100, margin: '0 auto' }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, display: 'block', marginBottom: 20 }}>
          The Mission
        </span>
        <h2 style={{
          fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', fontWeight: 200,
          letterSpacing: '-0.015em', marginBottom: '10vh', lineHeight: 1.08,
        }}>
          Searching {data?.totalPlatformsChecked ?? 26} Platforms<br/>
          <span style={{ color: ACCENT }}>Every Single Day.</span>
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '5vh 4vw',
        }}>
          {[
            ['Days Active', daysSince],
            ['Platforms', data?.totalPlatformsChecked ?? 26],
            ['Listings Scanned', totalScanned],
            ['Exact Matches', data?.exactMatches ?? 0],
          ].map(([label, value]) => {
            const count = useCounter(Number(value), statsVisible)
            const isMatch = label === 'Exact Matches'
            return (
              <div key={String(label)} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  fontWeight: 200,
                  color: isMatch && count === 0 ? '#ef4444' : '#fff',
                  letterSpacing: '-0.02em',
                }}>{count}</span>
                <span style={{
                  fontSize: '0.65rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: `${ACCENT}88`,
                }}>{String(label)}</span>
              </div>
            )
          })}
        </div>
      </section>

      <hr style={{ border: 'none', height: 1, background: `linear-gradient(90deg, transparent, ${ACCENT}28, transparent)`, margin: '0 8vw' }} />

      {/* ── Platform Dashboard ── */}
      <section style={{ padding: '14vh 8vw' }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, display: 'block', marginBottom: 14 }}>
          Coverage
        </span>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 200, marginBottom: '6vh' }}>
          Platform Dashboard
        </h2>

        {data && (['retail', 'resale', 'aggregator'] as const).map(cat => {
          const items = data.platforms.filter(p => p.category === cat)
          if (!items.length) return null
          return (
            <div key={cat} style={{ marginBottom: '5vh' }}>
              <span style={{
                fontSize: '0.58rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: `${ACCENT}44`, display: 'block', marginBottom: 14,
              }}>{cat}</span>
              <div ref={cat === 'retail' ? platformRef : undefined}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
                {items.map(p => (
                  <div key={p.name} className="p-card" style={{
                    background: '#0c1822', borderRadius: 10, padding: '14px 18px',
                    border: `1px solid ${p.status === 'near_match' ? `${ACCENT}33` : '#ffffff07'}`,
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 300 }}>{p.name}</span>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: '0.55rem', letterSpacing: '0.1em', color: statusDot(p.status),
                      }}>
                        <span style={{
                          width: 5, height: 5, borderRadius: '50%',
                          background: statusDot(p.status),
                        }} />
                        {statusText(p.status)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#ffffff25' }}>
                      <span>{p.region}</span>
                      {p.totalListings > 0 && <span>{p.totalListings} listings</span>}
                    </div>
                    {p.notes && <p style={{ fontSize: '0.65rem', color: `${ACCENT}66`, margin: 0, lineHeight: 1.5 }}>{p.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      <hr style={{ border: 'none', height: 1, background: `linear-gradient(90deg, transparent, ${ACCENT}28, transparent)`, margin: '0 8vw' }} />

      {/* ── Search Timeline ── */}
      <section style={{ padding: '14vh 8vw', maxWidth: 760, margin: '0 auto' }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, display: 'block', marginBottom: 14 }}>
          History
        </span>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 200, marginBottom: '6vh' }}>
          Search Timeline
        </h2>
        <div ref={timelineRef}>
          {(data?.searchHistory ?? []).map((entry, i, arr) => (
            <div key={entry.date} className="t-item" style={{
              display: 'flex', gap: 20, paddingBottom: 32,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', marginTop: 3,
                  background: entry.nearMatches > 0 ? '#f59e0b' : ACCENT,
                }} />
                {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: '#ffffff0d', marginTop: 6 }} />}
              </div>
              <div>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: ACCENT, display: 'block', marginBottom: 10 }}>
                  Day {i + 1} — {entry.date}
                </span>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  {[
                    [entry.platformsChecked, 'platforms'],
                    [entry.totalListingsScanned, 'scanned'],
                    [entry.nearMatches, 'near matches'],
                  ].map(([v, l]) => (
                    <div key={String(l)} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{
                        fontFamily: 'monospace', fontSize: '1rem',
                        color: l === 'near matches' && Number(v) > 0 ? '#f59e0b' : '#fff',
                      }}>{Number(v).toLocaleString()}</span>
                      <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ffffff25' }}>{String(l)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Near Matches ── */}
      {data?.nearMatchExamples?.length ? (
        <>
          <hr style={{ border: 'none', height: 1, background: `linear-gradient(90deg, transparent, #f59e0b28, transparent)`, margin: '0 8vw' }} />
          <section style={{ padding: '14vh 8vw' }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f59e0b', display: 'block', marginBottom: 14 }}>
              Promising Leads
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 200, marginBottom: '6vh' }}>
              Near Matches
            </h2>
            <div ref={nearRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {data.nearMatchExamples.map((m, i) => (
                <a key={i} href={m.url} target="_blank" rel="noopener noreferrer"
                  className="n-card" style={{
                    display: 'block', background: '#0c1822',
                    border: '1px solid #f59e0b18', borderRadius: 12, padding: '20px 22px',
                    textDecoration: 'none', color: 'inherit',
                    transition: 'border-color 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f59e0b44'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f59e0b18'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f59e0b' }}>{m.platform}</span>
                    <span style={{ color: '#ffffff20', fontSize: '0.8rem' }}>↗</span>
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 400, display: 'block', marginBottom: 8, color: '#f0f0f0' }}>{m.title}</span>
                  <span style={{ fontSize: '0.75rem', color: ACCENT, display: 'block', marginBottom: 8 }}>{m.color} · {m.size}</span>
                  {m.note && <span style={{ fontSize: '0.7rem', color: '#ffffff35', lineHeight: 1.6 }}>{m.note}</span>}
                </a>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {/* ── Closing ── */}
      <section style={{
        padding: '16vh 8vw 12vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        background: `radial-gradient(ellipse 60% 50% at 50% 50%, #0d1e2f 0%, ${BG} 100%)`,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.alt} alt="Abundant Blue" style={{
          width: 'clamp(180px, 30vmin, 380px)', height: 'clamp(180px, 30vmin, 380px)',
          objectFit: 'contain', marginBottom: '5vh',
          filter: 'drop-shadow(0 15px 40px rgba(74,124,155,0.1))',
        }} />
        <p style={{
          fontSize: 'clamp(1.5rem, 3.5vw, 3rem)', fontWeight: 200,
          maxWidth: 520, lineHeight: 1.3, marginBottom: 16,
        }}>
          Still searching.<br/><span style={{ color: ACCENT }}>Won&apos;t stop until we find it.</span>
        </p>
        <p style={{ fontSize: '0.75rem', color: `${ACCENT}55`, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Patagonia Women&apos;s Down Sweater · Abundant Blue · Style 84684
        </p>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid #ffffff08', padding: '4vh 8vw',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.85rem', color: '#ffffff50' }}>
          Built by Chef 👨🏼‍🍳 for <span style={{ color: ACCENT }}>@birkasecorba</span>
        </p>
        {data && (
          <p style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#ffffff20' }}>
            Last updated {new Date(data.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            &ensp;·&ensp;{data.totalSearches} search runs
          </p>
        )}
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
      `}</style>
    </div>
  )
}
