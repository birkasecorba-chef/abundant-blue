'use client'

import React, { useState, useEffect } from 'react'

interface SearchData {
  lastUpdated: string
  searchStarted: string
  totalSearches: number
  totalPlatformsChecked: number
  exactMatches: number
  nearMatches: number
  target: {
    brand: string
    model: string
    style: string
    color: string
    colorCode: string
    size: string
    type: string
  }
  platforms: Array<{
    name: string
    category: string
    region: string
    url: string
    lastChecked: string | null
    status: string
    totalListings: number
    notes?: string
  }>
  searchHistory: Array<{
    date: string
    platformsChecked: number
    exactMatches: number
    nearMatches: number
    totalListingsScanned: number
  }>
  matches: any[]
  nearMatchExamples: Array<{
    platform: string
    title: string
    color: string
    size: string
    price: string | null
    url: string
    note: string
  }>
}

const AbundantBluePage = () => {
  const [searchData, setSearchData] = useState<SearchData | null>(null)
  const [animatedCounts, setAnimatedCounts] = useState({
    totalSearches: 0,
    totalPlatformsChecked: 0,
    daysSearching: 0,
    exactMatches: 0
  })

  useEffect(() => {
    fetch('/search-data.json')
      .then(res => res.json())
      .then((data: SearchData) => {
        setSearchData(data)
        
        // Calculate days since search started
        const startDate = new Date(data.searchStarted)
        const now = new Date()
        const daysSearching = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        
        // Animate counters
        const targetCounts = {
          totalSearches: data.totalSearches,
          totalPlatformsChecked: data.totalPlatformsChecked,
          daysSearching: daysSearching,
          exactMatches: data.exactMatches
        }
        
        // Start animations
        Object.entries(targetCounts).forEach(([key, target]) => {
          let current = 0
          const increment = Math.ceil(target / 30) || 1
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              current = target
              clearInterval(timer)
            }
            setAnimatedCounts(prev => ({ ...prev, [key]: current }))
          }, 50)
        })
      })
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exact_match': return 'bg-green-500'
      case 'near_match': return 'bg-yellow-500'
      case 'pending': return 'bg-blue-500 animate-pulse'
      default: return 'bg-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!searchData) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-white">Initializing search parameters...</div>
      </div>
    )
  }

  return (
    <div className="bg-deep-navy text-white">
      {/* 1. HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
          The Hunt for<br />
          <span className="text-abundant-blue">Abundant Blue</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-16 max-w-2xl">
          PATAGONIA DOWN SWEATER · STYLE 84684 · DISCONTINUED
        </p>
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-abundant-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* 2. PRODUCT SHOWCASE */}
      <section className="min-h-screen flex items-center justify-center px-4 lg:px-16">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="text-sm text-white/60 uppercase tracking-wider">Technical Documentation</div>
            <h2 className="text-3xl md:text-4xl font-bold">Style 84684</h2>
            
            <div className="space-y-4 text-white/80">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-white/60">Brand</div>
                  <div className="font-medium">{searchData.target.brand}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Style</div>
                  <div className="font-medium">{searchData.target.style}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Color</div>
                  <div className="font-medium">{searchData.target.color}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Code</div>
                  <div className="font-medium">{searchData.target.colorCode}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Size</div>
                  <div className="font-medium">{searchData.target.size}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Status</div>
                  <div className="font-medium text-red-400">DISCONTINUED</div>
                </div>
              </div>
            </div>
            
            <p className="text-white/70 leading-relaxed">
              Not just blue. Abundant Blue. A specific discontinuation. Color code ABDB. Women's Small. Perfect condition only.
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <img 
              src="/jacket-flat.png" 
              alt="Patagonia Down Sweater in Abundant Blue, Style 84684, laying flat against white background"
              className="w-full max-w-lg h-auto"
            />
          </div>
        </div>
      </section>

      {/* 3. COLOR STORY */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl w-full">
          <div className="mb-8">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-abundant-blue rounded-full mx-auto mb-6 shadow-2xl"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Abundant Blue</h2>
          <div className="text-xl md:text-2xl text-white/80 mb-6 font-mono">#79B2E6</div>
          <div className="text-lg text-white/70 mb-4 font-medium">Color Code: ABDB</div>
          
          <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
            A vibrant blue-purple that caught the light just right. Not navy, not royal, not cerulean. 
            This specific shade that made people stop and ask "what color is that jacket?" 
            Now discontinued. Now impossible to find. Now the object of systematic search.
          </p>
        </div>
      </section>

      {/* 4. FILL POWER */}
      <section className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-4xl w-full">
          <div className="text-sm text-white/60 uppercase tracking-wider mb-4">Performance Characteristics</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            800-Fill Traceable Down
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-3xl font-bold text-abundant-blue mb-2">800</div>
              <div className="text-white/80">Fill Power</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-abundant-blue mb-2">375g</div>
              <div className="text-white/80">Weight</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-abundant-blue mb-2">-10°C</div>
              <div className="text-white/80">Warmth Rating</div>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-abundant-blue/20 border border-abundant-blue px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-abundant-blue rounded-full"></div>
            <span className="text-abundant-blue font-medium">Responsibly Sourced</span>
          </div>
          
          <p className="text-white/70 mt-6 max-w-2xl mx-auto">
            Ethically certified. Exceptionally warm. The fill that made this jacket legendary before the color made it impossible to find.
          </p>
        </div>
      </section>

      {/* 5. SEARCH DASHBOARD */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm text-white/60 uppercase tracking-wider mb-4">Mission Metrics</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Searching {animatedCounts.totalPlatformsChecked} Platforms Every Single Day
            </h2>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-card-bg p-6 rounded-lg text-center">
              <div className="text-2xl md:text-3xl font-bold text-abundant-blue mb-2">
                {animatedCounts.totalSearches}
              </div>
              <div className="text-white/80">Total Searches</div>
            </div>
            <div className="bg-card-bg p-6 rounded-lg text-center">
              <div className="text-2xl md:text-3xl font-bold text-abundant-blue mb-2">
                {animatedCounts.totalPlatformsChecked}
              </div>
              <div className="text-white/80">Platforms Monitored</div>
            </div>
            <div className="bg-card-bg p-6 rounded-lg text-center">
              <div className="text-2xl md:text-3xl font-bold text-abundant-blue mb-2">
                {animatedCounts.daysSearching}
              </div>
              <div className="text-white/80">Days Searching</div>
            </div>
            <div className="bg-card-bg p-6 rounded-lg text-center">
              <div className={`text-2xl md:text-3xl font-bold mb-2 ${animatedCounts.exactMatches === 0 ? 'text-red-400' : 'text-abundant-blue'}`}>
                {animatedCounts.exactMatches}
              </div>
              <div className="text-white/80">Exact Matches</div>
            </div>
          </div>
          
          {/* Platform Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchData.platforms.map((platform, index) => (
              <div key={index} className="bg-card-bg p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{platform.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(platform.status)}`}></div>
                </div>
                <div className="text-sm text-white/60 mb-1 capitalize">{platform.category} • {platform.region}</div>
                <div className="text-sm text-white/80">
                  {platform.totalListings} listings
                  {platform.notes && (
                    <div className="text-xs text-white/60 mt-1">{platform.notes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEAR MATCHES */}
      <section className="py-16 px-4 bg-card-bg/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm text-white/60 uppercase tracking-wider mb-4">Promising Leads</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Close, But Not Quite</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Close. So close. But not the one. Each near match teaches us something about where Style 84684 might be hiding.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchData.nearMatchExamples.map((match, index) => (
              <div key={index} className="bg-card-bg p-6 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-abundant-blue mb-1">{match.platform}</div>
                    <h3 className="text-sm text-white/90 leading-snug">{match.title}</h3>
                  </div>
                  {match.price && (
                    <div className="text-white/80 font-medium">{match.price}</div>
                  )}
                </div>
                <div className="text-sm text-white/70 mb-3">
                  {match.color} • {match.size}
                </div>
                <div className="text-sm text-white/60 mb-4">{match.note}</div>
                <a
                  href={match.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-abundant-blue text-sm hover:underline"
                >
                  View listing →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TIMELINE */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm text-white/60 uppercase tracking-wider mb-4">Search Chronicle</div>
            <h2 className="text-3xl md:text-4xl font-bold">Timeline of the Hunt</h2>
          </div>
          
          <div className="space-y-8">
            {searchData.searchHistory.map((entry, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0 w-4 h-4 bg-abundant-blue rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-1">
                    Day {index + 1} — {formatDate(entry.date)}
                  </div>
                  <div className="text-white/70 mb-2">
                    {entry.platformsChecked} platforms checked • {entry.totalListingsScanned} listings scanned • {entry.nearMatches} near matches found
                  </div>
                  {index === 0 && (
                    <div className="text-white/60 text-sm">
                      Search initiated. Parameters defined. Hope levels: maximum.
                    </div>
                  )}
                  {index === searchData.searchHistory.length - 1 && (
                    <div className="text-white/60 text-sm">
                      Latest search run. Still hunting. Still hoping.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-16 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">The search continues.</h2>
          <p className="text-white/70 mb-6">
            Patagonia Women's Down Sweater • Abundant Blue • Style 84684
          </p>
          <div className="text-sm text-white/60">
            Last updated {formatDate(searchData.lastUpdated)} • {searchData.totalPlatformsChecked} platforms monitored
          </div>
          <div className="text-xs text-white/40 mt-4">
            Built by Chef 👨🏼‍🍳 for @birkasecorba
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AbundantBluePage