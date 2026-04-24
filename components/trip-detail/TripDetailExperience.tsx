'use client'

import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SharedTripsHeader from '@/components/SharedTripsHeader'
import { createRouteQuestionHref, formatDate, formatMoney, formatShortDate } from '@/lib/trips/booking-store'
import type { Trip, TripItineraryDay, TripPerson, TripProofMoment } from '@/lib/trips/types'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

type TripDetailExperienceProps = {
  trip: Trip
}

type DetailContent = {
  heroLine: string
  altitudeLine: string
  emotionalHook: string
  realityChecks: string[]
  itinerary: TripItineraryDay[]
  included: string[]
  notIncluded: string[]
  proof: TripProofMoment[]
  captains: TripPerson[]
  bestSeason: string
  finalLine: string
}

export default function TripDetailExperience({ trip }: TripDetailExperienceProps) {
  const rootRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const heroImageRef = useRef<HTMLDivElement>(null)
  const heroDepthRef = useRef<HTMLDivElement>(null)
  const routeLineRef = useRef<SVGPathElement>(null)
  const mediaRefs = useRef<HTMLElement[]>([])
  const revealRefs = useRef<HTMLElement[]>([])
  const shouldReduceMotion = useReducedMotion()

  const detail = useMemo(() => getDetailContent(trip), [trip])
  const bookingIntentHref = useMemo(() => `/trips/${trip.slug}/book`, [trip.slug])
  const questionIntentHref = useMemo(() => createRouteQuestionHref(trip), [trip])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const hero = heroRef.current
      const revealTargets = gsap.utils.toArray<HTMLElement>('[data-animate]', root)
      const ctaTargets = gsap.utils.toArray<HTMLElement>('[data-cta-emphasis]', root)
      const itineraryRows = gsap.utils.toArray<HTMLElement>('[data-itinerary-row]', root)
      const itineraryProgress = root.querySelector<HTMLElement>('[data-itinerary-progress]')
      const allMotionTargets = [
        heroImageRef.current,
        heroDepthRef.current,
        routeLineRef.current,
        itineraryProgress,
        ...mediaRefs.current,
        ...revealTargets,
        ...ctaTargets,
        ...itineraryRows,
      ].filter(Boolean)

      if (shouldReduceMotion) {
        gsap.set(allMotionTargets, {
          clearProps: 'all',
          autoAlpha: 1,
          filter: 'none',
        })
        return
      }

      if (hero) {
        gsap.to(heroImageRef.current, {
          scale: 1.12,
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        })

        gsap.to(heroDepthRef.current, {
          yPercent: -14,
          rotateX: 1.6,
          rotateY: -1.4,
          scale: 1.045,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

        gsap.fromTo(
          routeLineRef.current,
          { strokeDasharray: 760, strokeDashoffset: 760 },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: '85% top',
              scrub: 0.75,
              invalidateOnRefresh: true,
            },
          },
        )
      }

      revealRefs.current.forEach((element) => {
        const revealItems = gsap.utils.toArray<HTMLElement>('[data-animate]', element)
        if (!revealItems.length) return

        gsap.fromTo(
          revealItems,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: element,
              start: 'top 82%',
              once: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })

      mediaRefs.current.forEach((element) => {
        gsap.fromTo(
          element,
          { scale: 1.04, yPercent: -2 },
          {
            scale: 1.11,
            yPercent: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: element.parentElement ?? element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        )
      })

      if (itineraryRows.length) {
        gsap.fromTo(
          itineraryRows,
          { autoAlpha: 0, x: -18 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.58,
            ease: 'power3.out',
            stagger: 0.075,
            scrollTrigger: {
              trigger: itineraryRows[0].parentElement,
              start: 'top 78%',
              once: true,
              invalidateOnRefresh: true,
            },
          },
        )
      }

      if (itineraryProgress) {
        gsap.fromTo(
          itineraryProgress,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: itineraryProgress.parentElement,
              start: 'top 76%',
              end: 'bottom 42%',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        )
      }

      ctaTargets.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 18, scale: 0.975, '--cta-glow': 0 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            '--cta-glow': 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 84%',
              once: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })

    }, root)

    const refresh = () => ScrollTrigger.refresh()
    ScrollTrigger.refresh()
    window.addEventListener('load', refresh, { once: true })
    document.fonts?.ready.then(refresh).catch(() => undefined)

    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [shouldReduceMotion])

  const registerReveal = (element: HTMLElement | null) => {
    if (element && !revealRefs.current.includes(element)) {
      revealRefs.current.push(element)
    }
  }

  const registerMedia = (element: HTMLElement | null) => {
    if (element && !mediaRefs.current.includes(element)) {
      mediaRefs.current.push(element)
    }
  }

  return (
    <main ref={rootRef} className="trip-detail-root min-h-[100dvh] bg-[#050807] text-[#F5F4F1]">
      <SharedTripsHeader actionHref="#booking" actionLabel="Reserve this trip" />

      <section ref={heroRef} className="trip-hero relative isolate flex min-h-[100dvh] items-end overflow-hidden px-4 pb-8 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pb-12 xl:pb-16">
        <div
          ref={heroImageRef}
          className="absolute inset-0 -z-30 bg-cover bg-center"
          style={{ backgroundImage: `url(${trip.image})` }}
        />
        <div ref={heroDepthRef} className="trip-hero-depth absolute inset-0 -z-20 opacity-80">
          <div className="trip-depth-layer trip-depth-left" />
          <div className="trip-depth-layer trip-depth-right" />
          <svg className="trip-route-draw" viewBox="0 0 720 220" aria-hidden="true">
            <path
              ref={routeLineRef}
              d="M24 160 C 148 72, 252 178, 356 104 S 542 34, 696 92"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(5,8,7,0.92),rgba(5,8,7,0.4)_48%,rgba(5,8,7,0.82)),linear-gradient(180deg,rgba(5,8,7,0.18),#050807_94%)]" />
        <div className="trip-detail-topography absolute inset-0 -z-10 opacity-[0.14]" />

        <div className="mx-auto grid w-full max-w-[1440px] gap-7 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#CFAF6B]">
              {detail.altitudeLine}
            </p>
            <h1 className="trip-hero-title mt-4 max-w-5xl font-heading text-[clamp(3.6rem,14vw,10.5rem)] leading-[0.82] tracking-[0.01em] text-[#F5F4F1] sm:mt-5">
              {trip.title}
            </h1>
            <p className="trip-hero-copy mt-4 max-w-[38rem] text-xl leading-[1.08] tracking-[-0.035em] text-[#F5F4F1]/88 sm:mt-5 md:text-[2.4rem] xl:text-[3.15rem]">
              {detail.heroLine}
            </p>
            <p className="mt-6 max-w-[34rem] text-[0.98rem] leading-7 text-[#F5F4F1]/72">
              Trek &amp; Stay confirms route fit, dates, payment steps, and cancellation terms before you commit.
            </p>
          </motion.div>

          <motion.aside
            className="rounded-[1.35rem] border border-[#F5F4F1]/10 bg-[#050807]/38 p-4 backdrop-blur-xl sm:p-5 lg:mb-1 lg:rounded-none lg:border-y-0 lg:border-r-0 lg:bg-transparent lg:p-0 lg:pl-6"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#BCC2BE]">
              Current departure
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:mt-6 sm:gap-4">
              <Metric label="Duration" value={trip.durationLabel} />
              <Metric label="Effort" value={trip.difficulty} />
              <Metric label="Group" value={trip.groupSize ?? 'Small group'} />
              <Metric label="Spots" value={trip.spotsLeft ? `${trip.spotsLeft} left` : 'Open'} />
            </div>
            <div className="mt-6 flex flex-col gap-3 min-[420px]:flex-row sm:mt-8">
              <Link
                href="#booking"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#F5F4F1] px-5 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#0F2E23] transition duration-300 hover:bg-[#CFAF6B] active:translate-y-[1px] sm:h-12 sm:px-6 sm:text-[0.66rem]"
              >
                Reserve this trip
              </Link>
              <Link
                href={questionIntentHref}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#F5F4F1]/10 px-5 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#F5F4F1]/76 transition hover:border-[#CFAF6B]/32 hover:text-[#F5F4F1] sm:border-0 sm:px-0 sm:text-sm sm:normal-case sm:tracking-normal"
              >
                Ask a route question
              </Link>
            </div>
          </motion.aside>
        </div>
      </section>

      <BookingDock trip={trip} detail={detail} questionIntentHref={questionIntentHref} />

      <section ref={registerReveal} className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-32">
        <div data-animate>
          <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#CFAF6B]">
            Why this route
          </p>
          <h2 className="mt-5 max-w-lg font-heading text-5xl leading-[0.9] tracking-[0.01em] md:text-[4.35rem]">
            WHY THIS ROUTE WORKS
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-[0.92fr_1.08fr]">
          <p data-animate className="self-end text-[1.6rem] leading-[1.12] tracking-[-0.03em] text-[#F5F4F1]/84 md:text-[2.2rem]">
            {detail.emotionalHook}
          </p>
          <div data-animate className="relative min-h-[420px] overflow-hidden rounded-[1.8rem] border border-[#F5F4F1]/10">
            <div
              ref={registerMedia}
              className="absolute inset-0 bg-cover bg-center trip-slow-image"
              style={{ backgroundImage: `url(${trip.gallery?.[0] ?? trip.image})` }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(5,8,7,0.84))]" />
            <p className="absolute bottom-6 left-6 right-6 max-w-sm text-sm leading-7 text-[#F5F4F1]/72">
              Long roads, thin air, and enough silence for the group to become real.
            </p>
          </div>
        </div>
      </section>

      <section ref={registerReveal} className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid overflow-hidden border-y border-[#F5F4F1]/12 lg:grid-cols-[0.82fr_1.18fr]">
          <div data-animate className="py-10 pr-0 lg:py-16 lg:pr-10">
            <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#CFAF6B]">
              Reality check
            </p>
            <h2 className="mt-5 max-w-xl font-heading text-5xl leading-[0.9] md:text-[4.35rem]">
              BEFORE YOU BOOK, KNOW THIS
            </h2>
          </div>
          <div className="divide-y divide-[#F5F4F1]/10 border-t border-[#F5F4F1]/12 lg:border-l lg:border-t-0">
            {detail.realityChecks.map((check, index) => (
              <motion.div
                key={check}
                data-animate
                className="grid gap-4 py-6 lg:grid-cols-[90px_minmax(0,1fr)] lg:px-8"
                initial={{ opacity: 0, x: index % 2 === 0 ? -12 : 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.55, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#CFAF6B]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="max-w-2xl text-[1.08rem] leading-8 text-[#F5F4F1]/82 md:text-[1.15rem]">{check}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={registerReveal} className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div data-animate>
            <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#CFAF6B]">
              Controlled clarity
            </p>
            <h2 className="mt-5 font-heading text-5xl leading-[0.9] md:text-[4.35rem]">KNOW WHAT HAPPENS</h2>
          </div>
          <p data-animate className="max-w-2xl text-base leading-8 text-[#F5F4F1]/68">
            You should understand the route quickly, without reading through brochure language.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.72fr)]">
          <ItineraryAccordion days={detail.itinerary} />
          <div className="space-y-6">
            <div data-animate>
              <IncludedContrast included={detail.included} notIncluded={detail.notIncluded} />
            </div>
            <div data-animate>
              <LogisticsPanel trip={trip} bestSeason={detail.bestSeason} />
            </div>
          </div>
        </div>
      </section>

      <TrustLedger trip={trip} />

      <section ref={registerReveal} className="py-20 lg:py-28">
        <div className="mx-auto mb-10 grid max-w-[1440px] gap-6 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:items-end">
          <div data-animate>
            <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#CFAF6B]">
              Trace evidence
            </p>
            <h2 className="mt-5 font-heading text-5xl leading-[0.9] md:text-[4.35rem]">RAW PROOF, NOT TESTIMONIALS</h2>
          </div>
          <p data-animate className="max-w-2xl text-base leading-8 text-[#F5F4F1]/68">
            Short field notes from people who were actually there, so the trust signal stays concrete.
          </p>
        </div>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {detail.proof.map((moment) => (
              <ProofFrame key={moment.quote} moment={moment} />
            ))}
          </div>
        </div>
      </section>

      <section ref={registerReveal} id="support" className="mx-auto max-w-[1440px] px-4 pb-28 pt-8 sm:px-6 lg:px-8 lg:pb-20">
        <div className="grid gap-10 border-t border-[#F5F4F1]/12 pt-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div data-animate>
            <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#CFAF6B]">
              People behind the road
            </p>
            <h2 className="mt-5 font-heading text-5xl leading-[0.9] md:text-[4.35rem]">WHO IS RESPONSIBLE FOR THE ROAD</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {detail.captains.map((person) => (
              <CaptainCard key={person.name} person={person} />
            ))}
          </div>
        </div>

        <div id="booking" data-cta-emphasis className="trip-final-booking mt-16 grid overflow-hidden rounded-[2rem] border border-[#F5F4F1]/10 bg-[#0F2E23]/76 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[380px] overflow-hidden">
            <div
              ref={registerMedia}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${trip.gallery?.[1] ?? trip.image})` }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,7,0.2),rgba(5,8,7,0.84)),linear-gradient(180deg,transparent,rgba(5,8,7,0.72))]" />
          </div>
          <div className="p-7 md:p-10 lg:p-12">
            <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#CFAF6B]">
              Next departure / {formatDate(trip.nextDeparture)}
            </p>
            <h2 className="mt-5 font-heading text-6xl leading-[0.88] md:text-8xl">
              RESERVE YOUR SEAT FOR {formatShortDate(trip.nextDeparture)}
            </h2>
            <p className="mt-5 max-w-[33rem] text-base leading-8 text-[#F5F4F1]/74">
              {detail.finalLine} Send a request first. You can confirm terms, safety fit, and payment details before
              you commit.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-3 border-y border-[#F5F4F1]/10 py-5">
              <Metric label="Price" value={formatMoney(trip.startingPrice)} />
              <Metric label="Spots" value={trip.spotsLeft ? `${trip.spotsLeft} left` : 'Open'} />
              <Metric label="Start" value={trip.startingPoint} />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={bookingIntentHref}
                className="inline-flex h-[3.25rem] items-center justify-center rounded-full bg-[#F5F4F1] px-7 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#0F2E23] transition duration-300 hover:bg-[#CFAF6B] active:translate-y-[1px]"
              >
                Reserve this trip
              </Link>
              <Link
                href={questionIntentHref}
                className="inline-flex h-[3.25rem] items-center justify-center rounded-full border border-[#F5F4F1]/12 px-7 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#F5F4F1]/78 transition duration-300 hover:border-[#CFAF6B]/36 hover:text-[#CFAF6B] active:translate-y-[1px]"
              >
                Ask a route question
              </Link>
            </div>
            <p className="mt-5 text-sm leading-6 text-[#F5F4F1]/62">
              No email back-and-forth to get started. The next step is a calm booking form, then a direct payment page
              with clear verification.
            </p>
            <Link href="/about" className="mt-7 inline-block text-sm text-[#F5F4F1]/62 transition hover:text-[#F5F4F1]">
              See how Trek &amp; Stay runs trips
            </Link>
          </div>
        </div>
      </section>

      <MobileBookingBar trip={trip} />
    </main>
  )
}

function BookingDock({
  trip,
  detail,
  questionIntentHref,
}: {
  trip: Trip
  detail: DetailContent
  questionIntentHref: string
}) {
  const facts = [
    ['Date', formatShortDate(trip.nextDeparture)],
    ['Price', formatMoney(trip.startingPrice)],
    ['Spots', trip.spotsLeft ? `${trip.spotsLeft} left` : 'Open'],
    ['Effort', trip.difficulty],
    ['Start', trip.startingPoint],
  ]

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="booking-dock grid gap-6 rounded-[1.7rem] border border-[#F5F4F1]/10 bg-[#07110D]/86 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-6">
        <div>
          <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#CFAF6B]">
            Decide in 30 seconds
          </p>
          <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-5 md:grid-cols-5">
            {facts.map(([label, value]) => (
              <Metric key={label} label={label} value={value} />
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-[#F5F4F1]/62">
            Trek &amp; Stay confirms cancellation terms, payment steps, weather-change rules, and route fit before you
            pay. The captain can answer practical questions before you commit.
            {detail.bestSeason ? ` Best season: ${detail.bestSeason}.` : ''}
          </p>
          <p className="mt-3 text-sm leading-6 text-[#F5F4F1]/52">
            Need to understand the operating style first?{' '}
            <Link href="/about" className="text-[#CFAF6B] transition hover:text-[#F5F4F1]">
              See how Trek &amp; Stay runs trips.
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href="#booking"
            className="inline-flex h-[3.15rem] items-center justify-center rounded-full bg-[#F5F4F1] px-6 font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#0F2E23] transition duration-300 hover:bg-[#CFAF6B] active:translate-y-[1px]"
          >
            Reserve this trip
          </Link>
          <Link
            href={questionIntentHref}
            className="inline-flex h-[3.15rem] items-center justify-center rounded-full border border-[#F5F4F1]/14 px-6 font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#F5F4F1]/72 transition duration-300 hover:border-[#CFAF6B]/45 hover:text-[#CFAF6B] active:translate-y-[1px]"
          >
            Ask a route question
          </Link>
        </div>
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-sans text-[0.56rem] font-bold uppercase tracking-[0.12em] text-[#BCC2BE]">{label}</p>
      <p className="mt-1.5 font-mono text-sm font-semibold uppercase tracking-[0.04em] text-[#F5F4F1]">{value}</p>
    </div>
  )
}

function ItineraryAccordion({ days }: { days: TripItineraryDay[] }) {
  const [openDay, setOpenDay] = useState(days[0]?.day ?? 1)

  return (
    <div className="divide-y divide-[#F5F4F1]/10 border-y border-[#F5F4F1]/10">
      {days.map((day) => {
        const isOpen = openDay === day.day

        return (
          <div key={day.day} className="py-2">
            <button
              type="button"
              onClick={() => setOpenDay(isOpen ? -1 : day.day)}
              className="grid w-full gap-4 py-5 text-left transition duration-300 active:translate-y-[1px] md:grid-cols-[90px_minmax(0,1fr)_24px]"
              aria-expanded={isOpen}
            >
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#CFAF6B]">
                Day {String(day.day).padStart(2, '0')}
              </span>
              <span>
                <span className="block font-heading text-[2.2rem] leading-none tracking-[0.01em] text-[#F5F4F1]">
                  {day.route}
                </span>
                <span className="mt-2.5 block text-sm leading-6 text-[#F5F4F1]/68">{day.highlight}</span>
              </span>
              <span className="text-2xl leading-none text-[#CFAF6B]">{isOpen ? '-' : '+'}</span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 pt-1 md:ml-[90px] max-w-2xl text-base leading-8 text-[#F5F4F1]/72">{day.details}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

function IncludedContrast({ included, notIncluded }: { included: string[]; notIncluded: string[] }) {
  return (
    <div className="grid overflow-hidden rounded-[1.6rem] border border-[#F5F4F1]/10 bg-[#07110D]/72 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <InclusionColumn title="Included" items={included} />
      <InclusionColumn title="Not included" items={notIncluded} muted />
    </div>
  )
}

function InclusionColumn({ title, items, muted = false }: { title: string; items: string[]; muted?: boolean }) {
  return (
    <div className={cn('p-6', muted ? 'border-t border-[#F5F4F1]/10 md:border-l md:border-t-0 lg:border-l-0 lg:border-t xl:border-l xl:border-t-0' : '')}>
      <p className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#CFAF6B]">{title}</p>
      <div className="mt-5 space-y-3.5">
        {items.map((item) => (
          <div key={item} className="grid grid-cols-[20px_minmax(0,1fr)] gap-3">
            <span className={cn('mt-2 h-px w-4', muted ? 'bg-[#F5F4F1]/26' : 'bg-[#CFAF6B]')} />
            <p className={cn('text-sm leading-7', muted ? 'text-[#F5F4F1]/58' : 'text-[#F5F4F1]/72')}>{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function LogisticsPanel({ trip, bestSeason }: { trip: Trip; bestSeason: string }) {
  const items = [
    ['Duration', trip.durationLabel],
    ['Difficulty', trip.difficulty],
    ['Start point', trip.startingPoint],
    ['Best season', bestSeason],
    ['Group size', trip.groupSize ?? 'Small group'],
    ['Altitude', trip.altitude ?? 'Route dependent'],
  ]

  return (
    <div className="rounded-[1.6rem] border border-[#F5F4F1]/10 bg-[#0F2E23]/54 p-6">
      <p className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#CFAF6B]">Logistics</p>
      <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-7">
        {items.map(([label, value]) => (
          <Metric key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  )
}

function TrustLedger({ trip }: { trip: Trip }) {
  const trustItems = [
    ['Before you pay', 'Dates, spots, payment steps, cancellation terms, and transfer rules are confirmed before commitment.'],
    ['Safety and altitude', 'The captain controls pace, rest, and route changes when weather, fatigue, or altitude demands it.'],
    ['Stay and food', 'Expect shared, simple stays and route-appropriate meals. This is not a luxury hotel product.'],
    ['Who this fits', `${trip.difficulty} routes fit people who want the real route, clear effort, and a group that moves with intent.`],
    ['Who should not join', `${trip.difficulty} routes are not for people expecting comfort-first travel or fully predictable days.`],
    ['Support channel', 'You can ask route, safety, gear, and group-fit questions before booking instead of guessing from a brochure.'],
  ]

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid gap-10 border-y border-[#F5F4F1]/12 py-12 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#CFAF6B]">
            Trust ledger
          </p>
          <h2 className="mt-5 max-w-xl font-heading text-5xl leading-[0.9] md:text-[4.35rem]">
            WHAT REMOVES DOUBT
          </h2>
        </div>
        <div className="divide-y divide-[#F5F4F1]/10">
          {trustItems.map(([title, body]) => (
            <div key={title} className="grid gap-3 py-7 md:grid-cols-[190px_minmax(0,1fr)]">
              <h3 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#F5F4F1]">{title}</h3>
              <p className="text-sm leading-7 text-[#BEC4C0]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProofFrame({ moment }: { moment: TripProofMoment }) {
  return (
    <figure className="group min-w-0 overflow-hidden rounded-[1.35rem] border border-[#F5F4F1]/10 bg-[#08150F]">
      <div className="relative h-64 overflow-hidden xl:h-72">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.05]"
          style={{ backgroundImage: `url(${moment.image})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(5,8,7,0.88))]" />
      </div>
      <figcaption className="p-6">
        <p className="text-[1.08rem] leading-8 text-[#F5F4F1]/84">"{moment.quote}"</p>
        <p className="mt-4 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#CFAF6B]/88">
          {moment.meta}
        </p>
      </figcaption>
    </figure>
  )
}

function CaptainCard({ person }: { person: TripPerson }) {
  return (
    <motion.article
      className="overflow-hidden border-t border-[#F5F4F1]/12 pt-5"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 150, damping: 22 }}
    >
      <div>
        <h3 className="font-heading text-4xl leading-none tracking-[0.01em] text-[#F5F4F1]">{person.name}</h3>
        <p className="mt-2 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#CFAF6B]">
          {person.role}
        </p>
        <p className="mt-4 text-sm leading-7 text-[#F5F4F1]/76">{person.line}</p>
      </div>
    </motion.article>
  )
}

function MobileBookingBar({ trip }: { trip: Trip }) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-30 rounded-[1.25rem] border border-[#F5F4F1]/12 bg-[#050807]/82 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.38)] backdrop-blur-2xl lg:hidden">
      <Link
        href="#booking"
        className="grid min-h-14 grid-cols-[1fr_auto] items-center gap-3 rounded-[1rem] bg-[#F5F4F1] px-4 text-[#0F2E23]"
      >
        <span>
          <span className="block font-sans text-[0.58rem] font-semibold uppercase tracking-[0.12em] opacity-72">
            {formatShortDate(trip.nextDeparture)} / {trip.spotsLeft ? `${trip.spotsLeft} spots` : 'Open'}
          </span>
          <span className="block font-heading text-2xl leading-none tracking-[0.01em]">Reserve this trip</span>
        </span>
        <span className="font-mono text-xs font-bold">{formatMoney(trip.startingPrice)}</span>
      </Link>
    </div>
  )
}

function getDetailContent(trip: Trip): DetailContent {
  if (trip.tripDetail) return trip.tripDetail

  return {
    heroLine: trip.realityNote,
    altitudeLine: `${trip.destination} / ${trip.altitude ?? trip.region}`,
    emotionalHook: `${trip.descriptor} The route is built for people who want clear expectations before they commit.`,
    realityChecks: [
      trip.realityNote,
      'Weather can change the route without asking permission.',
      'Comfort stays secondary to safety, timing, and terrain.',
      `${trip.difficulty} means the effort level is real, not decorative.`,
    ],
    itinerary: [
      {
        day: 1,
        route: `${trip.startingPoint} to ${trip.destination}`,
        highlight: trip.highlights[0] ?? 'The route begins quietly.',
        details: 'Meet the group, understand the route rules, and move into the landscape without rushing the first day.',
      },
      {
        day: 2,
        route: `${trip.destination} route day`,
        highlight: trip.highlights[1] ?? 'The main route asks for effort.',
        details: 'Follow the planned trail or road movement with captain-led pacing, weather checks, and enough room to pause.',
      },
      {
        day: 3,
        route: `Return toward ${trip.startingPoint}`,
        highlight: trip.highlights[2] ?? 'The return makes the memory settle.',
        details: 'Close the route, regroup, and leave with enough buffer for real-world mountain timing.',
      },
    ],
    included: ['Trip captain', 'Route coordination', 'Shared stays where applicable', 'Basic safety support'],
    notIncluded: ['Travel to start point', 'Personal gear', 'Unplanned weather costs', 'Private upgrades'],
    proof: [
      { quote: 'Harder than expected. Better because of that.', meta: trip.destination, image: trip.image },
      { quote: 'The route stayed quiet until it did not.', meta: trip.region, image: trip.gallery?.[0] ?? trip.image },
      { quote: 'Came for the place. Remembered the people.', meta: trip.type, image: trip.gallery?.[1] ?? trip.image },
    ],
    captains: [
      {
        name: 'Aarav Thapa',
        role: 'Route captain',
        line: 'Keeps the group moving without turning the trip into a performance.',
        image: '/placeholder-user.jpg',
      },
      {
        name: 'Meera Bhandari',
        role: 'Ground lead',
        line: 'Handles weather calls, stays, and the quiet work behind calm trips.',
        image: '/placeholder-user.jpg',
      },
    ],
    bestSeason: trip.season.join(' / '),
    finalLine: 'If the reality makes the route clearer instead of less attractive, this is probably your trip.',
  }
}
