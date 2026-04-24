'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import SharedTripsHeader from '@/components/SharedTripsHeader'
import { cn } from '@/lib/utils'
import { defaultTripFilters, filterTrips, getFeaturedTrips } from '@/lib/trips/filters'
import { routeIdentities } from '@/lib/trips/static-trips'
import type { Trip, TripFilters } from '@/lib/trips/types'

type TripsExperienceProps = {
  trips: Trip[]
}

const regions = ['All', 'Karnataka', 'Maharashtra', 'Himachal']
const durations = ['All', 'Weekend', '4-6 Days', '7+ Days']
const difficulties = ['All', 'Beginner', 'Moderate', 'Hard', 'Extreme']
const seasons = ['All', 'Monsoon', 'Post Monsoon', 'Winter', 'Summer', 'Autumn', 'Spring']
const types = ['All', 'Trek', 'Road Trip', 'Weekend Escape']
const budgets = ['All', 'Under 5K', '5K-15K', '15K+']

const filterGroups: Array<{
  key: keyof TripFilters
  label: string
  values: string[]
}> = [
  { key: 'region', label: 'Destination', values: regions },
  { key: 'duration', label: 'Duration', values: durations },
  { key: 'difficulty', label: 'Difficulty', values: difficulties },
  { key: 'season', label: 'Season', values: seasons },
  { key: 'type', label: 'Type', values: types },
  { key: 'budget', label: 'Budget', values: budgets },
]

const proofNotes = [
  {
    quote: 'Thought I came for the mountains. Came back with people.',
    meta: 'Kudremukh, rain week',
    image: '/images/forest-trail.jpg',
  },
  {
    quote: 'Hardest weekend I have loved.',
    meta: 'Kokan Kada edge',
    image: '/images/rocky-ascent.jpg',
  },
  {
    quote: 'No signal. Best conversations.',
    meta: 'Spiti road night',
    image: '/images/campfire-night.jpg',
  },
]

const realityNotes = [
  ['No fake luxury', 'Clean stays where possible. Honest terrain always.'],
  ['Small groups', 'Enough people for energy. Not enough to become a crowd.'],
  ['Real captains', 'People who know the road, not scripts from a brochure.'],
  ['Clear effort levels', 'Beginner means beginner. Hard means you will feel it.'],
  ['No brochure promises', 'Weather, fatigue, and altitude are treated like facts.'],
]

export default function TripsExperience({ trips }: TripsExperienceProps) {
  const [filters, setFilters] = useState<TripFilters>(defaultTripFilters)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const featuredTrips = useMemo(() => getFeaturedTrips(trips), [trips])
  const filteredTrips = useMemo(() => filterTrips(trips, filters), [trips, filters])
  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value !== defaultTripFilters[key as keyof TripFilters],
  ).length
  const activeFilterSummary = getActiveFilterSummary(filters)

  const updateFilter = (key: keyof TripFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(defaultTripFilters)
  }

  return (
    <main className="trips-root min-h-[100dvh] overflow-x-hidden bg-[#050807] text-[#F5F4F1]">
      <div className="trips-noise" />
      <SharedTripsHeader actionHref="#upcoming-routes" actionLabel="Explore routes" />
      <TripsHero />
      <RouteIdentitySelector
        activeIdentity={filters.identity}
        onSelect={(identity) => updateFilter('identity', identity)}
      />
      <FeaturedRoutesEditorial trips={featuredTrips} />
      <section id="upcoming-routes" className="relative mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 grid gap-6 border-y border-[#F5F4F1]/10 py-9 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#CFAF6B]">
              Expedition board
            </p>
            <h2 className="mt-4 max-w-xl font-heading text-5xl leading-[0.9] tracking-[0.015em] text-[#F5F4F1] md:text-[4.35rem]">
              FIND THE ROAD THAT FITS
            </h2>
          </div>
          <p className="max-w-[38rem] self-end text-base leading-8 text-[#F5F4F1]/72 md:text-[1.05rem]">
            Start with region, effort, season, or budget. Trek &amp; Stay keeps the board practical so you can choose
            faster and ask better questions before you book.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <TripsDiscoveryRail
              filters={filters}
              activeFilterCount={activeFilterCount}
              onChange={updateFilter}
              onReset={resetFilters}
            />
          </aside>

          <div>
            <div className="mb-5 flex items-center justify-between gap-4 lg:hidden">
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="rounded-full border border-[#F5F4F1]/12 bg-[#0F2E23]/84 px-5 py-3 font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#F5F4F1] transition duration-300 active:translate-y-[1px]"
              >
                Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </button>
              <p className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-[#B8BEBB]">
                {filteredTrips.length} routes
              </p>
            </div>

            <TripsListBoard
              trips={filteredTrips}
              filters={filters}
              activeFilterSummary={activeFilterSummary}
              onReset={resetFilters}
            />
          </div>
        </div>
      </section>

      <RealityStrip />
      <TribeProofRail />
      <DecisionSplitCTA />
      <MobileStickyTripCTA count={filteredTrips.length} />

      <AnimatePresence>
        {isFilterOpen ? (
          <motion.div
            className="fixed inset-0 z-40 bg-[#050807]/72 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-x-3 bottom-3 max-h-[86dvh] overflow-auto rounded-[1.8rem] border border-[#F5F4F1]/12 bg-[#0B1B15] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.42)]"
              initial={{ y: 44, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 44, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 140, damping: 22 }}
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="font-sans text-xs font-bold uppercase tracking-[0.26em] text-[#CFAF6B]">
                  Discovery controls
                </p>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="rounded-full border border-[#F5F4F1]/12 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#F5F4F1]/80"
                >
                  Close
                </button>
              </div>
              <TripsDiscoveryRail
                filters={filters}
                activeFilterCount={activeFilterCount}
                onChange={updateFilter}
                onReset={resetFilters}
                compact
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}

function TripsHero() {
  return (
    <section className="relative isolate flex min-h-[78dvh] items-end overflow-hidden px-4 pb-12 pt-28 sm:px-6 lg:min-h-[86dvh] lg:px-8 lg:pb-20">
      <motion.div
        className="absolute inset-0 -z-20 bg-[url('/images/mountain-vista.jpg')] bg-cover bg-center trips-hero-drift"
        initial={{ scale: 1.05, opacity: 0.72 }}
        animate={{ scale: 1.08, opacity: 0.9 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,8,7,0.92),rgba(5,8,7,0.42)_48%,rgba(5,8,7,0.8)),linear-gradient(180deg,rgba(5,8,7,0.1),#050807_92%)]" />
      <div className="trips-topography absolute inset-0 -z-10 opacity-[0.18]" />
      <div className="absolute left-[6vw] top-[21vh] hidden h-28 w-px bg-gradient-to-b from-transparent via-[#CFAF6B]/50 to-transparent lg:block" />

      <div className="mx-auto grid w-full max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,0.98fr)_minmax(320px,0.62fr)] lg:items-end">
        <motion.div
          initial={{ y: 24, opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-5 font-sans text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#CFAF6B]">
            Trek &amp; Stay route board
          </p>
          <h1 className="max-w-5xl font-heading text-[clamp(4.8rem,13vw,12.5rem)] leading-[0.82] tracking-[0.008em] text-[#F5F4F1]">
            CHOOSE YOUR ROUTE
          </h1>
          <p className="mt-7 max-w-[34rem] text-base leading-8 text-[#F5F4F1]/80 md:text-[1.1rem] md:leading-9">
            Treks in Karnataka and Maharashtra. Road journeys through Himachal. Clear effort levels, small groups, and
            routes run by people who know the ground.
          </p>
        </motion.div>

        <motion.div
          className="max-w-md border-l border-[#F5F4F1]/10 pl-7 lg:mb-8"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[#B8BEBB]">
            Current board
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              ['03', 'regions'],
              ['08', 'routes'],
              ['01', 'decision'],
            ].map(([value, label]) => (
              <div key={label} className="border-t border-[#F5F4F1]/12 pt-4">
                <p className="font-heading text-[2.1rem] leading-none text-[#F5F4F1]">{value}</p>
                <p className="mt-1.5 font-sans text-[0.6rem] uppercase tracking-[0.12em] text-[#C2C8C4]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function RouteIdentitySelector({
  activeIdentity,
  onSelect,
}: {
  activeIdentity: string
  onSelect: (identity: string) => void
}) {
  const identities = ['All Routes', ...routeIdentities]

  return (
    <section className="relative mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.2em] text-[#CFAF6B]">
          Start with identity
        </p>
        <p className="max-w-xl text-sm leading-6 text-[#F5F4F1]/66">
          Start with the kind of route you want, then narrow by effort, time, and season.
        </p>
      </div>
      <div className="overflow-x-auto border-y border-[#F5F4F1]/10 py-4 trips-scrollbar">
        <div className="flex min-w-max gap-3">
          {identities.map((identity) => {
            const isActive = activeIdentity === identity

            return (
              <motion.button
                key={identity}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelect(identity)}
                className={cn(
                  'relative overflow-hidden rounded-[0.85rem] border px-4 py-3 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.14em] transition duration-300 active:translate-y-[1px]',
                  isActive
                    ? 'border-[#CFAF6B]/70 bg-[#CFAF6B]/12 text-[#F5F4F1]'
                    : 'border-[#F5F4F1]/9 bg-[#0F2E23]/44 text-[#F5F4F1]/72 hover:border-[#F5F4F1]/18 hover:text-[#F5F4F1]',
                )}
                whileHover={{ y: -1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              >
                {isActive ? (
                  <motion.span layoutId="identity-active" className="absolute inset-x-3 bottom-0 h-px bg-[#CFAF6B]" />
                ) : null}
                <span className="relative">{identity}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FeaturedRoutesEditorial({ trips }: { trips: Trip[] }) {
  return (
    <section className="relative mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#CFAF6B]">
            Featured routes
          </p>
          <h2 className="mt-3 max-w-3xl font-heading text-5xl leading-[0.9] tracking-[0.015em] text-[#F5F4F1] md:text-[4.35rem]">
            START WITH THE ONES THAT ALREADY HAVE WEATHER
          </h2>
        </div>
        <p className="hidden max-w-sm text-sm leading-7 text-[#BFC5C1] lg:block">
          Start with the strongest current routes, then move into the full board.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        {trips.slice(0, 1).map((trip) => (
          <FeaturedRoutePanel key={trip.id} trip={trip} dominant />
        ))}
        <div className="grid gap-4">
          {trips.slice(1, 4).map((trip) => (
            <FeaturedRoutePanel key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedRoutePanel({ trip, dominant = false }: { trip: Trip; dominant?: boolean }) {
  return (
    <motion.article
      className={cn(
        'group relative min-h-[340px] overflow-hidden rounded-[1.65rem] border border-[#F5F4F1]/10 bg-[#0F2E23]',
        dominant ? 'lg:min-h-[680px]' : 'lg:min-h-[216px]',
      )}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 130, damping: 20 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition duration-[820ms] group-hover:scale-[1.038]"
        style={{ backgroundImage: `url(${trip.image})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,7,0.9),rgba(5,8,7,0.38)),linear-gradient(180deg,transparent,rgba(5,8,7,0.88))]" />
      <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-5 sm:p-7 lg:p-9">
        <div className="mb-auto flex items-start justify-between gap-4">
          <p className="rounded-full border border-[#CFAF6B]/26 bg-[#050807]/22 px-3 py-2 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#CFAF6B] backdrop-blur-xl">
            {trip.region}
          </p>
          <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#F5F4F1]/68">
            {trip.durationLabel}
          </p>
        </div>
        <div>
          <h3
            className={cn(
              'max-w-2xl font-heading leading-[0.9] tracking-[0.02em] text-[#F5F4F1]',
              dominant ? 'text-6xl md:text-8xl' : 'text-4xl md:text-5xl',
            )}
          >
            {trip.title}
          </h3>
          <p className="mt-5 max-w-[34rem] text-base leading-8 text-[#F5F4F1]/78">{trip.descriptor}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <TripPill>{trip.difficulty}</TripPill>
            <TripPill>From {formatMoney(trip.startingPrice)}</TripPill>
            <Link
              href={`/trips/${trip.slug}`}
              className="rounded-full bg-[#F5F4F1] px-5 py-3 font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#0F2E23] transition duration-300 hover:bg-[#CFAF6B] active:translate-y-[1px]"
            >
              View route
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function TripsDiscoveryRail({
  filters,
  activeFilterCount,
  onChange,
  onReset,
  compact = false,
}: {
  filters: TripFilters
  activeFilterCount: number
  onChange: (key: keyof TripFilters, value: string) => void
  onReset: () => void
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        'border-[#F5F4F1]/10 bg-[#07110D]/72 backdrop-blur-xl',
        compact ? 'rounded-[1.2rem] border p-4' : 'sticky top-24 rounded-[1.45rem] border p-6',
      )}
    >
      <div className="mb-7 flex items-center justify-between border-b border-[#F5F4F1]/10 pb-5">
        <div>
          <p className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#CFAF6B]">
            Narrow the route
          </p>
          <p className="mt-1.5 text-sm text-[#BFC5C1]">{activeFilterCount} active filters</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#F5F4F1]/68 transition hover:text-[#F5F4F1]"
        >
          Reset
        </button>
      </div>

      <div className="space-y-6">
        {filterGroups.map((group) => (
          <div key={group.key}>
            <p className="mb-3 font-sans text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#BCC2BE]">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const isActive = filters[group.key] === value

                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onChange(group.key, value)}
                    className={cn(
                      'rounded-full border px-3 py-2 text-[0.72rem] font-medium transition duration-300 active:translate-y-[1px]',
                      isActive
                        ? 'border-[#CFAF6B]/60 bg-[#CFAF6B]/12 text-[#F5F4F1]'
                        : 'border-[#F5F4F1]/8 text-[#F5F4F1]/68 hover:border-[#F5F4F1]/18 hover:text-[#F5F4F1]',
                    )}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TripsListBoard({
  trips,
  filters,
  activeFilterSummary,
  onReset,
}: {
  trips: Trip[]
  filters: TripFilters
  activeFilterSummary: string
  onReset: () => void
}) {
  return (
    <motion.div layout className="space-y-4">
        <div className="hidden items-end justify-between gap-6 border-b border-[#F5F4F1]/10 pb-5 lg:flex">
          <div>
            <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#BCC2BE]">
              {trips.length} routes on the board
            </p>
            <p className="mt-2.5 text-sm text-[#F5F4F1]/66">{activeFilterSummary}</p>
            <p className="mt-4 text-sm text-[#F5F4F1]/58">
              Need more context?{' '}
              <Link href="/about" className="text-[#CFAF6B] transition hover:text-[#F5F4F1]">
                See how Trek &amp; Stay runs trips.
            </Link>
          </p>
        </div>
        <p className="text-sm text-[#F5F4F1]/62">
          {filters.identity === 'All Routes' ? 'Choose by route type, effort, season, and start point.' : filters.identity}
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {trips.length > 0 ? (
          trips.map((trip, index) => <TripRouteCard key={trip.id} trip={trip} index={index} />)
        ) : (
          <motion.div
            key="empty"
            className="relative overflow-hidden rounded-[1.6rem] border border-[#F5F4F1]/10 bg-[#0F2E23]/52 p-8 md:p-12"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
          >
            <div className="trips-topography absolute inset-0 opacity-[0.1]" />
            <div className="relative max-w-xl">
              <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.26em] text-[#CFAF6B]">
                No route found
              </p>
              <h3 className="mt-4 font-heading text-5xl leading-[0.9] text-[#F5F4F1] md:text-6xl">
                NO ROUTES MATCH THOSE FILTERS
              </h3>
              <p className="mt-4 text-base leading-7 text-[#F5F4F1]/68">
                Widen one filter and the board will open up again.
              </p>
              <button
                type="button"
                onClick={onReset}
                className="mt-7 rounded-full bg-[#CFAF6B] px-6 py-3 font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#0F2E23] transition active:translate-y-[1px]"
              >
                Reset filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function TripRouteCard({ trip, index }: { trip: Trip; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.42, delay: Math.min(index * 0.035, 0.22), ease: [0.16, 1, 0.3, 1] }}
      className="group grid overflow-hidden rounded-[1.45rem] border border-[#F5F4F1]/9 bg-[#08150F]/80 transition duration-300 hover:border-[#CFAF6B]/24 lg:grid-cols-[270px_minmax(0,1fr)]"
    >
      <div className="relative min-h-[230px] overflow-hidden lg:min-h-full">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-[820ms] group-hover:scale-[1.045]"
          style={{ backgroundImage: `url(${trip.image})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(5,8,7,0.82))]" />
        <div className="absolute bottom-4 left-4 rounded-full border border-[#F5F4F1]/12 bg-[#050807]/30 px-3 py-2 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#F5F4F1]/80 backdrop-blur-xl">
          {trip.type}
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#CFAF6B]">
              {trip.region} / {trip.destination}
            </p>
            <h3 className="mt-3 font-heading text-4xl leading-[0.92] tracking-[0.02em] text-[#F5F4F1] md:text-5xl">
              {trip.title}
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#F5F4F1]/74">{trip.descriptor}</p>
          </div>
          <div className="shrink-0 border-l border-[#F5F4F1]/8 pl-5">
            <p className="font-heading text-3xl leading-none text-[#F5F4F1]/92">{formatMoney(trip.startingPrice)}</p>
            <p className="mt-1.5 font-sans text-[0.58rem] uppercase tracking-[0.12em] text-[#BCC2BE]">starting</p>
            <p className="mt-3.5 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-[#CFAF6B]/80">
              {trip.spotsLeft ? `${trip.spotsLeft} spots left` : 'Upcoming'}
            </p>
          </div>
        </div>

        <TripMetaRow trip={trip} />

        <div className="mt-6 grid gap-4 border-t border-[#F5F4F1]/10 pt-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="max-w-[34rem] text-sm leading-6 text-[#F5F4F1]/64">{trip.realityNote}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {trip.highlights.slice(0, 3).map((highlight) => (
                <span key={highlight} className="text-xs text-[#F5F4F1]/56">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
          <Link
            href={`/trips/${trip.slug}`}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#CFAF6B]/40 px-5 font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#F5F4F1] transition duration-300 hover:bg-[#CFAF6B] hover:text-[#0F2E23] active:translate-y-[1px]"
          >
            View route
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

function TripMetaRow({ trip }: { trip: Trip }) {
  const meta = [
    ['Time', trip.durationLabel],
    ['Effort', trip.difficulty],
    ['Start', trip.startingPoint],
    ['Next', formatDate(trip.nextDeparture)],
  ]

  return (
    <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {meta.map(([label, value]) => (
        <div key={label} className="rounded-[1rem] border border-[#F5F4F1]/8 bg-[#F5F4F1]/5 px-3 py-3.5">
          <p className="font-sans text-[0.56rem] font-bold uppercase tracking-[0.12em] text-[#BCC2BE]">{label}</p>
          <p className="mt-1.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#F5F4F1]/84">
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}

function TripPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[#F5F4F1]/8 bg-[#F5F4F1]/5 px-3 py-2 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#F5F4F1]/72">
      {children}
    </span>
  )
}

function RealityStrip() {
  return (
    <section className="relative mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="overflow-hidden rounded-[1.8rem] border border-[#F5F4F1]/10 bg-[#0B1B15]">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[300px] p-7 md:p-10">
            <div className="trips-topography absolute inset-0 opacity-[0.13]" />
            <div className="relative">
              <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#CFAF6B]">
                Reality layer
              </p>
              <h2 className="mt-4 max-w-lg font-heading text-6xl leading-[0.88] text-[#F5F4F1] md:text-[4.9rem]">
                READ THIS BEFORE THE ROAD
              </h2>
            </div>
          </div>
          <div className="divide-y divide-[#F5F4F1]/10 border-t border-[#F5F4F1]/10 lg:border-l lg:border-t-0">
            {realityNotes.map(([title, body]) => (
              <div key={title} className="grid gap-4 p-5 md:grid-cols-[190px_minmax(0,1fr)] md:p-7">
                <h3 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-[#F5F4F1]">{title}</h3>
                <p className="text-sm leading-7 text-[#BEC4C0]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TribeProofRail() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-8 grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#CFAF6B]">
            Tribe proof
          </p>
          <h2 className="mt-3 font-heading text-5xl leading-[0.9] text-[#F5F4F1] md:text-[4.35rem]">
            NOT TESTIMONIALS. TRACE EVIDENCE.
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-8 text-[#F5F4F1]/68">
          Short field proof from people who have already taken the route.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {proofNotes.map((note, index) => (
          <motion.figure
            key={note.quote}
            className={cn(
              'group overflow-hidden rounded-[1.5rem] border border-[#F5F4F1]/10 bg-[#08150F]',
              index === 1 ? 'md:mt-10' : '',
            )}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 130, damping: 20 }}
          >
            <div className="relative h-64 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-[820ms] group-hover:scale-[1.04]"
                style={{ backgroundImage: `url(${note.image})` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(5,8,7,0.9))]" />
            </div>
            <figcaption className="p-5">
              <p className="text-[1.02rem] leading-7 text-[#F5F4F1]/82">"{note.quote}"</p>
              <p className="mt-4 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#CFAF6B]/88">
                {note.meta}
              </p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}

function DecisionSplitCTA() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-28 pt-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="grid overflow-hidden rounded-[1.8rem] border border-[#F5F4F1]/10 bg-[#0F2E23]/72 lg:grid-cols-2">
        {[
          ['I know my route', 'Skip the noise and go straight to the live board.', 'Browse routes', '#upcoming-routes'],
          ['Help me choose', 'Start with effort, season, and how much discomfort you actually want.', 'Use filters', '#upcoming-routes'],
        ].map(([title, body, cta, href], index) => (
          <div
            key={title}
            className={cn('relative p-7 md:p-10', index === 1 ? 'border-t border-[#F5F4F1]/10 lg:border-l lg:border-t-0' : '')}
          >
            <p className="font-sans text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#CFAF6B]">
              Path {String(index + 1).padStart(2, '0')}
            </p>
            <h2 className="mt-4 font-heading text-[2.9rem] leading-[0.92] text-[#F5F4F1] md:text-[4.2rem]">{title}</h2>
            <p className="mt-4 max-w-md text-base leading-8 text-[#F5F4F1]/68">{body}</p>
            <Link
              href={href}
              className={cn(
                'mt-7 inline-flex h-12 items-center rounded-full px-6 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.14em] transition duration-300 active:translate-y-[1px]',
                index === 0
                  ? 'bg-[#F5F4F1] text-[#0F2E23] hover:bg-[#CFAF6B]'
                  : 'border border-[#F5F4F1]/14 text-[#F5F4F1] hover:border-[#CFAF6B]/50 hover:text-[#CFAF6B]',
              )}
            >
              {cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

function MobileStickyTripCTA({ count }: { count: number }) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-20 rounded-full border border-[#F5F4F1]/10 bg-[#050807]/70 p-2 backdrop-blur-2xl lg:hidden">
      <Link
        href="#upcoming-routes"
        className="flex h-12 items-center justify-between rounded-full bg-[#F5F4F1] px-5 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[#0F2E23]"
      >
        <span>{count} routes</span>
        <span>Open board</span>
      </Link>
    </div>
  )
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(value))
}

function getActiveFilterSummary(filters: TripFilters) {
  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => value !== defaultTripFilters[key as keyof TripFilters])
    .map(([, value]) => value)

  return activeFilters.length > 0 ? activeFilters.join(' / ') : 'All routes on the board'
}
