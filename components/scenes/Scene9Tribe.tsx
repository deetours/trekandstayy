'use client'

import { forwardRef } from 'react'

interface Scene9TribeProps {
  scrollProgress?: number
}

const createWaveValue = (
  index: number,
  min: number,
  max: number,
  seed: number
) => {
  const normalized = (Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453) % 1
  return min + Math.abs(normalized) * (max - min)
}

const Scene9Tribe = forwardRef<HTMLDivElement, Scene9TribeProps>(
  ({ scrollProgress = 0 }, ref) => {
    return (
      <div
        ref={ref}
        className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950/50 to-slate-950 flex items-center justify-center"
      >
        {/* Blue hour base */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950" />

        {/* Depth layer 1 - Sky stars */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            backgroundPosition: `${scrollProgress * 20}px 0`,
            opacity: 0.3,
          }}
        />

        {/* Depth layer 2 - Campfire glow */}
        <div
          className="absolute left-1/2 bottom-1/4 w-80 h-80 depth-layer -translate-x-1/2"
          style={{
            background: `radial-gradient(circle, 
              rgba(249, 115, 22, ${0.4 + scrollProgress * 0.3}) 0%, 
              rgba(234, 88, 12, ${0.2 + scrollProgress * 0.2}) 30%, 
              transparent 70%)`,
            filter: `blur(${40 + scrollProgress * 20}px)`,
            transform: `scale(${0.8 + scrollProgress * 0.3}) translateX(-50%)`,
            opacity: 0.7 + scrollProgress * 0.3,
          }}
        />

        {/* Depth layer 3 - Silhouettes circle */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 depth-layer"
          style={{
            width: '300px',
            height: '200px',
            background: `radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7) 0%, transparent 70%)`,
            opacity: 0.6 + scrollProgress * 0.4,
          }}
        />

        {/* Depth layer 4 - Ambient glow */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, 
              rgba(249, 115, 22, ${0.1 + scrollProgress * 0.15}) 0%, 
              transparent 60%)`,
            opacity: scrollProgress,
          }}
        />

        {/* Main headline */}
        <div
          className="relative z-10 text-center max-x-4xl px-4"
          style={{
            transform: `translateY(${scrollProgress * 10}px)`,
            opacity: 0.5 + scrollProgress * 0.5,
          }}
        >
          <h2 className="font-serif text-5xl md:text-7xl font-bold text-white text-cinematic mb-4">
            YOU ARE NOT
          </h2>
          <p className="font-serif text-5xl md:text-7xl font-bold text-orange-400/90">
            ALONE
          </p>
          <p className="text-sm md:text-base text-gray-400 mt-8 tracking-widest">
            CONNECTED BY FIRE AND SHARED PURPOSE
          </p>
        </div>

        {/* Silhouette figures around fire */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-1/4 w-8 h-16 depth-layer"
              style={{
                left: `${30 + Math.cos((i / 6) * Math.PI * 2) * 120}%`,
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5))',
                borderRadius: '50% 50% 0 0',
                transform: `translateX(-50%) translateY(${scrollProgress * 10}px)`,
                opacity: 0.4 + scrollProgress * 0.4,
                width: `${24 + i * 4}px`,
              }}
            />
          ))}
        </div>

        {/* Flame animation */}
        <div className="absolute left-1/2 bottom-1/4 -translate-x-1/2 w-32 h-40 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-16 opacity-20"
              style={{
                background: `linear-gradient(to top, 
                  rgba(249, 115, 22, 0.8) 0%, 
                  rgba(251, 146, 60, 0.4) 50%, 
                  transparent 100%)`,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                animationName: 'flicker',
                animationDuration: `${createWaveValue(i, 0.5, 1, 5)}s`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out',
                animationDelay: `${i * 0.06}s`,
                transform: `translateX(${createWaveValue(i, -10, 10, 6)}px)`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }
)

Scene9Tribe.displayName = 'Scene9Tribe'
export default Scene9Tribe
