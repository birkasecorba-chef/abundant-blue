'use client'

import { useEffect, useRef, useState } from 'react'

const JACKET_FLAT  = '/paragonsports-84684-abundant-blue-flat-4000px.jpg'
const JACKET_MODEL = '/paragonsports-84684-abundant-blue-model-4000px.jpg'

const ACCENT   = '#4A7C9B'
const BG_DEEP  = '#080c12'
const BG_CARD  = '#0d1720'
const BG_DARK  = '#070a10'

const PLATFORMS = [
  { name: 'eBay',                 regions: ['US', 'UK', 'DE', 'AU'] },
  { name: 'Poshmark',             regions: ['US'] },
  { name: 'Mercari',              regions: ['US'] },
  { name: 'Depop',                regions: ['US', 'UK'] },
  { name: 'ThredUp',              regions: ['US'] },
  { name: 'The RealReal',         regions: ['US'] },
  { name: 'GearTrade',            regions: ['US'] },
  { name: 'Switchbackr',          regions: ['US'] },
  { name: 'Vinted',               regions: ['US', 'UK', 'FR'] },
  { name: 'Vestiaire Collective', regions: ['Global'] },
  { name: 'Worn Wear',            regions: ['US'] },
  { name: 'REI Used',             regions: ['US'] },
  { name: 'Sierra Trading Post',  regions: ['US'] },
  { name: 'Google Shopping',      regions: ['US'] },
]

export default function AbundantBluePage() {
  const journeyRef  = useRef<HTMLDivElement>(null)
  const stickyRef   = useRef<HTMLDivElement>(null)
  const flatRef     = useRef<HTMLImageElement>(null)
  const modelRef    = useRef<HTMLImageElement>(null)
  const [daysSince, setDaysSince] = useState(0)

  useEffect(() => {
    const start = new Date('2026-03-04')
    setDaysSince(Math.floor((Date.now() - start.getTime()) / 86_400_000))

    let ctx: ReturnType<typeof import('gsap')['gsap']['context']> | null = null

    const init = async () => {
      const gsapMod                    = await import('gsap')
      const gsap                       = gsapMod.gsap
      const { ScrollTrigger }          = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const isMobile = window.innerWidth < 768

        // ── Scroll indicator bounce ────────────────────────────────
        gsap.to('.scroll-dot-inner', {
          y: 10,
          duration: 1.1,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })

        // ── Hero jacket idle float ─────────────────────────────────
        gsap.to('.hero-jacket-wrap', {
          y: -20,
          duration: 3.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })

        // ── Hero jacket subtle breathe ─────────────────────────────
        gsap.to('.hero-jacket-wrap', {
          scale: 1.04,
          duration: 5.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.8,
        })

        // ── Hero entrance timeline ─────────────────────────────────
        const heroTl = gsap.timeline({ delay: 0.15 })
        heroTl
          .from('.hero-jacket-wrap',  { scale: 0.82, opacity: 0, duration: 1.4, ease: 'power3.out' })
          .from('.hero-eyebrow',      { y: 20,  opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.75')
          .from('.hero-title',        { y: 50,  opacity: 0, duration: 0.95, ease: 'power3.out' }, '-=0.5')
          .from('.hero-subtitle',     { y: 24,  opacity: 0, duration: 0.65, ease: 'power3.out' }, '-=0.45')
          .from('.hero-scroll-ind',   { opacity: 0, duration: 0.45 }, '-=0.15')

        // ── Hero content fades out on scroll ──────────────────────
        gsap.to('.hero-section-content', {
          opacity: 0,
          y: -55,
          scrollTrigger: {
            trigger: '.hero-section',
            start: '18% top',
            end: '65% top',
            scrub: 1.2,
          },
        })

        // ── Hero jacket pulls back slightly on scroll ──────────────
        gsap.to('.hero-jacket-wrap', {
          y: 60,
          scale: 0.88,
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.8,
          },
        })

        // ═══════════════════════════════════════════════════════════
        //  3-D JOURNEY SECTION
        // ═══════════════════════════════════════════════════════════
        const flat  = flatRef.current
        const model = modelRef.current
        const journey = journeyRef.current

        if (!flat || !model || !journey) return

        // Set perspective on the sticky container
        if (stickyRef.current) {
          gsap.set(stickyRef.current, { perspective: 1100 })
        }

        // Initial states for scene texts (all hidden except scene 1)
        gsap.set('.j-scene-2', { opacity: 0, y: 32 })
        gsap.set('.j-scene-3', { opacity: 0, y: 32 })
        gsap.set('.j-scene-4', { opacity: 0, y: 32 })
        gsap.set('.j-scene-5', { opacity: 0, y: 32 })

        // Scale values (mobile gets gentler transforms)
        const s2 = isMobile ? 2.2  : 3.8
        const s3 = isMobile ? 1.9  : 3.1
        const s4 = isMobile ? 2.8  : 4.6
        const ry = isMobile ? 5    : 12
        const rx = isMobile ? 2    : 5

        // ── Main journey timeline ──────────────────────────────────
        // Total ~4 seconds; scrub maps this to 400vh of scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: journey,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 2.8,
          },
        })

        // ── Phase 0→1 · Scene 1 → Scene 2 (Zoom In) ──────────────
        // Jacket zooms toward viewer with slight 3D tilt
        tl
          .to(flat, {
            scale: s2,
            rotateY: ry,
            rotateX: -rx,
            duration: 1,
            ease: 'none',
          }, 0)
          // Scene 1 exit
          .to('.j-scene-1', { opacity: 0, y: -28, duration: 0.35 }, 0.5)
          // Scene 2 entrance
          .to('.j-scene-2', { opacity: 1, y: 0,  duration: 0.35 }, 0.75)

        // ── Phase 1→2 · Scene 2 → Scene 3 (Pan + swap to model) ──
        // Jacket pans left with counter-rotation, then model appears
        tl
          .to('.j-scene-2', { opacity: 0, y: -28, duration: 0.35 }, 1.45)
          .to(flat, {
            rotateY: -(ry * 1.3),
            rotateX: rx * 0.8,
            x: isMobile ? '7%' : '12%',
            scale: s3,
            duration: 1,
            ease: 'none',
          }, 1)
          // Cross-fade to model image
          .to(model, { opacity: 1, duration: 0.25, ease: 'none' }, 1.55)
          .to(flat,  { opacity: 0, duration: 0.25, ease: 'none' }, 1.55)
          // Scene 3 entrance
          .to('.j-scene-3', { opacity: 1, y: 0, duration: 0.35 }, 1.75)

        // ── Phase 2→3 · Scene 3 → Scene 4 (Detail close-up) ──────
        // Extreme zoom + pan up to collar / logo zone
        tl
          .to('.j-scene-3', { opacity: 0, y: -28, duration: 0.35 }, 2.45)
          .to(model, {
            scale: s4,
            rotateY: ry * 0.5,
            rotateX: -(rx * 1.2),
            x: 0,
            y: isMobile ? '-16%' : '-22%',
            duration: 1,
            ease: 'none',
          }, 2)
          // Scene 4 entrance
          .to('.j-scene-4', { opacity: 1, y: 0, duration: 0.35 }, 2.7)

        // ── Phase 3→4 · Scene 4 → Scene 5 (Pull back) ────────────
        // Everything returns to neutral, cross-fade back to flat
        tl
          .to('.j-scene-4', { opacity: 0, y: -28, duration: 0.35 }, 3.35)
          .to(model, {
            scale: 1,
            rotateY: 0,
            rotateX: 0,
            x: 0,
            y: 0,
            duration: 1.1,
            ease: 'none',
          }, 3)
          // Cross-fade back to flat jacket
          .to(flat,  { opacity: 1, scale: 1, rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 0.3, ease: 'none' }, 3.75)
          .to(model, { opacity: 0, duration: 0.3, ease: 'none' }, 3.75)
          // Scene 5 entrance
          .to('.j-scene-5', { opacity: 1, y: 0, duration: 0.45 }, 3.85)

        // ── Progress dots driven by scroll ────────────────────────
        const dotActivate = (active: number) => {
          for (let i = 1; i <= 5; i++) {
            const dot = document.querySelector(`.j-dot-${i}`) as HTMLElement | null
            if (dot) dot.style.background = i === active ? ACCENT : 'rgba(255,255,255,0.18)'
          }
        }

        ;[1, 2, 3, 4, 5].forEach((scene) => {
          const starts = [0, 0.2, 0.4, 0.6, 0.82]
          const ends   = [0.2, 0.4, 0.6, 0.82, 1.0]
          ScrollTrigger.create({
            trigger: journey,
            start: `${starts[scene - 1] * 100}% top`,
            end:   `${ends[scene - 1] * 100}% top`,
            onEnter:      () => dotActivate(scene),
            onEnterBack:  () => dotActivate(scene),
          })
        })

        // ══════════════════════════════════════════════════════════
        //  BELOW-JOURNEY SECTIONS (unchanged animations)
        // ══════════════════════════════════════════════════════════
        gsap.from('.stat-item', {
          y: 60, opacity: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.stats-row', start: 'top 82%' },
        })

        gsap.from('.story-left > *', {
          y: 40, opacity: 0, stagger: 0.12, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.story-grid', start: 'top 78%' },
        })

        gsap.from('.story-card', {
          x: 50, opacity: 0, stagger: 0.16, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.story-grid', start: 'top 74%' },
        })

        gsap.from('.results-header > *', {
          y: 35, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.results-section', start: 'top 80%' },
        })

        gsap.from('.status-card', {
          scale: 0.96, opacity: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.status-card', start: 'top 85%' },
        })

        gsap.from('.platform-card', {
          y: 28, opacity: 0, stagger: 0.045, duration: 0.55, ease: 'power2.out',
          scrollTrigger: { trigger: '.platforms-grid', start: 'top 80%' },
        })

        gsap.from('.footer-inner', {
          opacity: 0, duration: 0.9,
          scrollTrigger: { trigger: 'footer', start: 'top 92%' },
        })

      }) // gsap.context()
    }

    init()
    return () => { ctx?.revert() }
  }, [])

  return (
    <div style={{ background: BG_DEEP, color: 'white', overflowX: 'hidden', minHeight: '100vh' }}>

      {/* ════════════════════════════ HERO ════════════════════════════════ */}
      <section
        className="hero-section"
        style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: BG_DEEP, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {/* Dot grid texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(74,124,155,0.065) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Ambient glows */}
        <div style={{
          position: 'absolute', top: '-12%', right: '-8%',
          width: '52%', height: '68%',
          background: 'radial-gradient(ellipse, rgba(74,124,155,0.11) 0%, transparent 62%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-8%', left: '-4%',
          width: '38%', height: '48%',
          background: 'radial-gradient(ellipse, rgba(74,124,155,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* ── Hero content ── */}
        <div
          className="hero-section-content"
          style={{
            position: 'relative', zIndex: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', padding: '0 1.5rem', width: '100%',
          }}
        >
          {/* Jacket — the star of the hero */}
          <div
            className="hero-jacket-wrap"
            style={{
              position: 'relative',
              width: 'clamp(240px, 44vw, 540px)',
              marginBottom: '2.8rem',
              willChange: 'transform',
            }}
          >
            <img
              src={JACKET_FLAT}
              alt="Patagonia Down Sweater — Abundant Blue"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
            {/* Vignette — hides white product-photo background */}
            <div style={{
              position: 'absolute',
              inset: '-8%',
              background: 'radial-gradient(ellipse 48% 48% at center, transparent 48%, rgba(8,12,18,1) 74%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Text */}
          <p className="hero-eyebrow" style={{
            color: ACCENT, fontSize: '0.68rem', letterSpacing: '0.48em',
            textTransform: 'uppercase', marginBottom: '1.1rem', fontWeight: 500,
          }}>
            Patagonia Down Sweater &nbsp;·&nbsp; Women&#39;s Small &nbsp;·&nbsp; Discontinued
          </p>

          <h1 className="hero-title" style={{
            fontSize: 'clamp(2.6rem, 9vw, 6.5rem)',
            fontWeight: 800, lineHeight: 0.9,
            letterSpacing: '-0.03em', marginBottom: '1.4rem', color: 'white',
          }}>
            The Hunt for
            <br />
            <span style={{ color: ACCENT }}>Abundant Blue</span>
          </h1>

          <p className="hero-subtitle" style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
            color: 'rgba(255,255,255,0.42)', fontWeight: 300,
            maxWidth: '420px', lineHeight: 1.68,
          }}>
            One colorway. Discontinued. Searched daily across 14 resale platforms.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-ind" style={{
          position: 'absolute', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem',
          zIndex: 20,
        }}>
          <span style={{
            color: 'rgba(255,255,255,0.18)', fontSize: '0.58rem',
            letterSpacing: '0.45em', textTransform: 'uppercase',
          }}>
            Scroll
          </span>
          <div style={{
            width: '1.4rem', height: '2.4rem',
            border: '1px solid rgba(255,255,255,0.13)', borderRadius: '1rem',
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center', paddingTop: '0.35rem',
          }}>
            <div
              className="scroll-dot-inner"
              style={{
                width: '0.22rem', height: '0.5rem',
                background: 'rgba(255,255,255,0.4)', borderRadius: '0.25rem',
              }}
            />
          </div>
        </div>

        {/* Bottom gradient fade into journey */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
          background: `linear-gradient(to bottom, transparent, ${BG_DEEP})`,
          pointerEvents: 'none',
        }} />
      </section>

      {/* ══════════════════════ 3-D JOURNEY ══════════════════════════════ */}
      {/* 500 vh tall wrapper — sticky inner provides the pinned canvas    */}
      <div ref={journeyRef} style={{ height: '500vh', background: BG_DEEP }}>
        <div
          ref={stickyRef}
          style={{
            position: 'sticky', top: 0,
            height: '100vh', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* ── Image layers (stacked) ── */}
          <div style={{
            position: 'relative',
            width: 'clamp(260px, 52vw, 600px)',
            aspectRatio: '1 / 1',
            zIndex: 1,
          }}>
            {/* Flat jacket — Scene 1, 2, 5 */}
            <img
              ref={flatRef}
              src={JACKET_FLAT}
              alt="Patagonia Down Sweater Abundant Blue — flat"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'contain',
                transformOrigin: 'center center',
                willChange: 'transform, opacity',
              }}
            />
            {/* Model shot — Scene 3, 4 */}
            <img
              ref={modelRef}
              src={JACKET_MODEL}
              alt="Model wearing Patagonia Abundant Blue"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'contain',
                transformOrigin: 'center center',
                willChange: 'transform, opacity',
                opacity: 0,
              }}
            />
          </div>

          {/* Radial vignette — hides white bg, frames jacket on dark canvas */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 58% 58% at center, transparent 28%, rgba(8,12,18,0.88) 68%, rgba(8,12,18,1) 82%)',
            pointerEvents: 'none', zIndex: 2,
          }} />

          {/* Top + bottom gradient reinforcement */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(8,12,18,0.45) 0%, transparent 20%, transparent 80%, rgba(8,12,18,0.6) 100%)',
            pointerEvents: 'none', zIndex: 3,
          }} />

          {/* ── Scene 1: The Jacket (initial) ── */}
          <div className="j-scene-1" style={{
            position: 'absolute',
            bottom: '11%', left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            zIndex: 10, pointerEvents: 'none',
          }}>
            <p style={{
              color: ACCENT, fontSize: '0.62rem', letterSpacing: '0.42em',
              textTransform: 'uppercase', marginBottom: '0.7rem', fontWeight: 500,
            }}>
              01 &nbsp;—&nbsp; The Jacket
            </p>
            <h2 style={{
              fontSize: 'clamp(1.7rem, 3.2vw, 2.7rem)',
              fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05,
            }}>
              Patagonia Down Sweater
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.38)', marginTop: '0.6rem', fontSize: '0.88rem' }}>
              Abundant Blue &nbsp;·&nbsp; Women&#39;s Small &nbsp;·&nbsp; Discontinued
            </p>
          </div>

          {/* ── Scene 2: Construction — left side ── */}
          <div className="j-scene-2" style={{
            position: 'absolute',
            top: '50%',
            left: 'clamp(1.5rem, 6%, 5rem)',
            transform: 'translateY(-50%)',
            maxWidth: 'min(260px, 32vw)',
            zIndex: 10, pointerEvents: 'none',
          }}>
            <p style={{
              color: ACCENT, fontSize: '0.6rem', letterSpacing: '0.42em',
              textTransform: 'uppercase', marginBottom: '0.8rem', fontWeight: 500,
            }}>
              02 &nbsp;—&nbsp; Construction
            </p>
            <h2 style={{
              fontSize: 'clamp(1.4rem, 2.4vw, 2.1rem)',
              fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '0.85rem',
            }}>
              800-Fill
              <br />Traceable Down
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.68 }}>
              Recycled ripstop nylon shell. Polartec® Powerstretch® cuffs. Built for decades — if you can find it.
            </p>
          </div>

          {/* ── Scene 3: As Worn — right side ── */}
          <div className="j-scene-3" style={{
            position: 'absolute',
            top: '50%',
            right: 'clamp(1.5rem, 6%, 5rem)',
            transform: 'translateY(-50%)',
            maxWidth: 'min(250px, 32vw)',
            textAlign: 'right',
            zIndex: 10, pointerEvents: 'none',
          }}>
            <p style={{
              color: ACCENT, fontSize: '0.6rem', letterSpacing: '0.42em',
              textTransform: 'uppercase', marginBottom: '0.8rem', fontWeight: 500,
            }}>
              03 &nbsp;—&nbsp; As Worn
            </p>
            <h2 style={{
              fontSize: 'clamp(1.4rem, 2.4vw, 2.1rem)',
              fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '0.85rem',
            }}>
              Worn.
              <br />Remembered.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.68 }}>
              Some jackets become part of you. The color, the fit, the weight on your shoulders — irreplaceable.
            </p>
          </div>

          {/* ── Scene 4: The Colorway — bottom left with callout lines ── */}
          <div className="j-scene-4" style={{
            position: 'absolute',
            bottom: '9%',
            left: 'clamp(1.5rem, 6%, 5rem)',
            maxWidth: 'min(290px, 40vw)',
            zIndex: 10, pointerEvents: 'none',
          }}>
            <p style={{
              color: ACCENT, fontSize: '0.6rem', letterSpacing: '0.42em',
              textTransform: 'uppercase', marginBottom: '0.8rem', fontWeight: 500,
            }}>
              04 &nbsp;—&nbsp; The Colorway
            </p>
            <h2 style={{
              fontSize: 'clamp(1.4rem, 2.4vw, 2.1rem)',
              fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '0.85rem',
            }}>
              Abundant Blue
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', lineHeight: 1.68, marginBottom: '1.1rem' }}>
              A teal-blue that existed for one season. Quietly retired. Not reproduced. Not close enough to anything else.
            </p>
            {/* Detail callouts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {['Patagonia logo · Chest, center', 'Polartec® cuffs', 'Full-zip with chin guard'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <div style={{ width: '1.6rem', height: '1px', background: ACCENT, flexShrink: 0 }} />
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Scene 5: The Search ── */}
          <div className="j-scene-5" style={{
            position: 'absolute',
            bottom: '10%', left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            maxWidth: '420px',
            zIndex: 10, pointerEvents: 'none',
          }}>
            <p style={{
              color: ACCENT, fontSize: '0.6rem', letterSpacing: '0.42em',
              textTransform: 'uppercase', marginBottom: '0.8rem', fontWeight: 500,
            }}>
              05 &nbsp;—&nbsp; The Search
            </p>
            <h2 style={{
              fontSize: 'clamp(1.7rem, 3vw, 2.6rem)',
              fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: '0.75rem',
            }}>
              14 Platforms. Every Day.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', lineHeight: 1.68 }}>
              Automated. Persistent. Ready for the moment it surfaces.
            </p>
          </div>

          {/* Progress dots — right edge */}
          <div style={{
            position: 'absolute', right: '2.2%', top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', gap: '0.7rem',
            zIndex: 20,
          }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`j-dot-${n}`}
                style={{
                  width: n === 1 ? '0.32rem' : '0.28rem',
                  height: n === 1 ? '0.32rem' : '0.28rem',
                  borderRadius: '50%',
                  background: n === 1 ? ACCENT : 'rgba(255,255,255,0.18)',
                  transition: 'background 0.4s ease',
                }}
              />
            ))}
          </div>

          {/* Scene label top-right */}
          <div style={{
            position: 'absolute', top: '2rem', right: '3.5%',
            zIndex: 20, display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <div style={{
              width: '0.35rem', height: '0.35rem', borderRadius: '50%',
              background: '#4ade80', animation: 'green-pulse 2.2s ease-in-out infinite',
            }} />
            <span style={{
              color: 'rgba(255,255,255,0.22)', fontSize: '0.6rem',
              letterSpacing: '0.3em', textTransform: 'uppercase',
            }}>
              Scroll to explore
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════ STORY ══════════════════════════════ */}
      <section style={{ padding: '7rem 1.5rem', background: BG_DEEP }}>
        <div style={{ maxWidth: '75rem', margin: '0 auto' }}>

          {/* Stats */}
          <div
            className="stats-row"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              marginBottom: '6rem',
              paddingBottom: '6rem',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {[
              { value: '14',    label: 'Platforms Scanned',  color: 'white' },
              { value: 'Daily', label: 'Search Frequency',   color: ACCENT },
              { value: '0',     label: 'Matches Found',      color: 'rgba(255,255,255,0.2)' },
            ].map((s, i) => (
              <div key={i} className="stat-item" style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                  fontWeight: 800, letterSpacing: '-0.03em',
                  marginBottom: '0.5rem', color: s.color,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {s.value}
                </div>
                <div style={{
                  color: 'rgba(255,255,255,0.28)', fontSize: '0.65rem',
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Story grid */}
          <div
            className="story-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '4rem',
              alignItems: 'start',
            }}
          >
            {/* Left: Narrative */}
            <div className="story-left">
              <p style={{
                color: ACCENT, fontSize: '0.65rem', letterSpacing: '0.42em',
                textTransform: 'uppercase', marginBottom: '1.4rem', fontWeight: 500,
              }}>
                The Story
              </p>
              <h2 style={{
                fontSize: 'clamp(1.9rem, 3.5vw, 3rem)',
                fontWeight: 700, lineHeight: 1.1,
                letterSpacing: '-0.025em', marginBottom: '1.75rem',
              }}>
                Some things are worth
                <br />
                <span style={{ color: ACCENT }}>hunting for.</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.54)', fontSize: '1.05rem', lineHeight: 1.78, marginBottom: '1.25rem' }}>
                The Patagonia Down Sweater in Abundant Blue isn&#39;t just a jacket. It&#39;s a specific
                shade — a teal-blue that Patagonia produced for a limited season before quietly
                retiring the colorway.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.54)', fontSize: '1.05rem', lineHeight: 1.78, marginBottom: '1.25rem' }}>
                Women&#39;s Small. That&#39;s the exact spec. Not{' '}
                <em style={{ color: 'rgba(255,255,255,0.4)' }}>&ldquo;any blue Patagonia.&rdquo;</em>{' '}
                Not <em style={{ color: 'rgba(255,255,255,0.4)' }}>&ldquo;close enough.&rdquo;</em> The
                right jacket, the right colorway, the right size.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.54)', fontSize: '1.05rem', lineHeight: 1.78 }}>
                So we built a scanner. And we wait.
              </p>
            </div>

            {/* Right: Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  dot: ACCENT, pulse: false,
                  label: "Why It's Rare", labelColor: ACCENT,
                  text: "Abundant Blue was a seasonal colorway — here for a moment, then gone. Patagonia doesn't announce retirements. One season it's in the lineup; the next, it isn't. Secondary market listings are sparse, and most that appear are wrong sizes or worn beyond fair condition.",
                  border: 'rgba(255,255,255,0.06)',
                },
                {
                  dot: ACCENT, pulse: false,
                  label: 'The Method', labelColor: ACCENT,
                  text: "Automated daily scans across 14 platforms. Filters: exact colorway, Women's S, fair condition or better. When it surfaces — we'll know within 24 hours. No manual searching. No missed windows.",
                  border: 'rgba(255,255,255,0.06)',
                },
                {
                  dot: '#4ade80', pulse: true,
                  label: 'Search Status', labelColor: '#4ade80',
                  text: "Active. Running daily at 9:30 AM PST. No matches found yet — but patience is the whole strategy. It will appear eventually. We'll be ready.",
                  border: `rgba(74,124,155,0.18)`,
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="story-card"
                  style={{
                    background: BG_CARD,
                    border: `1px solid ${card.border}`,
                    borderRadius: '1rem',
                    padding: '1.5rem 1.625rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.9rem' }}>
                    <div
                      className={card.pulse ? 'green-dot' : ''}
                      style={{
                        width: '0.45rem', height: '0.45rem',
                        borderRadius: '50%', background: card.dot, flexShrink: 0,
                      }}
                    />
                    <span style={{
                      color: card.labelColor, fontSize: '0.62rem',
                      letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 500,
                    }}>
                      {card.label}
                    </span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.72, fontSize: '0.9rem' }}>
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ LIVE RESULTS ════════════════════════ */}
      <section className="results-section" style={{ padding: '7rem 1.5rem', background: BG_DARK }}>
        <div style={{ maxWidth: '75rem', margin: '0 auto' }}>

          <div className="results-header">
            <div style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center',
              gap: '0.875rem', marginBottom: '2.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <div className="live-dot" style={{ width: '0.45rem', height: '0.45rem', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ color: '#f87171', fontSize: '0.62rem', letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Live
                </span>
              </div>
              <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                Last scan: Today at 9:30 AM PST
              </span>
              <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                Active for {daysSince} days
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.75rem',
            }}>
              Search Results
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem', marginBottom: '3.5rem', lineHeight: 1.6 }}>
              Exact match required: Patagonia Down Sweater · Abundant Blue · Women&#39;s Small · Fair condition or better
            </p>
          </div>

          {/* Status card */}
          <div
            className="status-card"
            style={{
              textAlign: 'center', padding: '5rem 2rem',
              background: 'linear-gradient(135deg, #0d1820 0%, #0a1015 100%)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '1.5rem',
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.8rem' }}>
              No Exact Matches Found
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.33)', fontSize: '1rem',
              maxWidth: '28rem', margin: '0 auto 2.5rem', lineHeight: 1.65,
            }}>
              Scanning 14 platforms daily at 9:30 AM PST.
              <br />
              The search continues — we&#39;ll be ready when it appears.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
              {[
                { label: '● Active Search',          highlight: true },
                { label: '14 platforms monitored',   highlight: false },
                { label: '0 matches to date',        highlight: false },
              ].map((b, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.55rem 1.2rem', borderRadius: '2rem',
                  fontSize: '0.82rem', fontWeight: b.highlight ? 500 : 400,
                  border: b.highlight ? `1px solid rgba(74,124,155,0.5)` : '1px solid rgba(255,255,255,0.06)',
                  color: b.highlight ? ACCENT : 'rgba(255,255,255,0.3)',
                  background: b.highlight ? 'rgba(74,124,155,0.06)' : 'rgba(255,255,255,0.02)',
                }}>
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.1)', fontSize: '0.72rem' }}>
            Matches appear here within 24 hours of listing
          </p>
        </div>
      </section>

      {/* ════════════════════════════ PLATFORMS ══════════════════════════ */}
      <section style={{ padding: '7rem 1.5rem', background: BG_DEEP }}>
        <div style={{ maxWidth: '75rem', margin: '0 auto' }}>
          <p style={{
            color: ACCENT, fontSize: '0.65rem', letterSpacing: '0.42em',
            textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 500,
          }}>
            The Search Network
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
            14 Platforms. Every Day.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '3.5rem', fontSize: '0.88rem' }}>
            Every major resale market, checked every morning. No listing slips through.
          </p>

          <div
            className="platforms-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: '0.7rem' }}
          >
            {PLATFORMS.map((platform, i) => (
              <div
                key={platform.name}
                className="platform-card"
                style={{
                  background: BG_CARD, border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '0.875rem', padding: '1.1rem 1.25rem',
                  transition: 'border-color 0.22s ease, transform 0.22s ease', cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(74,124,155,0.45)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(255,255,255,0.05)'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.7rem' }}>
                  <div
                    className="green-dot"
                    style={{
                      width: '0.38rem', height: '0.38rem', borderRadius: '50%',
                      background: '#4ade80', animationDelay: `${(i % 7) * 0.18}s`,
                    }}
                  />
                  <span style={{ color: 'rgba(74,222,128,0.55)', fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                    Active
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.3rem' }}>
                  {platform.name}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.68rem' }}>
                  {platform.regions.join(' · ')}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '2.5rem', paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <div className="green-dot" style={{ width: '0.4rem', height: '0.4rem', borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.85rem' }}>
                All {PLATFORMS.length} platforms active
              </span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.72rem' }}>
              Next scan: Tomorrow at 9:30 AM PST
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════ FOOTER ═════════════════════════════ */}
      <footer style={{ padding: '2.5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', background: BG_DEEP }}>
        <div
          className="footer-inner"
          style={{
            maxWidth: '75rem', margin: '0 auto',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: '1rem',
          }}
        >
          <div style={{ color: 'rgba(255,255,255,0.24)', fontSize: '0.85rem' }}>
            Built by Chef 👨🏼‍🍳 for @birkasecorba
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <div className="green-dot" style={{ width: '0.38rem', height: '0.38rem', borderRadius: '50%', background: '#4ade80' }} />
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem' }}>
              Search active · 9:30 AM PST daily
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
