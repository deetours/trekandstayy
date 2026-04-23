'use client'

import { forwardRef, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

interface Scene10InvitationProps {
  scrollProgress?: number
}

const createParticleValue = (
  index: number,
  min: number,
  max: number,
  seed: number
) => {
  const normalized = (Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453) % 1
  return min + Math.abs(normalized) * (max - min)
}

const Scene10Invitation = forwardRef<HTMLDivElement, Scene10InvitationProps>(
  ({ scrollProgress = 0 }, ref) => {
    const [viewportHeight, setViewportHeight] = useState(1000)

    useEffect(() => {
      const updateViewportHeight = () => {
        setViewportHeight(window.innerHeight)
      }

      updateViewportHeight()
      window.addEventListener('resize', updateViewportHeight)

      return () => window.removeEventListener('resize', updateViewportHeight)
    }, [])

    const particles = useMemo(
      () =>
        Array.from({ length: 15 }, (_, i) => ({
          id: i,
          left: createParticleValue(i, 20, 80, 1),
          xOffset: createParticleValue(i, -50, 50, 2),
          duration: createParticleValue(i, 2, 4, 3),
          delay: createParticleValue(i, 0, 0.5, 4),
        })),
      []
    )

    return (
      <div
        ref={ref}
        className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-orange-950 via-amber-900 to-slate-950 flex items-center justify-center"
      >
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-900/40 to-black/80" />

        {/* Depth layer 1 - Fire base */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            background: `radial-gradient(ellipse at center, 
              rgba(249, 115, 22, ${0.2 + scrollProgress * 0.3}) 0%, 
              rgba(124, 45, 18, 0.2) 40%, 
              transparent 80%)`,
            transform: `scale(${1 - scrollProgress * 0.1})`,
          }}
        />

        {/* Depth layer 2 - Route marker transition */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 depth-layer"
          style={{
            width: '240px',
            height: '240px',
            background: `conic-gradient(from 0deg, 
              rgba(249, 115, 22, 0) 0deg,
              rgba(249, 115, 22, ${0.3 + scrollProgress * 0.5}) 45deg,
              rgba(251, 146, 60, ${0.2 + scrollProgress * 0.4}) 90deg,
              rgba(249, 115, 22, 0) 180deg)`,
            borderRadius: '50%',
            border: `2px solid rgba(249, 115, 22, ${0.3 + scrollProgress * 0.4})`,
            opacity: 0.5 + scrollProgress * 0.5,
            transform: `rotate(${scrollProgress * 180}deg) scale(${0.8 + scrollProgress * 0.4})`,
          }}
        />

        {/* Depth layer 3 - Light rays */}
        <div
          className="absolute inset-0 depth-layer"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 48%, rgba(251, 146, 60, ${0.05 + scrollProgress * 0.1}) 49%, rgba(251, 146, 60, ${0.05 + scrollProgress * 0.1}) 51%, transparent 52%),
              linear-gradient(-45deg, transparent 48%, rgba(251, 146, 60, ${0.05 + scrollProgress * 0.08}) 49%, rgba(251, 146, 60, ${0.05 + scrollProgress * 0.08}) 51%, transparent 52%)
            `,
            backgroundSize: '120px 120px',
            opacity: scrollProgress * 0.6,
          }}
        />

        {/* Main content */}
        <div
          className="relative z-10 text-center max-w-5xl px-4"
          style={{
            opacity: 0.4 + scrollProgress * 0.6,
            transform: `scale(${0.95 + scrollProgress * 0.05})`,
          }}
        >
          <h2 className="font-serif text-5xl md:text-7xl font-bold text-white text-cinematic mb-8">
            THE NEXT EXPEDITION AWAITS
          </h2>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-8 md:px-12 py-4 md:py-5 bg-orange-500 hover:bg-orange-600 text-white font-serif text-lg md:text-xl font-bold tracking-wider transition-all duration-300"
            style={{
              opacity: scrollProgress * 0.8,
              boxShadow: `0 0 ${20 + scrollProgress * 20}px rgba(249, 115, 22, 0.5)`,
            }}
          >
            JOIN THE RIDE →
          </motion.button>

          <p className="text-sm md:text-base text-gray-300 mt-12 tracking-widest">
            Limited spots available • Next departure in 30 days
          </p>
        </div>

        {/* Flame particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-orange-400 rounded-full"
              style={{
                left: `${particle.left}%`,
                bottom: '-10px',
                opacity: scrollProgress * 0.8,
              }}
              animate={{
                y: [-viewportHeight, -100],
                x: particle.xOffset,
                opacity: [scrollProgress * 0.8, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      </div>
    )
  }
)

Scene10Invitation.displayName = 'Scene10Invitation'
export default Scene10Invitation
