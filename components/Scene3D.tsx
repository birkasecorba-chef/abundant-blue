'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Float, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// Abundant Blue color
const ABUNDANT_BLUE = '#79B2E6'

interface JacketPlaceholderProps {
  scrollProgress: number
}

function JacketPlaceholder({ scrollProgress }: JacketPlaceholderProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  
  // Auto-rotation and scroll-driven animations
  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      // Auto-rotation based on scroll progress
      const time = state.clock.getElapsedTime()
      
      if (scrollProgress <= 0.15) {
        // 0-15%: Auto-rotate as current
        meshRef.current.rotation.y += 0.003
        
        // Floating bob animation
        meshRef.current.position.y = Math.sin(time * 0.5) * 0.05
        
        // Breathing pulse (scale oscillation)
        const breathe = 1.0 + Math.sin(time * 2.1) * 0.01 // ~3s cycle
        groupRef.current.scale.setScalar(breathe)
        groupRef.current.rotation.set(0, 0, 0)
        
      } else if (scrollProgress <= 0.30) {
        // 15-30%: Slow rotation, tilt camera
        meshRef.current.rotation.y += 0.001 // Slower rotation
        
        // Tilt the entire group
        const tiltProgress = (scrollProgress - 0.15) / 0.15 // 0-1 range
        groupRef.current.rotation.z = THREE.MathUtils.lerp(0, -0.5, tiltProgress) // 30° tilt
        groupRef.current.rotation.x = THREE.MathUtils.lerp(0, 0.2, tiltProgress)
        
        // Scale stays normal
        groupRef.current.scale.setScalar(1.0)
        
      } else if (scrollProgress <= 0.55) {
        // 30-55%: Continue normal behavior
        meshRef.current.rotation.y += 0.003
        
        // Reset tilt gradually
        const resetProgress = (scrollProgress - 0.30) / 0.25 // 0-1 range
        groupRef.current.rotation.z = THREE.MathUtils.lerp(-0.5, 0, resetProgress)
        groupRef.current.rotation.x = THREE.MathUtils.lerp(0.2, 0, resetProgress)
        groupRef.current.scale.setScalar(1.0)
        
      } else if (scrollProgress <= 0.70) {
        // 55-70%: Scale down to 0.3
        const scaleProgress = (scrollProgress - 0.55) / 0.15 // 0-1 range
        const targetScale = THREE.MathUtils.lerp(1.0, 0.3, scaleProgress)
        groupRef.current.scale.setScalar(targetScale)
        
        // Continue rotation
        meshRef.current.rotation.y += 0.003
        groupRef.current.rotation.set(0, 0, 0)
        
      } else {
        // 70%+: Fade opacity to 0 and scale to 0.3
        const fadeProgress = (scrollProgress - 0.70) / 0.30 // 0-1 range for remaining 30%
        const opacity = THREE.MathUtils.lerp(1.0, 0.0, fadeProgress)
        
        // Set opacity on material
        if (meshRef.current.material instanceof THREE.Material) {
          meshRef.current.material.opacity = opacity
          meshRef.current.material.transparent = true
        }
        
        groupRef.current.scale.setScalar(0.3)
        meshRef.current.rotation.y += 0.003
        groupRef.current.rotation.set(0, 0, 0)
      }
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.05}>
        <RoundedBox
          ref={meshRef}
          args={[2, 2.5, 0.8]} // Jacket-like proportions (width, height, depth)
          radius={0.15}
          smoothness={4}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color={ABUNDANT_BLUE}
            metalness={0.1}
            roughness={0.3}
            emissive={ABUNDANT_BLUE}
            emissiveIntensity={0.05}
            transparent={true}
            opacity={1.0}
          />
        </RoundedBox>
      </Float>
    </group>
  )
}

function Lights() {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.15} />
      
      {/* Main directional light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#ffffff"
        castShadow
      />
      
      {/* Blue fill light */}
      <directionalLight
        position={[-3, -2, 4]}
        intensity={0.3}
        color={ABUNDANT_BLUE}
      />
      
      {/* Blue rim light (spot) */}
      <spotLight
        position={[0, 5, -5]}
        intensity={0.6}
        color={ABUNDANT_BLUE}
        angle={0.4}
        penumbra={0.5}
        castShadow
      />
    </>
  )
}

interface SceneProps {
  scrollProgress: number
}

function Scene({ scrollProgress }: SceneProps) {
  return (
    <>
      <Lights />
      <JacketPlaceholder scrollProgress={scrollProgress} />
      
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.8}
          intensity={0.4}
          radius={0.8}
        />
      </EffectComposer>
    </>
  )
}

interface Scene3DProps {
  className?: string
  style?: React.CSSProperties
  scrollProgress: number
}

export default function Scene3D({ className, style, scrollProgress }: Scene3DProps) {
  const canvasStyle = useMemo(() => ({
    background: 'transparent',
    ...style,
  }), [style])

  return (
    <Canvas
      className={className}
      style={canvasStyle}
      camera={{
        position: [0, 0, 4],
        fov: 45,
        near: 0.1,
        far: 100,
      }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true, // Transparent background
        premultipliedAlpha: false,
      }}
    >
      <Scene scrollProgress={scrollProgress} />
    </Canvas>
  )
}