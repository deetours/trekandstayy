'use client'

import dynamic from 'next/dynamic'
import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SharedTripsHeader from '@/components/SharedTripsHeader'

gsap.registerPlugin(ScrollTrigger)

const TerrainCompassShard = dynamic(() => import('@/components/home/TerrainCompassShard'), {
  ssr: false,
})

const beats = [
  {
    id: 'edge',
    eyebrow: 'Trek & Stay',
    title: 'THIS IS NOT TOURISM',
    body: 'Small-group treks and mountain roads for people who want the real route.',
    className: 'beat beat-edge',
    titleClass: 'display-colossal',
  },
  {
    id: 'pull',
    eyebrow: 'The road starts moving',
    title: 'KEEP GOING',
    body: 'The city falls behind before you notice it.',
    className: 'beat beat-pull',
    titleClass: 'display-medium',
  },
  {
    id: 'normal',
    eyebrow: 'Comfort ends here',
    title: 'NO HOTELS. NO COMFORT.',
    body: 'Clear effort. Honest terrain. No brochure theatre.',
    className: 'beat beat-normal',
    titleClass: 'display-strong',
  },
  {
    id: 'wild',
    eyebrow: 'Cross the line',
    title: 'THIS IS WHERE IT STARTS',
    body: '',
    className: 'beat beat-wild',
    titleClass: 'display-medium',
  },
  {
    id: 'climb',
    eyebrow: 'Resistance',
    title: 'YOU WILL FEEL IT',
    body: 'In your lungs first.',
    className: 'beat beat-climb',
    titleClass: 'display-medium',
  },
  {
    id: 'break',
    eyebrow: '',
    title: 'WHY DID YOU COME?',
    body: '',
    className: 'beat beat-break',
    titleClass: 'display-whisper',
  },
  {
    id: 'release',
    eyebrow: '',
    title: 'THIS IS WHY',
    body: 'The routes worth remembering are usually the ones that ask something back.',
    className: 'beat beat-release',
    titleClass: 'display-strong display-light',
  },
  {
    id: 'summit',
    eyebrow: '',
    title: 'EARNED',
    body: '',
    className: 'beat beat-summit',
    titleClass: 'display-whisper display-summit',
  },
  {
    id: 'tribe',
    eyebrow: 'Blue hour',
    title: 'YOU ARE NOT ALONE',
    body: 'Trek & Stay runs routes for people who want challenge, clarity, and the right group around them.',
    className: 'beat beat-tribe',
    titleClass: 'display-medium display-warm',
  },
]

export default function CinematicHomepage() {
  const stageRef = useRef<HTMLElement>(null)
  const layerRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const beatRefs = useRef<Record<string, HTMLElement | null>>({})
  const ctaRef = useRef<HTMLDivElement>(null)
  const routeRef = useRef<SVGPathElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)
  const navVisibleRef = useRef(false)
  const [navVisible, setNavVisible] = useState(false)

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const isMobile = window.matchMedia('(max-width: 760px)').matches

    const lenis = new Lenis({
      duration: 1.45,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: isMobile,
      touchMultiplier: isMobile ? 1.05 : 1,
    })

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)

    const scrollDistance = window.innerHeight * (isMobile ? 7.35 : 9)

    const ctx = gsap.context(() => {
      const layers = layerRefs.current
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: `+=${scrollDistance}`,
          scrub: 1.35,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const shouldShow = self.progress > 0.08

            if (shouldShow !== navVisibleRef.current) {
              navVisibleRef.current = shouldShow
              setNavVisible(shouldShow)
            }
          },
        },
      })

      const beatElements = Object.values(beatRefs.current).filter(Boolean)
      const layerElements = Object.values(layers).filter(Boolean)

      gsap.set(beatElements, {
        autoAlpha: 0,
        yPercent: isMobile ? 4 : 10,
        filter: isMobile ? 'none' : 'blur(12px)',
        force3D: true,
      })
      gsap.set(beatRefs.current.edge, {
        autoAlpha: 1,
        yPercent: 0,
        filter: 'none',
        force3D: true,
      })
      gsap.set(ctaRef.current, {
        autoAlpha: 0,
        y: 32,
        scale: 0.96,
      })
      gsap.set(scrollCueRef.current, { autoAlpha: 1, y: 0 })
      gsap.set(routeRef.current, {
        strokeDasharray: 900,
        strokeDashoffset: 900,
      })
      gsap.set(layerElements, { autoAlpha: 0 })
      gsap.set(layers.road, { autoAlpha: 1, scale: 1.06 })

      const revealBeat = (
        id: string,
        start: number,
        hold = 0.08,
        options?: {
          enterDuration?: number
          exitDuration?: number
          exitYPercent?: number
        },
      ) => {
        const beat = beatRefs.current[id]
        if (!beat) return

        const enterDuration = options?.enterDuration ?? 0.045
        const exitDuration = options?.exitDuration ?? 0.05
        const exitYPercent = options?.exitYPercent ?? (isMobile ? -3 : -7)

        timeline
          .to(
            beat,
            {
              autoAlpha: 1,
              yPercent: 0,
              filter: 'none',
              duration: enterDuration,
            },
            start,
          )
          .to(beat, { autoAlpha: 1, duration: hold }, start + enterDuration)
          .to(
            beat,
            {
              autoAlpha: 0,
              yPercent: exitYPercent,
              filter: 'none',
              duration: exitDuration,
            },
            start + enterDuration + hold,
          )
      }

      if (isMobile) {
        revealBeat('edge', 0, 0.07, { exitDuration: 0.04 })
        revealBeat('pull', 0.17, 0.06, { exitDuration: 0.04 })
        revealBeat('normal', 0.3, 0.07, { exitDuration: 0.04 })
        revealBeat('wild', 0.45, 0.05, { exitDuration: 0.035, exitYPercent: -2 })
        revealBeat('climb', 0.57, 0.06, { exitDuration: 0.04 })
        revealBeat('break', 0.685, 0.075, { exitDuration: 0.04, exitYPercent: -2 })
        revealBeat('release', 0.8, 0.08, { exitDuration: 0.04 })
        revealBeat('summit', 0.89, 0.085, { enterDuration: 0.04, exitDuration: 0.035, exitYPercent: -1 })
        revealBeat('tribe', 0.945, 0.055, { enterDuration: 0.04, exitDuration: 0.03, exitYPercent: -1 })
      } else {
        revealBeat('edge', 0, 0.115)
        revealBeat('pull', 0.11, 0.07)
        revealBeat('normal', 0.21, 0.08)
        revealBeat('wild', 0.32, 0.055)
        revealBeat('climb', 0.43, 0.07)
        revealBeat('break', 0.535, 0.105)
        revealBeat('release', 0.66, 0.075)
        revealBeat('summit', 0.76, 0.105)
        revealBeat('tribe', 0.875, 0.055)
      }

      timeline.to(scrollCueRef.current, { autoAlpha: 0, y: 12, duration: 0.04 }, 0.08)

      timeline
        .to(layers.road, { scale: 1.22, yPercent: -8, duration: 0.25 }, 0)
        .to(layers.forest, { autoAlpha: 1, scale: 1.12, duration: 0.18 }, 0.18)
        .to(layers.road, { autoAlpha: 0, duration: 0.12 }, 0.28)
        .to(layers.forest, { scale: 1.24, yPercent: -7, duration: 0.25 }, 0.22)
        .to(layers.rock, { autoAlpha: 1, scale: 1.08, duration: 0.14 }, 0.34)
        .to(layers.forest, { autoAlpha: 0.2, duration: 0.16 }, 0.42)
        .to(layers.rock, { scale: 1.22, yPercent: -12, duration: 0.24 }, 0.38)
        .to(layers.mountain, { autoAlpha: 1, scale: 1.1, duration: 0.18 }, 0.55)
        .to(layers.rock, { autoAlpha: 0, duration: 0.14 }, 0.58)
        .to(layers.mountain, { scale: 1.2, yPercent: -9, duration: 0.28 }, 0.57)
        .to(layers.summit, { autoAlpha: 1, scale: 1.02, duration: 0.18 }, 0.72)
        .to(layers.mountain, { autoAlpha: 0.1, duration: 0.18 }, 0.76)
        .to(layers.summit, { scale: 1.08, yPercent: -3, duration: 0.18 }, 0.78)
        .to(layers.fire, { autoAlpha: 1, scale: 1.06, duration: 0.12 }, 0.86)
        .to(layers.summit, { autoAlpha: 0, duration: 0.14 }, 0.87)
        .to(layers.fire, { scale: 1.16, yPercent: -4, duration: 0.14 }, 0.88)

      timeline
        .to(stage, { '--cinema-warmth': 0.12, duration: 0.2 }, 0)
        .to(stage, { '--cinema-cold': 0.38, '--cinema-dark': 0.78, duration: 0.18 }, 0.48)
        .to(stage, { '--cinema-light': 0.44, '--cinema-dark': 0.24, duration: 0.2 }, 0.66)
        .to(stage, { '--cinema-light': 0.72, duration: 0.12 }, 0.76)
        .to(stage, { '--cinema-warmth': 0.5, '--cinema-dark': 0.48, duration: 0.16 }, 0.86)

      timeline
        .to(routeRef.current, { strokeDashoffset: 0, duration: 0.08 }, isMobile ? 0.93 : 0.9)
        .to(
          ctaRef.current,
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.06, ease: 'power3.out' },
          isMobile ? 0.955 : 0.925,
        )
    }, stage)

    ScrollTrigger.refresh()

    return () => {
      ctx.revert()
      lenis.destroy()
      gsap.ticker.remove(raf)
    }
  }, [])

  return (
    <main className="film-root">
      <SharedTripsHeader
        mode="home"
        actionHref="/trips"
        actionLabel="Explore routes"
        visible={navVisible}
        compactOnScroll={false}
      />

      <section id="top" ref={stageRef} className="film-stage" aria-label="Cinematic adventure homepage">
        <div className="film-world">
          <div
            ref={(el) => {
              layerRefs.current.road = el
            }}
            className="world-layer world-road"
          />
          <div
            ref={(el) => {
              layerRefs.current.forest = el
            }}
            className="world-layer world-forest"
          />
          <div
            ref={(el) => {
              layerRefs.current.rock = el
            }}
            className="world-layer world-rock"
          />
          <div
            ref={(el) => {
              layerRefs.current.mountain = el
            }}
            className="world-layer world-mountain"
          />
          <div
            ref={(el) => {
              layerRefs.current.summit = el
            }}
            className="world-layer world-summit"
          />
          <div
            ref={(el) => {
              layerRefs.current.fire = el
            }}
            className="world-layer world-fire"
          />
        </div>

        <div className="film-atmosphere atmosphere-depth" />
        <div className="film-atmosphere atmosphere-wind" />
        <div className="film-light" />
        <TerrainCompassShard />

        <div className="film-copy-field">
          {beats.map((beat) => (
            <article
              key={beat.id}
              ref={(el) => {
                beatRefs.current[beat.id] = el
              }}
              className={beat.className}
            >
              {beat.eyebrow && <span className="beat-eyebrow">{beat.eyebrow}</span>}
              <h1 className={beat.titleClass}>{beat.title}</h1>
              {beat.body && <p className="beat-body">{beat.body}</p>}
            </article>
          ))}
        </div>

        <div ref={scrollCueRef} className="scroll-cue" aria-hidden="true">
          <span>Scroll to enter</span>
        </div>

        <div ref={ctaRef} id="book" className="final-invitation">
          <svg className="route-signal" viewBox="0 0 520 150" aria-hidden="true">
            <path
              ref={routeRef}
              d="M8 118 C 110 34, 178 122, 250 70 S 394 16, 510 62"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="cta-kicker">Trek &amp; Stay / small-group routes</span>
          <h2 className="cta-title">Choose the route that fits.</h2>
          <p className="cta-copy">
            Explore Karnataka treks, Maharashtra climbs, and Himachal roads with clear effort levels, small groups,
            and grounded route leadership.
          </p>
          <p className="route-teaser">Karnataka treks / Maharashtra climbs / Himachal roads</p>
          <div className="cta-actions">
            <motion.a
              href="/trips"
              className="expedition-button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              Choose Your Route
              <span aria-hidden="true">-&gt;</span>
            </motion.a>
            <a href="#top" className="quiet-link">
              Start again
            </a>
          </div>
        </div>

        <div className="fixed-grain" />
        <div className="film-vignette" />
      </section>
    </main>
  )
}
