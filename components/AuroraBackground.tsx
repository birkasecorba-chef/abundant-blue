'use client'

import { useEffect, useRef } from 'react'

// Animated aurora/gradient background effect
export default function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className || ''}`}>
      <div className="aurora-container">
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="aurora aurora-3" />
      </div>
      <style>{`
        .aurora-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          filter: blur(80px) saturate(1.5);
          opacity: 0.3;
        }
        .aurora {
          position: absolute;
          border-radius: 50%;
        }
        .aurora-1 {
          width: 60%;
          height: 60%;
          top: -20%;
          left: 10%;
          background: radial-gradient(ellipse, #79B2E630 0%, transparent 70%);
          animation: aurora-drift-1 20s ease-in-out infinite;
        }
        .aurora-2 {
          width: 50%;
          height: 50%;
          top: 30%;
          right: -10%;
          background: radial-gradient(ellipse, #79B2E620 0%, transparent 70%);
          animation: aurora-drift-2 25s ease-in-out infinite;
        }
        .aurora-3 {
          width: 40%;
          height: 40%;
          bottom: -10%;
          left: 30%;
          background: radial-gradient(ellipse, #5B9BD515 0%, transparent 70%);
          animation: aurora-drift-3 30s ease-in-out infinite;
        }
        @keyframes aurora-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10%, 5%) scale(1.1); }
          50% { transform: translate(-5%, 10%) scale(0.95); }
          75% { transform: translate(5%, -5%) scale(1.05); }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-8%, 8%) scale(1.1); }
          66% { transform: translate(5%, -3%) scale(0.9); }
        }
        @keyframes aurora-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10%, -10%) scale(1.15); }
        }
      `}</style>
    </div>
  )
}
