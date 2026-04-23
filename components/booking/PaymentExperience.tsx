'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { AlertCircle, CheckCircle2, Copy, LoaderCircle, MessageCircleMore, ShieldCheck } from 'lucide-react'
import { useLayoutEffect, useState, useTransition } from 'react'
import { submitPaymentIntentAction } from '@/app/trips/[slug]/payment/actions'
import SharedTripsHeader from '@/components/SharedTripsHeader'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { formatDate, formatMoney, getTripPaymentConfig } from '@/lib/trips/booking-store'
import type { BookingDraft, PaymentInstruction, Trip } from '@/lib/trips/types'

type PaymentExperienceProps = {
  trip: Trip
  booking: BookingDraft | null
  instructions: PaymentInstruction | null
}

export default function PaymentExperience({ trip, booking, instructions }: PaymentExperienceProps) {
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [paymentMarkedComplete, setPaymentMarkedComplete] = useState(booking?.status === 'payment_submitted')
  const supportLink = `https://wa.me/${(instructions?.supportPhone ?? getTripPaymentConfig(trip).supportPhone).replace(/\D/g, '')}`

  useLayoutEffect(() => {
    if (shouldReduceMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-payment-reveal]',
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
        },
      )
    })

    return () => ctx.revert()
  }, [shouldReduceMotion])

  async function handleCopy() {
    if (!instructions?.upiId) return

    try {
      await navigator.clipboard.writeText(instructions.upiId)
      setCopyState('done')
      window.setTimeout(() => setCopyState('idle'), 1800)
    } catch {
      setCopyState('error')
      window.setTimeout(() => setCopyState('idle'), 1800)
    }
  }

  function handleMarkPaid() {
    if (!booking?.id) return

    setSubmitError(null)
    startTransition(async () => {
      const result = await submitPaymentIntentAction(booking.id)
      if (!result.success) {
        setSubmitError(result.message)
        return
      }

      setPaymentMarkedComplete(true)
      router.refresh()
    })
  }

  if (!booking || !instructions) {
    return (
      <main className="trip-detail-root payment-page min-h-[100dvh] bg-[#050807] pb-20 text-[#F5F4F1]">
        <SharedTripsHeader actionHref={`/trips/${trip.slug}/book`} actionLabel="Back to booking" />
        <section className="mx-auto max-w-[880px] px-4 pb-10 pt-32 sm:px-6 lg:px-8">
          <div className="rounded-[1.8rem] border border-[#F5F4F1]/10 bg-[#07110D]/84 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)] sm:p-8">
            <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#CFAF6B]">Payment status</p>
            <h1 className="mt-4 font-heading text-6xl leading-[0.88] text-[#F5F4F1]">We need your booking first</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#F5F4F1]/64">
              This payment page only works with a valid booking draft. Start from the booking step so we can carry the right amount and traveller details forward.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/trips/${trip.slug}/book`}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F5F4F1] px-6 font-sans text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#0F2E23] transition hover:bg-[#CFAF6B]"
              >
                Go to booking
              </Link>
              <Link
                href={supportLink}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#F5F4F1]/12 px-6 font-sans text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#F5F4F1]/72 transition hover:border-[#CFAF6B]/45 hover:text-[#F5F4F1]"
              >
                Contact support
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="trip-detail-root payment-page min-h-[100dvh] bg-[#050807] pb-28 text-[#F5F4F1]">
      <SharedTripsHeader actionHref={`/trips/${trip.slug}/book`} actionLabel="Edit booking" />

      <section className="mx-auto max-w-[1120px] px-4 pb-8 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        <div data-payment-reveal className="payment-frame rounded-[1.8rem] p-6 sm:p-8">
          <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#CFAF6B]">Final step</p>
          <h1 className="mt-4 font-heading text-[clamp(3.5rem,8vw,6.8rem)] leading-[0.84] text-[#F5F4F1]">Secure your spot</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#F5F4F1]/68">
            Keep the amount exact, use any UPI app, then tell us once you&apos;ve completed payment. We&apos;ll verify it shortly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {['Verified organizer', 'Direct payment', 'Support available'].map((item) => (
                <span
                  key={item}
                  className="trust-chip inline-flex items-center rounded-full px-4 py-2 font-sans text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#F5F4F1]/72"
                >
                  {item}
                </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div data-payment-reveal className="space-y-4">
            <div className="calm-panel rounded-[1.6rem] p-5">
              <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#CFAF6B]">Payment summary</p>
              <div className="mt-5 space-y-4">
                <PaymentRow label="Trip" value={trip.title} />
                <PaymentRow label="Date" value={formatDate(booking.selectedDate)} />
                <PaymentRow label="People" value={String(booking.contact.peopleCount)} />
                <PaymentRow label="Booking ID" value={booking.id.slice(0, 8).toUpperCase()} />
                <div className="border-t border-[#F5F4F1]/10 pt-4">
                  <PaymentRow label="Total amount" value={formatMoney(booking.pricing.totalAmount)} strong />
                </div>
              </div>
            </div>

            <div className="rounded-[1.45rem] border border-[#F5F4F1]/10 bg-[#0B1B15]/68 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-4 text-[#CFAF6B]" />
                <div>
                  <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#F5F4F1]">If something feels off</p>
                  <p className="mt-2 text-sm leading-6 text-[#F5F4F1]/58">
                    Pay only the amount shown here. If the QR doesn&apos;t scan or the amount looks wrong, contact support before retrying.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div data-payment-reveal className="payment-frame rounded-[1.8rem] p-5 sm:p-8">
            <div className="mx-auto max-w-[640px] text-center">
              <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.26em] text-[#CFAF6B]">Scan using any UPI app</p>
              <h2 className="mt-3 font-heading text-6xl leading-[0.88] text-[#F5F4F1] sm:text-7xl">{formatMoney(instructions.amount)}</h2>
              <p className="mt-3 text-sm leading-6 text-[#F5F4F1]/58">Use the QR below or copy the UPI ID manually if you prefer.</p>

              <div className="mt-8 rounded-[2rem] border border-[#F5F4F1]/10 bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:p-6">
                {instructions.qrSource ? (
                  <img
                    src={instructions.qrSource}
                    alt={`UPI QR for ${instructions.payeeName}`}
                    className="mx-auto aspect-square w-full max-w-[360px] rounded-[1.2rem] object-contain"
                  />
                ) : (
                  <div className="mx-auto flex aspect-square w-full max-w-[360px] items-center justify-center rounded-[1.2rem] bg-[#F4F2EB] px-6 text-center text-sm text-[#0F2E23]">
                    QR unavailable right now. Use the UPI ID below or contact support before paying.
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-[1.35rem] border border-[#F5F4F1]/10 bg-[#0B1B15]/72 p-4 text-left">
                <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[#F5F4F1]/58">UPI ID</p>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-base font-semibold uppercase tracking-[0.06em] text-[#F5F4F1]">{instructions.upiId}</p>
                    <p className="mt-1 text-xs leading-5 text-[#F5F4F1]/48">{instructions.payeeName}</p>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={handleCopy}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#F5F4F1]/14 px-5 font-sans text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[#F5F4F1]/78 transition hover:border-[#CFAF6B]/45 hover:text-[#F5F4F1]"
                  >
                    <Copy className="size-4" />
                    {copyState === 'done' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy UPI ID'}
                  </motion.button>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href={supportLink}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#F5F4F1]/14 px-6 font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#F5F4F1]/78 transition hover:border-[#CFAF6B]/45 hover:text-[#F5F4F1]"
                >
                  <MessageCircleMore className="size-4" />
                  Need help?
                </Link>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleMarkPaid}
                  disabled={isPending || paymentMarkedComplete}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#F5F4F1] px-6 font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#0F2E23] transition hover:bg-[#CFAF6B] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? <LoaderCircle className="size-4 animate-spin" /> : paymentMarkedComplete ? <CheckCircle2 className="size-4" /> : null}
                  {paymentMarkedComplete ? "We've recorded it" : "I've completed payment"}
                </motion.button>
              </div>

              <AnimatePresence initial={false}>
                {submitError ? (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-6">
                    <Alert variant="destructive" className="border border-red-400/30 bg-red-500/10 text-left text-red-100">
                      <AlertCircle className="size-4" />
                      <AlertTitle>We couldn&apos;t mark that payment yet</AlertTitle>
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence initial={false}>
                {paymentMarkedComplete ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className="mt-6 rounded-[1.4rem] border border-[#CFAF6B]/18 bg-[#CFAF6B]/10 p-5 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 text-[#CFAF6B]" />
                      <div>
                        <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#F5F4F1]">
                          Payment submitted
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#F5F4F1]/64">
                          We&apos;ll verify your payment shortly and send confirmation on WhatsApp. Typical verification time is {instructions.verificationEta}.
                        </p>
                        <p className="mt-3 text-sm leading-6 text-[#F5F4F1]/56">
                          If you paid the wrong amount or something failed in your app, contact support before retrying so we do not create confusion.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function PaymentRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-[#F5F4F1]/58">{label}</span>
      <span className={strong ? 'font-mono text-sm font-bold uppercase tracking-[0.06em] text-[#F5F4F1]' : 'font-mono text-sm font-semibold uppercase tracking-[0.06em] text-[#F5F4F1]'}>
        {value}
      </span>
    </div>
  )
}
