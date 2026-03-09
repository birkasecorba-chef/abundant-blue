'use client'

import { useRef, useMemo, useState, useEffect, Component, ReactNode } from 'react'
import * as THREE from 'three'

// Abundant Blue color
const ABUNDANT_BLUE = '#79B2E6'

// Error boundary for WebGL failures
class WebGLErrorBoundary extends Component<{ fallback: ReactNode, children: ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: ReactNode, children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

// Check if WebGL is available
function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch { return false }
}

// Lazy-loaded 3D scene (only imports Three.js if WebGL available)
function Scene3DCanvas({ scrollProgress, style, className }: { scrollProgress: number, style?: React.CSSProperties, className?: string }) {
  const [R3F, setR3F] = useState<any>(null)

  useEffect(() => {
    // Dynamic import to avoid SSR issues and reduce initial bundle
    Promise.all([
      import('@react-three/fiber'),
      import('@react-three/drei'),
    ]).then(([fiber, drei]) => {
      setR3F({ Canvas: fiber.Canvas, useFrame: fiber.useFrame, RoundedBox: drei.RoundedBox, Float: drei.Float })
    }).catch(() => {})
  }, [])

  if (!R3F) return null

  return (
    <R3F.Canvas
      className={className}
      style={{ background: 'transparent', ...style }}
      camera={{ position: [0, 0, 4], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-3, -2, 4]} intensity={0.3} color={ABUNDANT_BLUE} />
      <spotLight position={[0, 5, -5]} intensity={0.6} color={ABUNDANT_BLUE} angle={0.4} penumbra={0.5} />
      <JacketModel scrollProgress={scrollProgress} useFrame={R3F.useFrame} RoundedBox={R3F.RoundedBox} Float={R3F.Float} />
    </R3F.Canvas>
  )
}

function JacketModel({ scrollProgress, useFrame, RoundedBox, Float }: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state: any) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    
    if (scrollProgress <= 0.15) {
      meshRef.current.rotation.y += 0.003
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.05
      const breathe = 1.0 + Math.sin(time * 2.1) * 0.01
      meshRef.current.scale.setScalar(breathe)
    } else if (scrollProgress <= 0.30) {
      const t = (scrollProgress - 0.15) / 0.15
      meshRef.current.rotation.y += 0.003 * (1 - t)
      meshRef.current.rotation.z = t * 0.5
    } else if (scrollProgress <= 0.55) {
      meshRef.current.rotation.z = 0.5 * (1 - (scrollProgress - 0.30) / 0.25)
    } else if (scrollProgress <= 0.70) {
      const t = (scrollProgress - 0.55) / 0.15
      const s = 1.0 - t * 0.7
      meshRef.current.scale.setScalar(s)
    } else {
      const t = Math.min(1, (scrollProgress - 0.70) / 0.30)
      meshRef.current.scale.setScalar(0.3 * (1 - t))
    }
  })

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.05}>
      <RoundedBox ref={meshRef} args={[2, 2.5, 0.8]} radius={0.15} smoothness={4}>
        <meshStandardMaterial
          color={ABUNDANT_BLUE}
          metalness={0.1}
          roughness={0.3}
          emissive={ABUNDANT_BLUE}
          emissiveIntensity={0.05}
        />
      </RoundedBox>
    </Float>
  )
}

// Static fallback when WebGL is not available
function StaticFallback({ style, className }: { style?: React.CSSProperties, className?: string }) {
  return (
    <div className={className} style={{
      ...style,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Gradient orb as fallback for 3D scene */}
      <div style={{
        width: 300,
        height: 375,
        borderRadius: '20px',
        background: `radial-gradient(ellipse at center, ${ABUNDANT_BLUE}40 0%, ${ABUNDANT_BLUE}10 50%, transparent 70%)`,
        animation: 'pulse 3s ease-in-out infinite',
      }} />
      <style>{`@keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.02); opacity: 1; } }`}</style>
    </div>
  )
}

interface Scene3DProps {
  className?: string
  style?: React.CSSProperties
  scrollProgress: number
}

export default function Scene3D({ className, style, scrollProgress }: Scene3DProps) {
  const [webgl, setWebgl] = useState<boolean | null>(null)
  
  useEffect(() => {
    setWebgl(isWebGLAvailable())
  }, [])

  // Still loading / SSR
  if (webgl === null) return null

  // No WebGL — show static fallback
  if (!webgl) return <StaticFallback style={style} className={className} />

  // WebGL available — render 3D with error boundary
  return (
    <WebGLErrorBoundary fallback={<StaticFallback style={style} className={className} />}>
      <Scene3DCanvas scrollProgress={scrollProgress} style={style} className={className} />
    </WebGLErrorBoundary>
  )
}
