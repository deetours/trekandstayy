'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SharedTripsHeader from '@/components/SharedTripsHeader'

gsap.registerPlugin(ScrollTrigger)

const InnerCompass = dynamic(() => import('@/components/about/InnerCompass'), { ssr: false })

const trustFacts = [
  ['Small groups', 'We keep groups tight so captains can actually lead and guests do not disappear into a crowd.'],
  ['Clear effort levels', 'Beginner, moderate, hard, and extreme are treated like planning tools, not marketing words.'],
  ['Captain-led calls', 'Weather, fatigue, and route changes are decided on the ground by the people running the trip.'],
  ['No instant lock-in', 'You get clarity on route fit, payment, and trip terms before being pushed to commit.'],
]

const problemLines = [
  'Too many operators sell the feeling of adventure without showing how the trip is actually run.',
  'Pretty itineraries hide unclear effort, weak support, and group sizes that kill the experience.',
  'Guests are told to trust the brand before they are shown the process.',
]

const originBeats = [
  ['First routes', 'The first trips were built for friends who wanted hard roads, honest planning, and no brochure theatre.'],
  ['What broke', 'We saw the same failure pattern everywhere: vague difficulty, overloaded groups, and no clear accountability.'],
  ['What stayed', 'So we kept the parts that matter: small groups, route-fit honesty, captain-led decisions, and support that feels human.'],
]

const operatingRules = [
  ['Ask before you book', 'Guests can ask about route fit, effort, gear, weather, payment, and cancellation before locking in.'],
  ['Prepare properly', 'You get start-point details, packing expectations, timing, and realistic effort guidance before departure.'],
  ['Move with intent', 'Captains set pace, breaks, and route changes based on the group, conditions, and actual terrain.'],
  ['Adjust when needed', 'If weather shifts or someone struggles, the plan changes early instead of being defended for ego.'],
  ['Close with clarity', 'The trip ends with returns, handoffs, and practical support handled cleanly, not left to chance.'],
]

const accountabilityRules = [
  ['Weather changes', 'Routes can change, turn back, or slow down when weather demands it. We would rather disappoint a plan than force a bad call.'],
  ['Pace and fatigue', 'The group moves at a captain-managed pace. We do not let the strongest person define the day for everyone else.'],
  ['Safety escalations', 'If someone is not okay, the route stops being theoretical. The immediate question becomes support, extraction, and next steps.'],
  ['Comfort expectations', 'We do not sell basic stays and route fatigue as luxury. You should know what is simple, shared, and rough before you join.'],
]

const team = [
  {
    name: 'Aarav Thapa',
    role: 'Route captain',
    line: 'Leads pacing, route calls, and safety decisions on terrain-heavy days.',
    trust: 'Former high-altitude trek lead with a bias for calm judgment over performative bravado.',
  },
  {
    name: 'Meera Bhandari',
    role: 'Operations lead',
    line: 'Owns pre-trip clarity, group coordination, stay alignment, and what guests need before departure.',
    trust: 'Builds the invisible logistics that keep the experience coherent when conditions stop being ideal.',
  },
  {
    name: 'Kabir Sen',
    role: 'Experience host',
    line: 'Protects the group from rush, confusion, and forced social energy.',
    trust: 'Best at keeping the trip human when a day gets long, cold, delayed, or mentally heavy.',
  },
]

const proofRows = [
  ['Before payment', 'We confirm trip fit, payment steps, cancellation terms, and route realities before asking you to commit.'],
  ['On-route leadership', 'The people leading the trip are empowered to slow down, change course, or turn back when conditions call for it.'],
  ['Support over optics', 'We care more about whether the group is looked after than whether the itinerary remains Instagram-clean.'],
]

const philosophy = [
  'We do not sell comfort as adventure.',
  'We do not sell difficulty without support.',
  'We do not ask for blind trust when clear process can do the work.',
]

export default function AboutExperience() {
  const rootRef = useRef<HTMLElement>(null)
  const revealRefs = useRef<HTMLElement[]>([])
  const compassProgressRef = useRef(0)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      gsap.to(root, {
        '--about-warmth': 1,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            compassProgressRef.current = self.progress
          },
        },
      })

      revealRefs.current.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 32, filter: 'blur(10px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.88,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 82%',
            },
          },
        )
      })
    }, root)

    ScrollTrigger.refresh()

    return () => ctx.revert()
  }, [])

  const registerReveal = (element: HTMLElement | null) => {
    if (element && !revealRefs.current.includes(element)) {
      revealRefs.current.push(element)
    }
  }

  return (
    <main ref={rootRef} className="about-root min-h-[100dvh] overflow-x-hidden bg-[#050807] text-[#F5F4F1]">
      <SharedTripsHeader actionHref="/trips" actionLabel="Explore routes" />

      <section className="relative isolate px-4 pb-18 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pb-24">
        <div className="about-compass-shell">
          <InnerCompass progressRef={compassProgressRef} />
        </div>
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_24%,rgba(207,175,107,0.14),transparent_30rem),linear-gradient(180deg,#050807,#08150F_58%,#050807)]" />
        <div className="trip-detail-topography absolute inset-0 -z-10 opacity-[0.08]" />
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-5xl"
          >
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.32em] text-[#CFAF6B]">
              About Trek and Stay
            </p>
            <h1 className="mt-6 max-w-5xl font-heading text-[clamp(3.9rem,9vw,8.6rem)] leading-[0.88] tracking-[0.01em]">
              BUILT FOR PEOPLE WHO WANT REAL ROUTES, CLEAR EXPECTATIONS, AND RESPONSIBLE LEADERS.
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-[#F5F4F1]/78 md:text-2xl">
              We run small-group adventure trips with honest effort levels, captain-led decisions, and route planning
              that respects terrain more than marketing.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#how-we-run-trips"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#F5F4F1] px-6 font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#0F2E23] transition duration-300 hover:bg-[#CFAF6B] active:translate-y-[1px]"
              >
                See how our trips are run
              </Link>
              <Link
                href="/trips"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#F5F4F1]/14 px-6 font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#F5F4F1]/74 transition duration-300 hover:border-[#CFAF6B]/45 hover:text-[#CFAF6B] active:translate-y-[1px]"
              >
                Browse routes
              </Link>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 rounded-[1.7rem] border border-[#F5F4F1]/10 bg-[#07110D]/76 p-5 shadow-[0_18px_56px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-6"
          >
            <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#CFAF6B]">
              Quick trust scan
            </p>
            <div className="mt-6 space-y-5">
              {trustFacts.map(([title, body]) => (
                <div key={title} className="border-t border-[#F5F4F1]/10 pt-4">
                  <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#F5F4F1]">
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#F5F4F1]/66">{body}</p>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </section>

      <section ref={registerReveal} className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.76fr_1.24fr] lg:px-8 lg:py-32">
        <div data-animate>
          <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.3em] text-[#CFAF6B]">
            The problem
          </p>
          <h2 className="mt-5 max-w-2xl font-heading text-4xl leading-[0.94] md:text-5xl">
            TRUST DROPS FAST WHEN THE PROCESS STAYS HIDDEN.
          </h2>
        </div>
        <div className="divide-y divide-[#F5F4F1]/10 border-y border-[#F5F4F1]/10">
          {problemLines.map((line, index) => (
            <motion.p
              key={line}
              className="py-7 text-2xl leading-tight tracking-[-0.04em] text-[#F5F4F1]/82 md:text-4xl"
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.62, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </section>

      <section ref={registerReveal} className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div data-animate>
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.3em] text-[#CFAF6B]">
              Origin
            </p>
            <h2 className="mt-5 max-w-4xl font-heading text-4xl leading-[0.94] md:text-5xl">
              WE BUILT THIS TO FIX THE PARTS THAT USUALLY FAIL.
            </h2>
          </div>
          <p data-animate className="max-w-xl text-base leading-7 text-[#F5F4F1]/66">
            We did not start with a brand deck. We started by seeing how quickly adventure gets fake when group size,
            difficulty, and on-ground responsibility are handled badly.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {originBeats.map(([title, body], index) => (
            <motion.article
              key={title}
              className="border-t border-[#F5F4F1]/12 pt-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#CFAF6B]">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 font-heading text-4xl leading-none tracking-[0.01em]">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-[#F5F4F1]/64">{body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section
        id="how-we-run-trips"
        ref={registerReveal}
        className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="grid overflow-hidden border-y border-[#F5F4F1]/12 lg:grid-cols-[0.82fr_1.18fr]">
          <div data-animate className="py-10 pr-0 lg:py-16 lg:pr-10">
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.3em] text-[#CFAF6B]">
              How we run trips
            </p>
            <h2 className="mt-5 max-w-xl font-heading text-4xl leading-[0.94] md:text-5xl">
              HOW WE RUN TRIPS, STEP BY STEP.
            </h2>
          </div>
          <div className="divide-y divide-[#F5F4F1]/10 border-t border-[#F5F4F1]/12 lg:border-l lg:border-t-0">
            {operatingRules.map(([title, body], index) => (
              <div key={title} data-animate className="grid gap-3 py-6 lg:grid-cols-[180px_minmax(0,1fr)] lg:px-8">
                <h3 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#F5F4F1]">{title}</h3>
                <div>
                  <p className="text-sm leading-6 text-[#F5F4F1]/68">{body}</p>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-[#CFAF6B]/74">
                    Step {String(index + 1).padStart(2, '0')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={registerReveal} className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 rounded-[1.9rem] border border-[#F5F4F1]/10 bg-[#07110D]/84 p-6 md:p-8 lg:grid-cols-[0.84fr_1.16fr]">
          <div data-animate>
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.3em] text-[#CFAF6B]">
              When things change
            </p>
            <h2 className="mt-5 max-w-xl font-heading text-4xl leading-[0.94] md:text-5xl">
              WHAT HAPPENS WHEN CONDITIONS CHANGE.
            </h2>
          </div>
          <div className="divide-y divide-[#F5F4F1]/10">
            {accountabilityRules.map(([title, body]) => (
              <div key={title} data-animate className="grid gap-3 py-5 md:grid-cols-[180px_minmax(0,1fr)]">
                <h3 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#F5F4F1]">{title}</h3>
                <p className="text-sm leading-6 text-[#F5F4F1]/66">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={registerReveal} className="mx-auto max-w-[1440px] px-4 pb-10 pt-12 sm:px-6 lg:px-8 lg:pb-12">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.76fr_1.24fr] lg:items-end">
          <div data-animate>
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.3em] text-[#CFAF6B]">
              The people
            </p>
            <h2 className="mt-5 font-heading text-4xl leading-[0.94] md:text-5xl">THE PEOPLE WHO MAKE THE CALLS</h2>
          </div>
          <p data-animate className="max-w-2xl text-base leading-7 text-[#F5F4F1]/64">
            Trust is not built by cinematic portraits. It is built by knowing who makes the calls, who handles the
            prep, and who stays calm when a day gets messy.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {team.map((person, index) => (
            <motion.article
              key={person.name}
              className="group rounded-[1.55rem] border border-[#F5F4F1]/10 bg-[#08150F]/86 p-6"
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 150, damping: 22 }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#CFAF6B]">
                {String(index + 1).padStart(2, '0')}
              </p>
              <div className="mt-6 border-t border-[#F5F4F1]/10 pt-5">
                <h3 className="font-heading text-4xl leading-none tracking-[0.01em]">{person.name}</h3>
                <p className="mt-2 font-sans text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#CFAF6B]">
                  {person.role}
                </p>
                <p className="mt-5 text-sm leading-6 text-[#F5F4F1]/78">{person.line}</p>
                <p className="mt-4 text-sm leading-6 text-[#F5F4F1]/58">{person.trust}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section ref={registerReveal} className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 border-y border-[#F5F4F1]/12 py-12 lg:grid-cols-[0.76fr_1.24fr]">
          <div data-animate>
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.3em] text-[#CFAF6B]">
              Proof
            </p>
            <h2 className="mt-5 max-w-xl font-heading text-4xl leading-[0.94] md:text-5xl">WHAT WE MAKE CLEAR BEFORE YOU GO</h2>
          </div>
          <div className="divide-y divide-[#F5F4F1]/10">
            {proofRows.map(([title, body]) => (
              <div key={title} data-animate className="grid gap-3 py-5 md:grid-cols-[180px_minmax(0,1fr)]">
                <h3 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#F5F4F1]">{title}</h3>
                <p className="text-sm leading-6 text-[#F5F4F1]/68">{body}</p>
              </div>
            ))}
            <div data-animate className="grid gap-3 py-5 md:grid-cols-[180px_minmax(0,1fr)]">
              <h3 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#F5F4F1]">Current routes</h3>
              <p className="text-sm leading-6 text-[#F5F4F1]/68">
                Want to see the same operating standards on a live board?{' '}
                <Link href="/trips" className="text-[#CFAF6B] transition hover:text-[#F5F4F1]">
                  Browse routes.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section ref={registerReveal} className="mx-auto max-w-[1440px] px-4 pb-28 pt-10 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-8 rounded-[2rem] border border-[#F5F4F1]/10 bg-[#0F2E23]/66 p-7 md:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:p-12">
          <div data-animate>
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.3em] text-[#CFAF6B]">
              Philosophy
            </p>
            <h2 className="mt-5 font-heading text-4xl leading-[0.94] md:text-5xl">THE PHILOSOPHY IS SIMPLE</h2>
          </div>
          <div data-animate>
            <div className="divide-y divide-[#F5F4F1]/10 border-y border-[#F5F4F1]/10">
              {philosophy.map((item) => (
                <p key={item} className="py-5 text-xl leading-8 tracking-[-0.02em] text-[#F5F4F1]/84 md:text-3xl">
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-8 max-w-xl text-base leading-7 text-[#F5F4F1]/68">
              If that sounds like the way you want to travel, the next step is not blind trust. It is looking at the
              routes and deciding whether one of them fits you properly.
            </p>
            <Link
              href="/trips"
              className="mt-8 inline-flex h-[3.25rem] items-center rounded-full bg-[#F5F4F1] px-7 font-sans text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#0F2E23] transition duration-300 hover:bg-[#CFAF6B] active:translate-y-[1px]"
            >
              Find the route that fits
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
