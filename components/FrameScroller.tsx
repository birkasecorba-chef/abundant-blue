'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface FrameScrollerProps {
  frameCount: number
  framePath: string       // e.g., '/frames/frame_' → /frames/frame_0001.webp
  width: number
  height: number
  className?: string
  scrollDistance?: string  // e.g., '+=300%'
}

export default function FrameScroller({
  frameCount,
  framePath,
  width,
  height,
  className,
  scrollDistance = '+=300%',
}: FrameScrollerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const containerRef = useRef<HTMLDivElement>(null!)
  const framesRef = useRef<HTMLImageElement[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Preload all frames
    let loadedCount = 0
    const images: HTMLImageElement[] = []

    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.src = `${framePath}${String(i + 1).padStart(4, '0')}.webp`
      img.onload = () => {
        loadedCount++
        if (loadedCount === 1) {
          // Draw first frame immediately
          ctx.drawImage(images[0], 0, 0, width, height)
        }
        if (loadedCount === frameCount) {
          setLoaded(true)
        }
      }
      images.push(img)
    }
    framesRef.current = images

    // GSAP frame scrubber
    const currentFrame = { value: 0 }

    const tween = gsap.to(currentFrame, {
      value: frameCount - 1,
      snap: 'value',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: scrollDistance,
        pin: true,
        scrub: 0.5,
      },
      onUpdate: () => {
        const idx = Math.round(currentFrame.value)
        const img = images[idx]
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.clearRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)
        }
      },
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [frameCount, framePath, width, height, scrollDistance])

  return (
    <div ref={containerRef} className={className}>
      <div className="flex items-center justify-center min-h-screen">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="max-w-full max-h-[85vh] w-auto h-auto"
          style={{ imageRendering: 'auto' }}
        />
      </div>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-abundant-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
