'use client'

import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'

// Interactive 3D globe showing search coverage areas
export default function Globe3D({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let phi = 0
    let width = 0

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }
    window.addEventListener('resize', onResize)
    onResize()

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [0.12, 0.15, 0.2],
      markerColor: [0.47, 0.70, 0.90], // Abundant Blue RGB normalized
      glowColor: [0.08, 0.12, 0.18],
      markers: [
        // US cities where we search
        { location: [47.6, -122.3], size: 0.08 },  // Seattle
        { location: [37.8, -122.4], size: 0.06 },  // San Francisco
        { location: [40.7, -74.0], size: 0.06 },   // New York
        { location: [34.1, -118.2], size: 0.06 },  // LA
        { location: [41.9, -87.6], size: 0.05 },   // Chicago
        // EU
        { location: [51.5, -0.1], size: 0.05 },    // London
        { location: [48.9, 2.3], size: 0.04 },     // Paris
        { location: [52.5, 13.4], size: 0.04 },    // Berlin
        // Asia
        { location: [35.7, 139.7], size: 0.04 },   // Tokyo
      ],
      onRender: (state: any) => {
        state.phi = phi
        phi += 0.003
        state.width = width * 2
        state.height = width * 2
      },
    })

    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = '1'
    }, 100)

    return () => {
      globe.destroy()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className={className} style={{ aspectRatio: '1', maxWidth: 500, margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          opacity: 0,
          transition: 'opacity 1s ease',
          contain: 'layout paint size',
        }}
      />
    </div>
  )
}
