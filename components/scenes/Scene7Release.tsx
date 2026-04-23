'use client'

import { forwardRef } from 'react'

interface Scene7ReleaseProps {
  scrollProgress?: number
}

const Scene7Release = forwardRef<HTMLDivElement, Scene7ReleaseProps>(
  ({ scrollProgress = 0 }, ref) => {
    return (
      <div
        ref={ref}
        className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-slate-900 via-amber-900/40 to-orange-950 flex items-center justify-center"
      >
        {/* Light breakthrough */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            background: `radial-gradient(ellipse at center, rgba(251, 191, 36, ${0.15 + scrollProgress * 0.3}) 0%, transparent 80%)`,
            opacity: scrollProgress,
          }}
        />

        {/* Depth layer 1 - Clouds clearing */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            background: 'linear-gradient(to bottom, rgba(191, 144, 0, 0.2) 0%, transparent 50%, rgba(0, 0, 0, 0.4) 100%)',
            transform: `translateY(${-scrollProgress * 50}px) scaleY(${1 - scrollProgress * 0.2})`,
            opacity: 1 - scrollProgress * 0.5,
          }}
        />

        {/* Depth layer 2 - Golden light rays */}
        <div
          className="absolute -top-32 left-1/2 w-96 h-96 depth-layer"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(251, 146, 60, 0.4) 0%, transparent 70%)',
            filter: `blur(${80 - scrollProgress * 50}px)`,
            transform: `translateX(-50%) translateY(${-scrollProgress * 100}px) scale(${0.5 + scrollProgress})`,
            opacity: scrollProgress,
          }}
        />

        {/* Depth layer 3 - Expanding horizon */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            background: `linear-gradient(180deg, 
              transparent 0%, 
              rgba(251, 146, 60, ${0.1 + scrollProgress * 0.2}) 40%, 
              rgba(34, 197, 94, ${scrollProgress * 0.1}) 60%, 
              transparent 100%)`,
          }}
        />

        {/* Main headline - revelation */}
        <div
          className="relative z-10 text-center max-w-4xl px-4"
          style={{
            transform: `translateY(${-scrollProgress * 20}px) scale(${0.9 + scrollProgress * 0.1})`,
            opacity: 0.3 + scrollProgress * 0.7,
          }}
        >
          <h2 className="font-serif text-6xl md:text-8xl font-bold text-white text-cinematic mb-6">
            THIS IS WHY
          </h2>
          <p className="text-sm md:text-base text-amber-200 tracking-widest">
            THE LIGHT BREAKS THROUGH
          </p>
        </div>

        {/* Ambient light particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-300 rounded-full"
              style={{
                left: `${(i * 8 + scrollProgress * 50) % 100}%`,
                top: `${20 + (i * 30) % 60}%`,
                opacity: scrollProgress * 0.6,
                animation: `float ${3 + i * 0.3}s infinite ease-in-out`,
                boxShadow: `0 0 ${10 + scrollProgress * 20}px rgba(251, 191, 36, 0.6)`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }
)

Scene7Release.displayName = 'Scene7Release'
export default Scene7Release
