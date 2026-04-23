'use client'

import { forwardRef } from 'react'

interface Scene6BreakPointProps {
  scrollProgress?: number
}

const Scene6BreakPoint = forwardRef<HTMLDivElement, Scene6BreakPointProps>(
  ({ scrollProgress = 0 }, ref) => {
    return (
      <div
        ref={ref}
        className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-blue-900/30 to-slate-950 flex items-center justify-center"
      >
        {/* Dense fog base */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/50 to-slate-950" />

        {/* Depth layer 1 - Far fog */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.3) 0%, rgba(0, 0, 0, 0.95) 100%)',
            transform: `scale(${1 + scrollProgress * 0.15})`,
            filter: `blur(${30 + scrollProgress * 20}px)`,
            opacity: 0.8,
          }}
        />

        {/* Depth layer 2 - Cold mist */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            background: 'linear-gradient(180deg, rgba(191, 219, 254, 0.1) 0%, rgba(100, 116, 139, 0.2) 100%)',
            transform: `translateY(${scrollProgress * 40}px)`,
            opacity: 0.4 + scrollProgress * 0.4,
          }}
        />

        {/* Depth layer 3 - Visibility reduction */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            backgroundImage: 'radial-gradient(circle, transparent 1px, rgba(0, 0, 0, 0.1) 1px)',
            backgroundSize: '50px 50px',
            transform: `scale(${1 - scrollProgress * 0.05})`,
            opacity: 0.3 + scrollProgress * 0.5,
          }}
        />

        {/* Depth layer 4 - Whiteout center */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 depth-layer"
          style={{
            background: 'radial-gradient(circle, rgba(191, 219, 254, 0.3) 0%, transparent 70%)',
            filter: `blur(${60 - scrollProgress * 30}px)`,
            transform: `scale(${0.5 + scrollProgress * 1}) translate(-50%, -50%)`,
            opacity: scrollProgress,
          }}
        />

        {/* Main headline - questioning */}
        <div
          className="relative z-10 text-center max-w-4xl px-4"
          style={{
            transform: `translateY(${scrollProgress * 10}px)`,
            opacity: 0.4 + scrollProgress * 0.6,
          }}
        >
          <p className="text-sm md:text-base text-blue-300/60 tracking-widest mb-4">
            THIS IS WHERE DOUBT CREEPS IN
          </p>
          <h2 className="font-serif text-5xl md:text-7xl font-bold text-white text-cinematic">
            WHY DID YOU
          </h2>
          <p className="text-5xl md:text-7xl font-serif font-bold text-blue-300/80 mt-3">
            COME?
          </p>
        </div>

        {/* Atmospheric layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 depth-layer"
              style={{
                background: `radial-gradient(ellipse at ${50 + (i - 1) * 20}% 50%, rgba(191, 219, 254, ${0.05 * (1 - scrollProgress)}) 0%, transparent 60%)`,
                opacity: 0.4,
              }}
            />
          ))}
        </div>
      </div>
    )
  }
)

Scene6BreakPoint.displayName = 'Scene6BreakPoint'
export default Scene6BreakPoint
