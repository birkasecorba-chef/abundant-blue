'use client'

import { useRef, useEffect, useState } from 'react'

// Spotlight beam effect that follows cursor on desktop
export default function SpotlightBeam({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null!)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      setPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseenter', () => setIsHovered(true))
    el.addEventListener('mouseleave', () => setIsHovered(false))

    return () => {
      el.removeEventListener('mousemove', handleMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className || ''}`}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Ambient spotlight (always visible, follows cursor or auto-animates) */}
      <div
        className="absolute transition-all duration-700 ease-out"
        style={{
          width: '600px',
          height: '600px',
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${isHovered ? 'rgba(121,178,230,0.08)' : 'rgba(121,178,230,0.04)'} 0%, transparent 70%)`,
          transition: 'background 0.5s ease, left 0.3s ease-out, top 0.3s ease-out',
        }}
      />
      {/* Top beam */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: '2px',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(121,178,230,0.15) 0%, transparent 30%)',
          opacity: isHovered ? 0.5 : 0.2,
          transition: 'opacity 0.5s ease',
        }}
      />
    </div>
  )
}
