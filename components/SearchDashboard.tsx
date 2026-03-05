'use client'

import { useEffect, useRef, useState } from 'react'

// ── Design tokens (match existing site) ─────────────────────────────────
const ACCENT  = '#4A7C9B'
const BG_DEEP = '#080c12'
const BG_CARD = '#0d1720'
const BG_DARK = '#070a10'

// ── Types ────────────────────────────────────────────────────────────────
type PlatformStatus = 'no_match' | 'near_match' | 'exact_match' | 'pending'

interface Platform {
  name: string
  category: 'retail' | 'resale' | 'aggregator'
  region: string
  url: string
  lastChecked: string | null
  status: PlatformStatus
  totalListings: number
  notes?: string
}

interface SearchHistoryEntry {
  date: string
  platformsChecked: number
  exactMatches: number
  nearMatches: number
  totalListingsScanned: number
}

interface NearMatch {
  platform: string
  title: string
  color: string
  size: string
  price: number | null
  url: string
  note: string
}

interface SearchData {
  lastUpdated: string
  searchStarted: string
  totalSearches: number
  totalPlatformsChecked: number
  exactMatches: number
  nearMatches: number
  platforms: Platform[]
  searchHistory: SearchHistoryEntry[]
  nearMatchExamples: NearMatch[]
}

// ── Helpers ──────────────────────────────────────────────────────────────
function relativeTime(iso: string | null): string {
  if (!iso) return 'never'
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor(diff / 60_000)
  if (h > 24) return `${Math.floor(h / 24)}d ago`
  if (h > 0) return `${h}h ago`
  if (m > 0) return `${m}m ago`
  return 'just now'
}

function statusConfig(status: PlatformStatus): { color: string; label: string; borderColor: string } {
  switch (status) {
    case 'exact_match': return { color: '#4ade80', label: 'Match!',   borderColor: 'rgba(74,222,128,0.35)' }
    case 'near_match':  return { color: '#fbbf24', label: 'Near',     borderColor: 'rgba(251,191,36,0.25)' }
    case 'no_match':    return { color: '#ef4444', label: 'None',     borderColor: 'rgba(255,255,255,0.05)' }
    case 'pending':     return { color: 'rgba(255,255,255,0.3)', label: 'Pending', borderColor: 'rgba(255,255,255,0.05)' }
  }
}

function sortPlatforms(platforms: Platform[]): Platform[] {
  const sOrd: Record<PlatformStatus, number> = { exact_match: 0, near_match: 1, pending: 2, no_match: 3 }
  const cOrd: Record<string, number> = { retail: 0, resale: 1, aggregator: 2 }
  return [...platforms].sort((a, b) => {
    const cd = (cOrd[a.category] ?? 3) - (cOrd[b.category] ?? 3)
    if (cd !== 0) return cd
    return sOrd[a.status] - sOrd[b.status]
  })
}

const REGION_META: Record<string, { label: string; flag: string; color: string }> = {
  US:     { label: 'United States',   flag: '🇺🇸', color: '#4A7C9B' },
  UK:     { label: 'United Kingdom',  flag: '🇬🇧', color: '#6B8CAB' },
  FR:     { label: 'France',          flag: '🇫🇷', color: '#5A7CB0' },
  DE:     { label: 'Germany',         flag: '🇩🇪', color: '#7080A0' },
  AU:     { label: 'Australia',       flag: '🇦🇺', color: '#5090A0' },
  EU:     { label: 'Europe',          flag: '🇪🇺', color: '#6080B0' },
  Global: { label: 'Global',          flag: '🌐',  color: '#8080C0' },
}

// ── Component ────────────────────────────────────────────────────────────
export default function SearchDashboard() {
  const [data, setData] = useState<SearchData | null>(null)
  const dashRef  = useRef<HTMLDivElement>(null)
  const statRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null, null])

  // Fetch live data
  useEffect(() => {
    fetch('/search-data.json')
      .then(r => r.json())
      .then((d: SearchData) => setData(d))
      .catch(console.error)
  }, [])

  // GSAP animations — run after data is ready
  useEffect(() => {
    if (!data) return
    let ctx: { revert: () => void } | null = null

    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // ── Animated counters ────────────────────────────────────────
        const maxListings = Math.max(...data.searchHistory.map(h => h.totalListingsScanned), 0)
        const targets = [
          { idx: 0, end: data.totalPlatformsChecked, suffix: '' },
          { idx: 1, end: maxListings,                suffix: '+' },
          { idx: 2, end: data.totalSearches,         suffix: '' },
          { idx: 3, end: data.exactMatches,          suffix: '' },
        ]
        targets.forEach(({ idx, end, suffix }) => {
          const el = statRefs.current[idx]
          if (!el) return
          const obj = { val: 0 }
          gsap.to(obj, {
            val: end,
            duration: 2.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate() { el.textContent = Math.round(obj.val) + suffix },
          })
        })

        // ── Section reveals ──────────────────────────────────────────
        gsap.from('.dash-header', {
          y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.dash-stats-section', start: 'top 85%' },
        })
        gsap.from('.stat-counter-card', {
          y: 40, opacity: 0, stagger: 0.1, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: '.stat-counters-grid', start: 'top 85%' },
        })
        gsap.from('.region-card', {
          y: 30, opacity: 0, stagger: 0.07, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: '.regions-grid', start: 'top 85%' },
        })
        gsap.from('.platform-status-card', {
          y: 18, opacity: 0, stagger: 0.03, duration: 0.45, ease: 'power2.out',
          scrollTrigger: { trigger: '.platform-status-grid', start: 'top 85%' },
        })
        gsap.from('.timeline-node', {
          x: -28, opacity: 0, stagger: 0.18, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: '.search-timeline-section', start: 'top 85%' },
        })
        gsap.from('.near-match-card', {
          y: 28, opacity: 0, stagger: 0.09, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: '.near-matches-section', start: 'top 85%' },
        })
      }, dashRef)
    }

    init()
    return () => { ctx?.revert() }
  }, [data])

  // Loading shimmer
  if (!data) {
    return (
      <div style={{ background: BG_DARK, padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '0.45rem', height: '0.45rem', borderRadius: '50%', background: ACCENT, animation: 'green-pulse 1.4s infinite' }} />
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            Loading mission data
          </span>
        </div>
      </div>
    )
  }

  // Derived values
  const sorted     = sortPlatforms(data.platforms)
  const maxScanned = Math.max(...data.searchHistory.map(h => h.totalListingsScanned), 1)

  const regionCounts: Record<string, { total: number; near: number; exact: number }> = {}
  data.platforms.forEach(p => {
    if (!regionCounts[p.region]) regionCounts[p.region] = { total: 0, near: 0, exact: 0 }
    regionCounts[p.region].total++
    if (p.status === 'near_match')  regionCounts[p.region].near++
    if (p.status === 'exact_match') regionCounts[p.region].exact++
  })

  const lastUpdated = new Date(data.lastUpdated)
  const lastUpdatedStr = lastUpdated.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short',
  })

  const nearCount  = data.platforms.filter(p => p.status === 'near_match').length
  const noMatch    = data.platforms.filter(p => p.status === 'no_match').length
  const pending    = data.platforms.filter(p => p.status === 'pending').length

  return (
    <div ref={dashRef}>

      {/* ═══════════════════ 1. LIVE STATS DASHBOARD ════════════════════ */}
      <section
        className="dash-stats-section"
        style={{ padding: '6rem 1.5rem 5rem', background: BG_DARK, position: 'relative', overflow: 'hidden' }}
      >
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(74,124,155,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,124,155,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
        }} />
        {/* Scanlines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
        }} />

        <div style={{ maxWidth: '75rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div className="dash-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', marginBottom: '3.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[ACCENT, ACCENT, '#4ade80'].map((c, i) => (
                    <div key={i} style={{ width: '0.3rem', height: '0.3rem', borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <span style={{ color: ACCENT, fontSize: '0.6rem', letterSpacing: '0.45em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Mission Control
                </span>
              </div>
              <h2 className="dash-header" style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.9rem)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
                Search Dashboard
              </h2>
              <p className="dash-header" style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.82rem', marginTop: '0.4rem' }}>
                Real-time search intelligence · Abundant Blue colorway hunt
              </p>
            </div>
            <div style={{
              padding: '0.55rem 1.1rem', borderRadius: '0.6rem',
              background: 'rgba(74,124,155,0.07)', border: '1px solid rgba(74,124,155,0.18)',
              fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace',
              letterSpacing: '0.04em',
            }}>
              ⏱ Updated {lastUpdatedStr}
            </div>
          </div>

          {/* Stat counter cards */}
          <div className="stat-counters-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {([
              {
                label: 'Platforms Monitored',
                sub: 'retail · resale · aggregator',
                accent: ACCENT,
                isMatches: false,
              },
              {
                label: 'Listings Scanned',
                sub: 'across all platforms to date',
                accent: 'rgba(255,255,255,0.88)',
                isMatches: false,
              },
              {
                label: 'Days Active',
                sub: `searching since ${new Date(data.searchStarted).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
                accent: ACCENT,
                isMatches: false,
              },
              {
                label: 'Exact Matches',
                sub: data.exactMatches === 0 ? 'still hunting...' : '✓ FOUND!',
                accent: data.exactMatches === 0 ? '#ef4444' : '#4ade80',
                isMatches: true,
              },
            ] as const).map((s, i) => (
              <div
                key={i}
                className="stat-counter-card"
                style={{
                  background: BG_CARD,
                  border: `1px solid ${s.isMatches
                    ? (data.exactMatches > 0 ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.2)')
                    : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '1.25rem',
                  padding: '2rem 1.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow for exact matches card */}
                {s.isMatches && (
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: `radial-gradient(ellipse 80% 60% at 70% 30%, ${data.exactMatches > 0 ? 'rgba(74,222,128,0.07)' : 'rgba(239,68,68,0.06)'} 0%, transparent 70%)`,
                  }} />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.8rem' }}>
                  {s.isMatches && (
                    <div style={{
                      width: '0.42rem', height: '0.42rem', borderRadius: '50%',
                      background: s.accent,
                      animation: 'dash-pulse 1.8s ease-in-out infinite',
                    }} />
                  )}
                  <span style={{
                    color: 'rgba(255,255,255,0.28)', fontSize: '0.58rem',
                    letterSpacing: '0.32em', textTransform: 'uppercase',
                  }}>
                    {s.label}
                  </span>
                </div>

                <span
                  ref={el => { statRefs.current[i] = el }}
                  style={{
                    display: 'block',
                    fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: s.accent,
                  }}
                >
                  0
                </span>

                <div style={{ marginTop: '0.7rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ 2. REGION COVERAGE ═══════════════════════ */}
      <section style={{ padding: '5rem 1.5rem 4rem', background: BG_DEEP, position: 'relative', overflow: 'hidden' }}>
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(74,124,155,0.055) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        <div style={{ maxWidth: '75rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="dash-header" style={{ marginBottom: '3rem' }}>
            <p style={{ color: ACCENT, fontSize: '0.6rem', letterSpacing: '0.44em', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: 500 }}>
              Geographic Coverage
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.025em' }}>
              Global Search Network
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.85rem', marginTop: '0.45rem' }}>
              {data.totalPlatformsChecked} platforms · {Object.keys(regionCounts).length} regions
            </p>
          </div>

          <div className="regions-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: '0.875rem',
          }}>
            {Object.entries(regionCounts)
              .sort(([, a], [, b]) => b.total - a.total)
              .map(([region, counts]) => {
                const meta = REGION_META[region] ?? { label: region, flag: '🌍', color: ACCENT }
                const hasNear  = counts.near > 0
                const hasExact = counts.exact > 0
                return (
                  <div
                    key={region}
                    className="region-card"
                    style={{
                      background: BG_CARD,
                      border: `1px solid ${hasExact ? 'rgba(74,222,128,0.3)' : hasNear ? 'rgba(251,191,36,0.22)' : 'rgba(255,255,255,0.05)'}`,
                      borderRadius: '1.25rem',
                      padding: '1.75rem',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {hasNear && !hasExact && (
                      <div style={{
                        position: 'absolute', top: 0, right: 0,
                        width: '70%', height: '60%',
                        background: 'radial-gradient(ellipse, rgba(251,191,36,0.06) 0%, transparent 70%)',
                        pointerEvents: 'none',
                      }} />
                    )}

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '2rem', lineHeight: 1 }}>{meta.flag}</span>
                      {(hasNear || hasExact) && (
                        <span style={{
                          fontSize: '0.56rem', padding: '0.22rem 0.55rem', borderRadius: '2rem',
                          background: hasExact ? 'rgba(74,222,128,0.12)' : 'rgba(251,191,36,0.1)',
                          color: hasExact ? '#4ade80' : '#fbbf24',
                          border: `1px solid ${hasExact ? 'rgba(74,222,128,0.3)' : 'rgba(251,191,36,0.25)'}`,
                          letterSpacing: '0.2em', textTransform: 'uppercase',
                        }}>
                          {hasExact ? 'Match' : 'Near match'}
                        </span>
                      )}
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{meta.label}</div>

                    <div style={{
                      fontFamily: 'monospace', fontSize: '2.4rem', fontWeight: 800,
                      color: meta.color, lineHeight: 1, marginBottom: '0.4rem',
                    }}>
                      {counts.total}
                    </div>

                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                      platform{counts.total !== 1 ? 's' : ''}
                    </div>

                    {counts.near > 0 && (
                      <div style={{
                        marginTop: '0.75rem', paddingTop: '0.75rem',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        color: '#fbbf24', fontSize: '0.68rem', letterSpacing: '0.08em',
                      }}>
                        {counts.near} near match{counts.near !== 1 ? 'es' : ''}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>

          {/* Region connection bar */}
          <div style={{
            marginTop: '1.75rem', padding: '1.25rem 1.5rem',
            background: 'rgba(74,124,155,0.04)', border: '1px solid rgba(74,124,155,0.1)',
            borderRadius: '0.875rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap',
          }}>
            {Object.keys(regionCounts).sort().map((r, i, arr) => (
              <span key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem' }}>{REGION_META[r]?.flag ?? '🌍'}</span>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.38)', fontFamily: 'monospace' }}>
                  {r} /{regionCounts[r].total}
                </span>
                {i < arr.length - 1 && (
                  <span style={{ color: 'rgba(74,124,155,0.35)', margin: '0 0.15rem', fontSize: '0.65rem' }}>—</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ 3. PLATFORM STATUS GRID ════════════════════ */}
      <section style={{ padding: '5rem 1.5rem 4rem', background: BG_DARK, position: 'relative', overflow: 'hidden' }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(74,124,155,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,124,155,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }} />

        <div style={{ maxWidth: '75rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="dash-header" style={{ marginBottom: '2.75rem' }}>
            <p style={{ color: ACCENT, fontSize: '0.6rem', letterSpacing: '0.44em', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: 500 }}>
              Platform Intelligence
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.025em' }}>
              All {data.totalPlatformsChecked} Platforms
            </h2>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.7rem' }}>
              {[
                { dot: '#fbbf24', label: `${nearCount} near match${nearCount !== 1 ? 'es' : ''}` },
                { dot: '#ef4444', label: `${noMatch} no match`    },
                { dot: 'rgba(255,255,255,0.3)', label: `${pending} pending` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '0.4rem', height: '0.4rem', borderRadius: '50%', background: item.dot }} />
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="platform-status-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(238px, 1fr))',
            gap: '0.7rem',
          }}>
            {sorted.map(platform => {
              const sc = statusConfig(platform.status)
              return (
                <div
                  key={platform.name}
                  className="platform-status-card"
                  title={platform.notes ?? ''}
                  style={{
                    background: BG_CARD,
                    border: `1px solid ${sc.borderColor}`,
                    borderRadius: '0.875rem',
                    padding: '1.2rem 1.25rem',
                    cursor: platform.notes ? 'help' : 'default',
                    transition: 'border-color 0.2s, transform 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = sc.color + '80'
                    el.style.transform   = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = sc.borderColor
                    el.style.transform   = 'translateY(0)'
                  }}
                >
                  {/* Near match top-edge glow */}
                  {platform.status === 'near_match' && (
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                      background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.65), transparent)',
                    }} />
                  )}

                  {/* Top row: name + badges */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.65rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.35rem',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {platform.name}
                      </div>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.52rem', padding: '0.14rem 0.42rem', borderRadius: '0.3rem',
                          background: 'rgba(74,124,155,0.14)', color: ACCENT,
                          letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500,
                        }}>
                          {platform.region}
                        </span>
                        <span style={{
                          fontSize: '0.52rem', padding: '0.14rem 0.42rem', borderRadius: '0.3rem',
                          background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)',
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                        }}>
                          {platform.category}
                        </span>
                      </div>
                    </div>
                    {/* Status dot + label */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem', flexShrink: 0 }}>
                      <div style={{
                        width: '0.5rem', height: '0.5rem', borderRadius: '50%',
                        background: sc.color,
                        animation: platform.status === 'near_match' ? 'near-match-pulse 2.2s ease-in-out infinite' : undefined,
                      }} />
                      <span style={{ fontSize: '0.55rem', color: sc.color, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                        {sc.label}
                      </span>
                    </div>
                  </div>

                  {/* Footer: listing count + time */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontFamily: 'monospace', fontSize: '0.7rem',
                      color: platform.status === 'near_match' ? '#fbbf24' : platform.totalListings > 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)',
                    }}>
                      {platform.totalListings > 0 ? `${platform.totalListings} listings` : '0 listings'}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace' }}>
                      {relativeTime(platform.lastChecked)}
                    </span>
                  </div>

                  {/* Notes for near matches */}
                  {platform.status === 'near_match' && platform.notes && (
                    <div style={{
                      marginTop: '0.65rem', paddingTop: '0.65rem',
                      borderTop: '1px solid rgba(251,191,36,0.1)',
                      fontSize: '0.66rem', color: 'rgba(251,191,36,0.65)', lineHeight: 1.55,
                    }}>
                      {platform.notes}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════ 4. SEARCH TIMELINE ════════════════════════ */}
      <section
        className="search-timeline-section"
        style={{ padding: '5rem 1.5rem 4rem', background: BG_DEEP }}
      >
        <div style={{ maxWidth: '75rem', margin: '0 auto' }}>
          <div className="dash-header" style={{ marginBottom: '3rem' }}>
            <p style={{ color: ACCENT, fontSize: '0.6rem', letterSpacing: '0.44em', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: 500 }}>
              Search History
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.025em' }}>
              Timeline
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.85rem', marginTop: '0.45rem' }}>
              Daily activity since {new Date(data.searchStarted).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Vertical spine */}
            <div style={{
              position: 'absolute', left: '1.4rem', top: '1rem', bottom: '1rem',
              width: '1px',
              background: `linear-gradient(to bottom, transparent, ${ACCENT}60 8%, ${ACCENT}60 92%, transparent)`,
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingLeft: '4rem' }}>
              {data.searchHistory.map((entry, i) => {
                const barW  = Math.round((entry.totalListingsScanned / maxScanned) * 100)
                const date  = new Date(entry.date)
                const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

                return (
                  <div key={entry.date} className="timeline-node" style={{ position: 'relative' }}>
                    {/* Node */}
                    <div style={{
                      position: 'absolute', left: '-2.6rem', top: '1.55rem',
                      width: '0.65rem', height: '0.65rem', borderRadius: '50%',
                      background: entry.nearMatches > 0 ? '#fbbf24' : ACCENT,
                      border: `2px solid ${BG_DEEP}`,
                      boxShadow: `0 0 0 3px ${entry.nearMatches > 0 ? 'rgba(251,191,36,0.22)' : 'rgba(74,124,155,0.22)'}`,
                    }} />

                    <div style={{
                      background: BG_CARD,
                      border: `1px solid ${entry.nearMatches > 0 ? 'rgba(251,191,36,0.18)' : 'rgba(255,255,255,0.05)'}`,
                      borderRadius: '1rem',
                      padding: '1.5rem 1.75rem',
                    }}>
                      {/* Day header */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
                            fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase',
                            color: ACCENT, fontWeight: 600,
                          }}>
                            Day {i + 1}
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>{dateStr}</span>
                        </div>
                        {entry.exactMatches > 0 && (
                          <span style={{
                            fontSize: '0.6rem', padding: '0.28rem 0.7rem', borderRadius: '2rem',
                            background: 'rgba(74,222,128,0.12)', color: '#4ade80',
                            border: '1px solid rgba(74,222,128,0.3)',
                            letterSpacing: '0.18em', textTransform: 'uppercase',
                          }}>
                            🎯 Match Found
                          </span>
                        )}
                      </div>

                      {/* Metrics grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.25rem' }}>
                        {[
                          { label: 'Platforms',    value: entry.platformsChecked,                  hi: false },
                          { label: 'Listings',     value: entry.totalListingsScanned.toLocaleString(), hi: false },
                          { label: 'Near Matches', value: entry.nearMatches,                        hi: entry.nearMatches > 0 },
                        ].map(m => (
                          <div key={m.label}>
                            <div style={{
                              fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', fontWeight: 700,
                              fontFamily: 'monospace', lineHeight: 1,
                              color: m.hi ? '#fbbf24' : 'white',
                            }}>
                              {m.value}
                            </div>
                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.3rem' }}>
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Coverage bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                            Coverage
                          </span>
                          <span style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>
                            {entry.totalListingsScanned} listings scanned
                          </span>
                        </div>
                        <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${barW}%`,
                            background: `linear-gradient(90deg, ${ACCENT}, rgba(74,124,155,0.5))`,
                            borderRadius: '2px',
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Future node */}
              <div className="timeline-node" style={{ position: 'relative', opacity: 0.38 }}>
                <div style={{
                  position: 'absolute', left: '-2.6rem', top: '1rem',
                  width: '0.65rem', height: '0.65rem', borderRadius: '50%',
                  border: `1.5px dashed ${ACCENT}`,
                }} />
                <div style={{
                  background: 'rgba(74,124,155,0.04)', border: `1px dashed rgba(74,124,155,0.18)`,
                  borderRadius: '1rem', padding: '1.1rem 1.5rem',
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                }}>
                  <div className="green-dot" style={{ width: '0.38rem', height: '0.38rem', borderRadius: '50%', background: ACCENT }} />
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                    Day {data.searchHistory.length + 1} · Scanning in progress...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ 5. NEAR MATCH TRACKER ═════════════════════ */}
      {data.nearMatchExamples.length > 0 && (
        <section
          className="near-matches-section"
          style={{ padding: '5rem 1.5rem 6rem', background: BG_DARK, position: 'relative', overflow: 'hidden' }}
        >
          {/* Scanlines */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)',
          }} />

          <div style={{ maxWidth: '75rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div className="dash-header" style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <div style={{ width: '0.42rem', height: '0.42rem', borderRadius: '50%', background: '#fbbf24', animation: 'near-match-pulse 2s infinite' }} />
                <p style={{ color: '#fbbf24', fontSize: '0.6rem', letterSpacing: '0.44em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Near Match Tracker
                </p>
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.025em' }}>
                Close But Not There
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.85rem', marginTop: '0.45rem' }}>
                Platforms with Abundant Blue activity — under investigation
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}>
              {data.nearMatchExamples.map((match, i) => {
                const pData  = data.platforms.find(p =>
                  p.name === match.platform || p.name.toLowerCase().includes(match.platform.toLowerCase())
                )
                const badge  = pData?.status === 'near_match' ? 'Investigating' : 'Potential'
                const bColor = badge === 'Investigating' ? '#fbbf24' : ACCENT

                return (
                  <a
                    key={i}
                    className="near-match-card"
                    href={match.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      background: BG_CARD,
                      border: '1px solid rgba(251,191,36,0.2)',
                      borderRadius: '1.25rem',
                      padding: '1.75rem',
                      textDecoration: 'none',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'rgba(251,191,36,0.5)'
                      el.style.transform   = 'translateY(-3px)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'rgba(251,191,36,0.2)'
                      el.style.transform   = 'translateY(0)'
                    }}
                  >
                    {/* Top accent line */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                      background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.55), transparent)',
                    }} />

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{match.platform}</span>
                      <span style={{
                        fontSize: '0.55rem', padding: '0.24rem 0.6rem', borderRadius: '2rem',
                        background: `${bColor}18`, color: bColor,
                        border: `1px solid ${bColor}45`,
                        letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600,
                        flexShrink: 0,
                      }}>
                        {badge}
                      </span>
                    </div>

                    <div style={{ marginBottom: '0.85rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.4rem', color: 'rgba(255,255,255,0.85)' }}>
                        {match.title}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.55 }}>
                        {match.note}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {match.color && (
                        <span style={{
                          fontSize: '0.6rem', padding: '0.18rem 0.52rem', borderRadius: '0.35rem',
                          background: 'rgba(74,124,155,0.14)', color: ACCENT, letterSpacing: '0.08em',
                        }}>
                          {match.color}
                        </span>
                      )}
                      {match.size && match.size !== 'Various' && (
                        <span style={{
                          fontSize: '0.6rem', padding: '0.18rem 0.52rem', borderRadius: '0.35rem',
                          background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)',
                        }}>
                          {match.size}
                        </span>
                      )}
                    </div>

                    <div style={{
                      paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                    }}>
                      <span style={{ color: ACCENT, fontSize: '0.7rem' }}>→ View on {match.platform}</span>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
