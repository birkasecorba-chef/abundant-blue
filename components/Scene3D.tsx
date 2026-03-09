'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Float, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// Abundant Blue color
const ABUNDANT_BLUE = '#79B2E6'

function JacketPlaceholder() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  // Auto-rotation and floating animation
  useFrame((state) => {
    if (meshRef.current) {
      // Slow Y-axis rotation (20s full rotation)
      meshRef.current.rotation.y += 0.003
      
      // Floating bob animation
      const time = state.clock.getElapsedTime()
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.05
      
      // Breathing pulse (scale oscillation)
      const breathe = 1.0 + Math.sin(time * 2.1) * 0.01 // ~3s cycle
      meshRef.current.scale.setScalar(breathe)
    }
  })

  return (
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
        />
      </RoundedBox>
    </Float>
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

function Scene() {
  return (
    <>
      <Lights />
      <JacketPlaceholder />
      
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
}

export default function Scene3D({ className, style }: Scene3DProps) {
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
      <Scene />
    </Canvas>
  )
}