'use client'

import { forwardRef } from 'react'

interface Scene8SummitProps {
  scrollProgress?: number
}

const Scene8Summit = forwardRef<HTMLDivElement, Scene8SummitProps>(
  ({ scrollProgress = 0 }, ref) => {
    return (
      <div
        ref={ref}
        className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-blue-400 via-blue-300 to-slate-100 flex items-center justify-center"
      >
        {/* Depth layer 1 - Far landscape */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            background:
              'linear-gradient(to bottom, rgba(96, 165, 250, 0.4) 0%, rgba(226, 232, 240, 0.3) 100%)',
            transform: `scale(${1 + scrollProgress * 0.08}) translateY(${scrollProgress * 30}px)`,
          }}
        />

        {/* Depth layer 2 - Horizon line */}
        <div
          className="absolute left-0 right-0 h-px top-1/3 depth-layer"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(100, 116, 139, 0.4) 50%, transparent 100%)',
            boxShadow: `0 10px 30px rgba(0, 0, 0, ${0.2 + scrollProgress * 0.1})`,
            opacity: 0.6,
          }}
        />

        {/* Depth layer 3 - Light shafts */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            backgroundImage: `
              linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%),
              radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)
            `,
            transform: `scale(${1 - scrollProgress * 0.05})`,
            opacity: 0.7,
          }}
        />

        {/* Depth layer 4 - Foreground mist */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/4 depth-layer"
          style={{
            background: 'linear-gradient(to top, rgba(148, 163, 184, 0.3), transparent)',
            opacity: 0.6 - scrollProgress * 0.3,
          }}
        />

        {/* Main headline - stillness */}
        <div
          className="relative z-10 text-center max-w-4xl px-4"
          style={{
            transform: `translateY(${scrollProgress * 15}px)`,
            opacity: 0.6 + scrollProgress * 0.4,
          }}
        >
          <p className="text-sm md:text-base text-slate-600 tracking-widest mb-6 uppercase font-light">
            Stillness. Clarity. Purpose.
          </p>
          <h2 className="font-serif text-7xl md:text-9xl font-bold text-slate-800 text-cinematic">
            EARNED
          </h2>
          <p className="text-base md:text-lg text-slate-600 mt-8 tracking-wide max-w-2xl mx-auto">
            Every mile shaped you. Every moment defined you.
          </p>
        </div>

        {/* Peaceful floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${15 + i * 18}%`,
                top: `${25 + (i * 15) % 30}%`,
                opacity: (0.2 + scrollProgress * 0.3) * (1 - Math.abs((i - 2) * 0.3)),
                animation: `float ${4 + i}s infinite ease-in-out`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }
)

Scene8Summit.displayName = 'Scene8Summit'
export default Scene8Summit
