'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ChevronDown, LoaderCircle, ShieldCheck } from 'lucide-react'
import { useLayoutEffect, useRef, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createBookingDraftAction } from '@/app/trips/[slug]/book/actions'
import SharedTripsHeader from '@/components/SharedTripsHeader'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  calculateBookingPricing,
  createRouteQuestionHref,
  formatDate,
  formatMoney,
  getTripAddOns,
} from '@/lib/trips/booking-store'
import type { Trip } from '@/lib/trips/types'
import { cn } from '@/lib/utils'

const bookingFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name'),
  phone: z
    .string()
    .trim()
    .min(10, 'Enter a valid phone number')
    .regex(/^[\d+\-\s()]+$/, 'Phone number can only include numbers and common symbols'),
  email: z.string().trim().email('Enter a valid email address'),
  emergencyContact: z.string().trim().min(10, 'Add an emergency contact'),
  peopleCount: z.coerce.number().int().min(1, 'At least 1 traveller is required').max(12, 'For larger groups, contact support'),
  experienceLevel: z.string().optional(),
  notes: z.string().max(300, 'Keep notes under 300 characters').optional(),
  addOnIds: z.array(z.string()).default([]),
})

type BookingExperienceProps = {
  trip: Trip
}

type BookingFormValues = z.infer<typeof bookingFormSchema>

const EXPERIENCE_LEVELS = ['First mountain trip', 'Some weekend trek experience', 'Comfortable with hard routes']

export default function BookingExperience({ trip }: BookingExperienceProps) {
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const addOns = getTripAddOns(trip)
  const questionHref = createRouteQuestionHref(trip)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      emergencyContact: '',
      peopleCount: 1,
      experienceLevel: '',
      notes: '',
      addOnIds: [],
    },
    mode: 'onChange',
  })

  const peopleCount = form.watch('peopleCount') || 1
  const selectedAddOnIds = form.watch('addOnIds') || []
  const pricingPreview = calculateBookingPricing(trip, peopleCount, selectedAddOnIds)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || shouldReduceMotion) return

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>('[data-booking-reveal]', root)
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
        },
      )
    }, root)

    return () => ctx.revert()
  }, [shouldReduceMotion])

  const onSubmit = form.handleSubmit((values) => {
    setSubmissionError(null)

    startTransition(async () => {
      const result = await createBookingDraftAction(trip.slug, values)

      if (!result.success) {
        setSubmissionError(result.message)
        return
      }

      router.push(`/trips/${trip.slug}/payment?booking=${result.bookingId}`)
    })
  })

  return (
    <main ref={rootRef} className="trip-detail-root booking-page min-h-[100dvh] bg-[#050807] pb-28 text-[#F5F4F1]">
      <SharedTripsHeader actionHref={questionHref} actionLabel="Need help?" />

      <section className="mx-auto max-w-[1440px] px-4 pb-8 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        <div data-booking-reveal className="grid gap-6 border-b border-[#F5F4F1]/10 pb-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div>
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#CFAF6B]">
              Booking clarity
            </p>
            <h1 className="mt-4 max-w-4xl font-heading text-[clamp(3.4rem,9vw,7.4rem)] leading-[0.85] text-[#F5F4F1]">
              You&apos;re almost in
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#F5F4F1]/74">
              We only need the essentials now. Payment comes next, and your spot is confirmed once that step is complete.
            </p>
          </div>
          <div className="overflow-hidden rounded-[1.6rem] border border-[#F5F4F1]/10 bg-[#07110D]/78 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <div
              className="h-44 bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(5,8,7,0.1), rgba(5,8,7,0.58)), url(${trip.gallery?.[0] ?? trip.image})` }}
            />
            <div className="space-y-2 p-5">
              <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#CFAF6B]">
                {trip.destination} / {trip.durationLabel}
              </p>
              <h2 className="font-heading text-4xl leading-none text-[#F5F4F1]">{trip.title}</h2>
              <p className="text-sm leading-6 text-[#F5F4F1]/64">
                Departure: {formatDate(trip.nextDeparture)} / Start point: {trip.startingPoint}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="space-y-6">
            <div data-booking-reveal className="calm-panel rounded-[1.55rem] p-4 lg:hidden">
              <BookingSummaryCard trip={trip} peopleCount={peopleCount} pricing={pricingPreview.pricing} addOns={pricingPreview.selectedAddOns} />
            </div>

            <div data-booking-reveal className="flex flex-wrap gap-3">
              {['Secure booking', 'Direct with organizers', 'No hidden charges'].map((item) => (
                <span
                  key={item}
                  className="trust-chip inline-flex items-center rounded-full px-4 py-2 font-sans text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#F5F4F1]/72"
                >
                  {item}
                </span>
              ))}
            </div>

            <div data-booking-reveal className="calm-panel rounded-[1.8rem] p-5 sm:p-7 lg:p-8">
              <div className="mb-7">
                <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.28em] text-[#CFAF6B]">
                  Traveller details
                </p>
                <h2 className="mt-3 font-heading text-5xl leading-[0.88] text-[#F5F4F1] sm:text-6xl">
                  Keep this simple
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#F5F4F1]/64">
                  We&apos;ll only use this for your trip coordination. No spam. No unnecessary calls.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-[#F5F4F1]/72">Full name</FormLabel>
                        <FormControl>
                          <MotionInput placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-[#F5F4F1]/72">Phone number</FormLabel>
                        <FormControl>
                          <MotionInput inputMode="tel" placeholder="+91 98765 43210" {...field} />
                        </FormControl>
                        <FormDescription className="text-[#F5F4F1]/46">
                          We only use this for route updates and trip coordination.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-[#F5F4F1]/72">Email</FormLabel>
                        <FormControl>
                          <MotionInput type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-[#F5F4F1]/72">Emergency contact</FormLabel>
                        <FormControl>
                          <MotionInput inputMode="tel" placeholder="+91 98XXX XXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="peopleCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-[#F5F4F1]/72">Number of people</FormLabel>
                        <FormControl>
                          <MotionInput
                            type="number"
                            min={1}
                            max={12}
                            value={field.value}
                            onChange={(event) => field.onChange(Number(event.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-[#F5F4F1]/72">Experience level</FormLabel>
                        <Select value={field.value || undefined} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-14 w-full rounded-[1rem] border-[#F5F4F1]/12 bg-[#0B1B15]/82 px-4 text-base text-[#F5F4F1] shadow-none">
                              <SelectValue placeholder="Optional" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-[#F5F4F1]/12 bg-[#08150F] text-[#F5F4F1]">
                            {EXPERIENCE_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Collapsible className="rounded-[1.25rem] border border-[#F5F4F1]/10 bg-[#0B1B15]/64 p-4 sm:p-5">
                    <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 text-left">
                      <div>
                        <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#CFAF6B]">
                          Optional add-ons
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#F5F4F1]/62">
                          Helpful extras if you want them. Nothing here is required to continue.
                        </p>
                      </div>
                      <ChevronDown className="size-4 text-[#F5F4F1]/56" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="overflow-hidden pt-4">
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-3"
                      >
                        <FormField
                          control={form.control}
                          name="addOnIds"
                          render={() => (
                            <FormItem>
                              {addOns.map((addOn) => (
                                <FormField
                                  key={addOn.id}
                                  control={form.control}
                                  name="addOnIds"
                                  render={({ field }) => {
                                    const isChecked = field.value?.includes(addOn.id)

                                    return (
                                      <FormItem className="rounded-[1rem] border border-[#F5F4F1]/10 bg-[#07110D]/72 p-4">
                                        <div className="flex items-start gap-4">
                                          <FormControl>
                                            <Checkbox
                                              checked={isChecked}
                                              onCheckedChange={(checked) => {
                                                const nextValue = checked
                                                  ? [...(field.value ?? []), addOn.id]
                                                  : (field.value ?? []).filter((value) => value !== addOn.id)
                                                field.onChange(nextValue)
                                              }}
                                              className="mt-1 size-5 rounded-[0.4rem] border-[#F5F4F1]/18 data-[state=checked]:border-[#CFAF6B] data-[state=checked]:bg-[#CFAF6B] data-[state=checked]:text-[#050807]"
                                            />
                                          </FormControl>
                                          <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                              <FormLabel className="text-base font-semibold text-[#F5F4F1]">{addOn.label}</FormLabel>
                                              <span className="font-mono text-sm font-semibold uppercase tracking-[0.06em] text-[#CFAF6B]">
                                                {formatMoney(addOn.price)}
                                              </span>
                                            </div>
                                            <p className="mt-2 text-sm leading-6 text-[#F5F4F1]/58">{addOn.description}</p>
                                          </div>
                                        </div>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </CollapsibleContent>
                  </Collapsible>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-[#F5F4F1]/72">Notes</FormLabel>
                        <FormControl>
                          <MotionTextarea placeholder="Anything we should know before payment? This is optional." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="rounded-[1.4rem] border border-[#F5F4F1]/10 bg-[#0B1B15]/80 p-5">
                    <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#CFAF6B]">
                      You&apos;ll be redirected to payment
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[#F5F4F1]/66">
                      Your spot is confirmed once payment is complete. We&apos;ll show the exact amount, QR, UPI ID, and what happens next.
                    </p>
                  </div>

                  <AnimatePresence initial={false}>
                    {submissionError ? (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Alert variant="destructive" className="border border-red-400/30 bg-red-500/10 text-red-100">
                          <AlertTitle>We couldn&apos;t start your booking</AlertTitle>
                          <AlertDescription>{submissionError}</AlertDescription>
                        </Alert>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={isPending}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#F5F4F1] px-6 font-sans text-[0.74rem] font-bold uppercase tracking-[0.18em] text-[#0F2E23] transition hover:bg-[#CFAF6B] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
                    Proceed to payment
                  </motion.button>
                </form>
              </Form>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div data-booking-reveal className="sticky-summary-shell calm-panel rounded-[1.7rem] p-6">
              <BookingSummaryCard trip={trip} peopleCount={peopleCount} pricing={pricingPreview.pricing} addOns={pricingPreview.selectedAddOns} />
            </div>
          </aside>
        </div>
      </section>

      <div className="fixed inset-x-3 bottom-3 z-40 rounded-[1.25rem] border border-[#F5F4F1]/12 bg-[#050807]/88 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.38)] backdrop-blur-2xl lg:hidden">
        <motion.button
          type="button"
          whileTap={{ scale: 0.99 }}
          onClick={() => void onSubmit()}
          disabled={isPending}
          className="grid min-h-14 w-full grid-cols-[1fr_auto] items-center gap-3 rounded-[1rem] bg-[#F5F4F1] px-4 text-left text-[#0F2E23] disabled:opacity-70"
        >
          <span>
            <span className="block font-sans text-[0.58rem] font-bold uppercase tracking-[0.18em] opacity-72">
              {peopleCount} traveller{peopleCount > 1 ? 's' : ''} / Secure booking
            </span>
            <span className="block font-heading text-2xl leading-none">Proceed to payment</span>
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.08em]">{formatMoney(pricingPreview.pricing.totalAmount)}</span>
        </motion.button>
      </div>
    </main>
  )
}

function BookingSummaryCard({
  trip,
  peopleCount,
  pricing,
  addOns,
}: {
  trip: Trip
  peopleCount: number
  pricing: { pricePerPerson: number; baseAmount: number; addOnsAmount: number; totalAmount: number }
  addOns: { id: string; label: string; total: number }[]
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#CFAF6B]">Booking summary</p>
        <h3 className="font-heading text-5xl leading-[0.9] text-[#F5F4F1]">{trip.title}</h3>
        <p className="text-sm leading-6 text-[#F5F4F1]/62">{formatDate(trip.nextDeparture)} / {trip.startingPoint}</p>
      </div>

      <div className="space-y-4 rounded-[1.2rem] border border-[#F5F4F1]/10 bg-[#0B1B15]/74 p-4">
        <SummaryRow label="Price per person" value={formatMoney(pricing.pricePerPerson)} />
        <SummaryRow label="Travellers" value={String(peopleCount)} />
        <SummaryRow label="Base total" value={formatMoney(pricing.baseAmount)} />
        <SummaryRow label="Add-ons" value={pricing.addOnsAmount ? formatMoney(pricing.addOnsAmount) : 'None'} />
        {addOns.length ? (
          <div className="space-y-2 border-t border-[#F5F4F1]/10 pt-4">
            {addOns.map((addOn) => (
              <SummaryRow key={addOn.id} label={addOn.label} value={formatMoney(addOn.total)} subtle />
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-[1.25rem] border border-[#CFAF6B]/18 bg-[#CFAF6B]/10 p-4">
        <SummaryRow label="Total cost" value={formatMoney(pricing.totalAmount)} strong />
        <p className="mt-3 text-xs leading-5 text-[#F5F4F1]/58">
          Payment page will show this exact amount again. No hidden charges appear later.
        </p>
      </div>

      <div className="rounded-[1.25rem] border border-[#F5F4F1]/10 bg-[#0B1B15]/64 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-4 text-[#CFAF6B]" />
          <div>
            <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#F5F4F1]">
              What happens next
            </p>
            <p className="mt-2 text-sm leading-6 text-[#F5F4F1]/58">
              You&apos;ll get a clean payment screen, direct organizer details, and a confirmation step after you pay.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  strong = false,
  subtle = false,
}: {
  label: string
  value: string
  strong?: boolean
  subtle?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={cn('text-sm', subtle ? 'text-[#F5F4F1]/48' : 'text-[#F5F4F1]/62')}>{label}</span>
      <span className={cn('font-mono text-sm uppercase tracking-[0.06em]', strong ? 'font-bold text-[#F5F4F1]' : 'font-semibold text-[#F5F4F1]')}>
        {value}
      </span>
    </div>
  )
}

const MotionInput = motion.create(Input)
const MotionTextarea = motion.create(Textarea)
