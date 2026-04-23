'use client'

import { forwardRef } from 'react'

interface Scene2PullProps {
  scrollProgress?: number
}

const Scene2Pull = forwardRef<HTMLDivElement, Scene2PullProps>(
  ({ scrollProgress = 0 }, ref) => {
    return (
      <div
        ref={ref}
        className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 via-slate-800 to-slate-900 flex items-center justify-center"
      >
        {/* Fog mist background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/30 to-transparent" />

        {/* Depth layer 1 - Far horizon */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            background: 'linear-gradient(to bottom, #1a2332 0%, #2d3e52 50%, #1a2332 100%)',
            opacity: 0.6,
            transform: `scale(${1 - scrollProgress * 0.05})`,
          }}
        />

        {/* Depth layer 2 - Road extending */}
        <div
          className="absolute inset-0 depth-layer flex items-center justify-center"
          style={{
            transform: `perspective(1000px) rotateX(${scrollProgress * 15}deg) translateZ(${scrollProgress * 100}px)`,
          }}
        >
          <div
            className="absolute w-64 h-96 md:w-96 md:h-full"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(100, 120, 140, 0.3) 50%, rgba(0, 0, 0, 0.6) 100%)',
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
              transform: `scaleY(${1 + scrollProgress * 0.3})`,
            }}
          />
        </div>

        {/* Depth layer 3 - Fog layers */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            backgroundImage: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
            transform: `translateY(${scrollProgress * 15}px)`,
            opacity: 0.8,
          }}
        />

        {/* Main text */}
        <div
          className="relative z-10 text-center max-w-4xl px-4"
          style={{
            opacity: Math.sin(scrollProgress * Math.PI) * 0.7 + 0.3,
            transform: `translateY(${scrollProgress * 20}px)`,
          }}
        >
          <h2 className="font-serif text-6xl md:text-8xl font-bold text-white text-cinematic">
            KEEP GOING
          </h2>
          <p className="text-sm md:text-base text-gray-400 mt-6 tracking-widest">
            THE ROAD REVEALS ITSELF
          </p>
        </div>

        {/* Ambient particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                left: `${(i * 20 + scrollProgress * 100) % 100}%`,
                top: `${30 + i * 15}%`,
                animation: `float ${3 + i}s infinite ease-in-out`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }
)

Scene2Pull.displayName = 'Scene2Pull'
export default Scene2Pull
