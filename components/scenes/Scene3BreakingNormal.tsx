'use client'

import { forwardRef } from 'react'

interface Scene3BreakingNormalProps {
  scrollProgress?: number
}

const Scene3BreakingNormal = forwardRef<HTMLDivElement, Scene3BreakingNormalProps>(
  ({ scrollProgress = 0 }, ref) => {
    return (
      <div
        ref={ref}
        className="relative h-screen w-full overflow-hidden bg-gradient-to-r from-slate-950 via-amber-900/20 to-slate-950 flex items-center justify-center"
      >
        {/* Harsh contrast overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

        {/* Depth layer 1 - Shattered road effect */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            backgroundImage: `
              linear-gradient(135deg, transparent 48%, rgba(240, 146, 60, 0.2) 49%, rgba(240, 146, 60, 0.2) 51%, transparent 52%),
              linear-gradient(45deg, transparent 48%, rgba(240, 146, 60, 0.15) 49%, rgba(240, 146, 60, 0.15) 51%, transparent 52%)
            `,
            backgroundSize: '80px 80px, 120px 120px',
            backgroundPosition: `${scrollProgress * 20}px 0, ${-scrollProgress * 15}px 0`,
            opacity: 0.4,
          }}
        />

        {/* Depth layer 2 - Trail break */}
        <div
          className="absolute left-0 right-0 h-1/2 depth-layer"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(234, 88, 12, 0.3) 50%, transparent 100%)',
            transform: `scaleX(${1 + scrollProgress * 0.2}) translateY(${scrollProgress * 30}px)`,
            filter: `blur(${scrollProgress * 10}px)`,
          }}
        />

        {/* Depth layer 3 - Right side harsh light */}
        <div
          className="absolute -right-32 top-0 w-96 h-full depth-layer"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.4) 0%, transparent 70%)',
            transform: `translateX(${scrollProgress * 50}px)`,
            opacity: 0.3 + scrollProgress * 0.4,
          }}
        />

        {/* Main headline - dramatic positioning */}
        <div
          className="relative z-10 text-center max-w-5xl px-4"
          style={{
            transform: `translateY(${scrollProgress * 15}px) scaleX(${1 - scrollProgress * 0.1})`,
            opacity: 0.8 + scrollProgress * 0.2,
          }}
        >
          <h2 className="font-serif text-5xl md:text-7xl font-bold text-white text-cinematic leading-tight">
            NO HOTELS
          </h2>
          <h3 className="font-serif text-5xl md:text-7xl font-bold text-orange-500/80 text-cinematic mt-2">
            NO COMFORT
          </h3>
          <h4 className="font-serif text-5xl md:text-7xl font-bold text-white text-cinematic mt-2">
            NO ESCAPE
          </h4>
        </div>

        {/* Shatter effect - cracks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line
              x1="20%"
              y1="30%"
              x2="40%"
              y2="80%"
              stroke="rgba(234, 88, 12, 0.2)"
              strokeWidth="2"
              style={{
                opacity: scrollProgress,
              }}
            />
            <line
              x1="60%"
              y1="40%"
              x2="80%"
              y2="75%"
              stroke="rgba(234, 88, 12, 0.2)"
              strokeWidth="2"
              style={{
                opacity: scrollProgress,
              }}
            />
            <line
              x1="70%"
              y1="20%"
              x2="50%"
              y2="70%"
              stroke="rgba(234, 88, 12, 0.15)"
              strokeWidth="1.5"
              style={{
                opacity: scrollProgress * 0.8,
              }}
            />
          </svg>
        </div>
      </div>
    )
  }
)

Scene3BreakingNormal.displayName = 'Scene3BreakingNormal'
export default Scene3BreakingNormal
