'use client'

import { forwardRef } from 'react'

interface Scene1EdgeProps {
  scrollProgress?: number
}

const Scene1Edge = forwardRef<HTMLDivElement, Scene1EdgeProps>(
  ({ scrollProgress = 0 }, ref) => {
    return (
      <div
        ref={ref}
        className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center"
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

        {/* Depth layer 1 - Background mist */}
        <div
          className="absolute inset-0 depth-layer opacity-40"
          style={{
            backgroundImage: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.8) 100%)',
            transform: `translateZ(0) scale(${1 + scrollProgress * 0.1})`,
          }}
        />

        {/* Depth layer 2 - Silhouette mountain */}
        <div
          className="absolute bottom-0 left-0 right-0 h-96 depth-layer"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1400 400%22%3E%3Cpath d=%22M0,200 Q350,50 700,150 T1400,150 L1400,400 L0,400 Z%22 fill=%22%230a0e27%22/%3E%3C/svg%3E")',
            backgroundSize: 'cover',
            backgroundPosition: 'bottom',
            transform: `translateY(${scrollProgress * 10}px) scale(1.1)`,
          }}
        />

        {/* Depth layer 3 - Bike silhouette */}
        <div
          className="absolute bottom-24 left-1/3 depth-layer"
          style={{
            width: '180px',
            height: '120px',
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 150%22%3E%3Ccircle cx=%2250%22 cy=%22100%22 r=%2245%22 fill=%22none%22 stroke=%22%23ffffff%22 stroke-width=%222%22/%3E%3Ccircle cx=%22150%22 cy=%22100%22 r=%2245%22 fill=%22none%22 stroke=%22%23ffffff%22 stroke-width=%222%22/%3E%3Cline x1=%2250%22 y1=%2240%22 x2=%22150%22 y2=%2280%22 stroke=%22%23ffffff%22 stroke-width=%222%22/%3E%3Cline x1=%22150%22 y1=%2280%22 x2=%22180%22 y2=%2270%22 stroke=%22%23ffffff%22 stroke-width=%222%22/%3E%3C/svg%3E")',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 0.7 + scrollProgress * 0.3,
            transform: `translateY(${scrollProgress * 20}px) scale(${1 - scrollProgress * 0.2})`,
          }}
        />

        {/* Main headline */}
        <div
          className="relative z-10 text-center max-w-4xl px-4"
          style={{
            opacity: 1 - scrollProgress * 0.5,
            transform: `translateY(${scrollProgress * 30}px)`,
          }}
        >
          <h1 className="font-serif text-6xl md:text-8xl font-bold text-white text-cinematic mb-4">
            THIS IS NOT TOURISM
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light tracking-widest">
            WHERE ADVENTURE BECOMES REAL
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-gray-400 text-sm uppercase tracking-widest">Scroll</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    )
  }
)

Scene1Edge.displayName = 'Scene1Edge'
export default Scene1Edge
