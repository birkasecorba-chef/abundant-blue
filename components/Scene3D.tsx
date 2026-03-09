'use client'

import { useRef, useState, useEffect, Component, ReactNode } from 'react'

const ABUNDANT_BLUE = '#79B2E6'

/* ═══ WebGL Error Boundary ═══ */
class WebGLErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

/* ═══ WebGL Detection ═══ */
function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/* ═══ Lazy 3D Canvas ═══ */
function LazyCanvas({ scrollProgress }: { scrollProgress: number }) {
  const [modules, setModules] = useState<any>(null)
  const meshRef = useRef<any>(null!)

  useEffect(() => {
    Promise.all([
      import('@react-three/fiber'),
      import('@react-three/drei'),
    ]).then(([fiber, drei]) => {
      setModules({ Canvas: fiber.Canvas, useFrame: fiber.useFrame, RoundedBox: drei.RoundedBox, Float: drei.Float })
    }).catch(() => {})
  }, [])

  if (!modules) return null
  const { Canvas } = modules

  return (
    <Canvas
      style={{ background: 'transparent' }}
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, -2, 4]} intensity={0.3} color={ABUNDANT_BLUE} />
      <spotLight position={[0, 5, -5]} intensity={0.6} color={ABUNDANT_BLUE} angle={0.4} penumbra={0.5} />
      <JacketShape scrollProgress={scrollProgress} useFrame={modules.useFrame} RoundedBox={modules.RoundedBox} Float={modules.Float} meshRef={meshRef} />
    </Canvas>
  )
}

/* ═══ 3D Jacket Placeholder ═══ */
function JacketShape({ scrollProgress, useFrame, RoundedBox, Float, meshRef }: any) {
  useFrame((state: any) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()

    if (scrollProgress <= 0.15) {
      // Idle: auto-rotate + float + breathe
      meshRef.current.rotation.y += 0.003
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.05
      meshRef.current.scale.setScalar(1.0 + Math.sin(t * 2.1) * 0.01)
      meshRef.current.material.opacity = 1
    } else if (scrollProgress <= 0.55) {
      // Slow down, tilt
      meshRef.current.rotation.y += 0.001
      meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.1
    } else if (scrollProgress <= 0.70) {
      // Scale down
      const p = (scrollProgress - 0.55) / 0.15
      meshRef.current.scale.setScalar(1.0 - p * 0.7)
    } else {
      // Fade
      meshRef.current.scale.setScalar(0.3 * (1 - Math.min(1, (scrollProgress - 0.70) / 0.30)))
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
          transparent
        />
      </RoundedBox>
    </Float>
  )
}

/* ═══ Static Fallback ═══ */
function Fallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="w-[300px] h-[375px] rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at center, ${ABUNDANT_BLUE}40 0%, ${ABUNDANT_BLUE}10 50%, transparent 70%)`,
          animation: 'pulse3d 3s ease-in-out infinite',
        }}
      />
      <style>{`@keyframes pulse3d { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.02); opacity: 1; } }`}</style>
    </div>
  )
}

/* ═══ Exported Component ═══ */
interface Scene3DProps {
  scrollProgress: number
  className?: string
}

export default function Scene3D({ scrollProgress, className }: Scene3DProps) {
  const [webgl, setWebgl] = useState<boolean | null>(null)

  useEffect(() => {
    setWebgl(isWebGLAvailable())
  }, [])

  if (webgl === null) return null
  if (!webgl) return <Fallback />

  return (
    <div className={className} style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
      <WebGLErrorBoundary fallback={<Fallback />}>
        <LazyCanvas scrollProgress={scrollProgress} />
      </WebGLErrorBoundary>
    </div>
  )
}
