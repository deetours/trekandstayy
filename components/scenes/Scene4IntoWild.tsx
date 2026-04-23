'use client'

import { forwardRef } from 'react'

interface Scene4IntoWildProps {
  scrollProgress?: number
}

const Scene4IntoWild = forwardRef<HTMLDivElement, Scene4IntoWildProps>(
  ({ scrollProgress = 0 }, ref) => {
    return (
      <div
        ref={ref}
        className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-emerald-950 via-green-950 to-slate-950 flex items-center justify-center"
      >
        {/* Dense forest depth background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/40 to-black/80" />

        {/* Depth layer 1 - Far trees */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(5, 100, 68, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%)',
            transform: `scale(${1 - scrollProgress * 0.1}) translateY(${scrollProgress * 50}px)`,
            filter: `blur(${20 - scrollProgress * 5}px)`,
          }}
        />

        {/* Depth layer 2 - Mid trees */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            background:
              'linear-gradient(90deg, rgba(10, 50, 40, 0.4) 0%, transparent 50%, rgba(10, 50, 40, 0.4) 100%)',
            transform: `translateY(${scrollProgress * 30}px) scaleY(${1 + scrollProgress * 0.05})`,
            filter: `blur(${10 - scrollProgress * 3}px)`,
            opacity: 0.6,
          }}
        />

        {/* Depth layer 3 - Foreground trees */}
        <div
          className="absolute left-0 right-0 h-1/3 bottom-0 depth-layer"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 20, 15, 0.8) 100%)',
            transform: `scaleY(${1 + scrollProgress * 0.15})`,
            transformOrigin: 'bottom',
            opacity: 0.9,
          }}
        />

        {/* Depth layer 4 - Center path glow */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px depth-layer"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(31, 163, 163, 0.3) 50%, transparent 100%)',
            boxShadow: `0 0 ${40 + scrollProgress * 20}px rgba(31, 163, 163, ${0.2 + scrollProgress * 0.2})`,
            transform: `translateX(-50%)`,
          }}
        />

        {/* Main text - center stage */}
        <div
          className="relative z-10 text-center max-w-4xl px-4"
          style={{
            transform: `translateY(${scrollProgress * 20}px) scale(${1 - scrollProgress * 0.1})`,
            opacity: 0.3 + scrollProgress * 0.7,
          }}
        >
          <h2 className="font-serif text-6xl md:text-8xl font-bold text-white text-cinematic">
            THIS IS WHERE
          </h2>
          <p className="text-6xl md:text-8xl font-serif font-bold text-teal-400 mt-4">
            IT STARTS
          </p>
          <p className="text-sm md:text-base text-gray-400 mt-8 tracking-widest max-w-2xl mx-auto">
            THE WILD DEMANDS YOUR PRESENCE
          </p>
        </div>

        {/* Animated particles - depth effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-teal-400 rounded-full opacity-40"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + (i * 40) % 60}%`,
                animation: `float ${4 + i * 0.5}s infinite ease-in-out`,
                filter: `blur(${i % 2}px)`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }
)

Scene4IntoWild.displayName = 'Scene4IntoWild'
export default Scene4IntoWild
