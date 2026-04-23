'use client'

import { forwardRef } from 'react'

interface Scene5ClimbProps {
  scrollProgress?: number
}

const Scene5Climb = forwardRef<HTMLDivElement, Scene5ClimbProps>(
  ({ scrollProgress = 0 }, ref) => {
    return (
      <div
        ref={ref}
        className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-gray-700 via-slate-700 to-slate-900 flex items-center justify-center"
      >
        {/* Sky gradient - altitude effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-slate-800 to-slate-900" />

        {/* Depth layer 1 - Distant mountains */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            background: 'linear-gradient(180deg, rgba(30, 58, 138, 0.2) 0%, rgba(15, 23, 42, 0.5) 100%)',
            transform: `translateY(${-scrollProgress * 40}px) scale(${1 + scrollProgress * 0.05})`,
          }}
        />

        {/* Depth layer 2 - Rock formations */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(100, 116, 139, 0.2) 100px, rgba(100, 116, 139, 0.2) 120px),
              repeating-linear-gradient(-45deg, transparent, transparent 100px, rgba(100, 116, 139, 0.15) 100px, rgba(100, 116, 139, 0.15) 120px)
            `,
            transform: `translateY(${scrollProgress * 25}px)`,
            opacity: 0.4,
          }}
        />

        {/* Depth layer 3 - Elevation indicator */}
        <div
          className="absolute right-0 top-0 w-1 h-full depth-layer"
          style={{
            background: `linear-gradient(to bottom, 
              rgba(59, 130, 246, ${0.2 + scrollProgress * 0.6}) 0%, 
              rgba(31, 163, 163, ${0.3 + scrollProgress * 0.5}) 50%, 
              rgba(15, 23, 42, 0.8) 100%)`,
            transform: `scaleY(${1 + scrollProgress * 0.3})`,
            transformOrigin: 'top',
          }}
        />

        {/* Depth layer 4 - Foreground rocks */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 depth-layer"
          style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(64, 74, 100, 0.3) 50%, transparent)',
            transform: `translateY(${scrollProgress * 10}px)`,
          }}
        />

        {/* Main headline */}
        <div
          className="relative z-10 text-center max-w-4xl px-4"
          style={{
            transform: `translateY(${-scrollProgress * 25}px)`,
            opacity: 0.5 + scrollProgress * 0.5,
          }}
        >
          <h2 className="font-serif text-6xl md:text-8xl font-bold text-white text-cinematic">
            YOU WILL
          </h2>
          <p className="text-5xl md:text-7xl font-serif font-bold text-blue-400 mt-4">
            FEEL IT
          </p>
          <p className="text-xs md:text-sm text-gray-300 mt-8 tracking-widest opacity-70">
            EVERY BREATH. EVERY STEP. EVERY HEARTBEAT.
          </p>
        </div>

        {/* Altitude meter on left */}
        <div
          className="absolute left-8 top-1/4 z-20 flex flex-col items-start gap-2"
          style={{
            opacity: scrollProgress * 0.8,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-blue-400/60 text-xs"
              style={{
                opacity: i <= scrollProgress * 6 ? 1 : 0.3,
                transform: `translateX(${i <= scrollProgress * 6 ? 0 : -10}px)`,
                transition: 'all 0.3s ease',
              }}
            >
              <span className="w-1 h-1 bg-blue-400 rounded-full" />
              <span>{(i + 1) * 1000}m</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
)

Scene5Climb.displayName = 'Scene5Climb'
export default Scene5Climb
