import { randomUUID } from 'node:crypto'
import { staticTrips } from '@/lib/trips/static-trips'
import type {
  BookingAddOnSelection,
  BookingContact,
  BookingDraft,
  BookingPricing,
  PaymentInstruction,
  PaymentConfig,
  Trip,
  TripAddOn,
} from '@/lib/trips/types'

type CreateBookingDraftInput = {
  selectedDate?: string
  contact: BookingContact
  addOnIds?: string[]
}

type SubmitPaymentIntentInput = {
  bookingId: string
}

const bookingDrafts = new Map<string, BookingDraft>()

const DEFAULT_ADD_ONS: TripAddOn[] = [
  {
    id: 'city-transfer',
    label: 'Shared city transfer',
    description: 'Coordinated pickup from the start city so you do not have to piece the route together.',
    price: 1499,
  },
  {
    id: 'gear-rental',
    label: 'Gear rental support',
    description: 'Route-matched essentials arranged ahead of departure for trekkers who are missing key items.',
    price: 999,
  },
  {
    id: 'route-insurance',
    label: 'Travel insurance assist',
    description: 'Basic trip coverage assistance for route delays and medical escalation support.',
    price: 699,
  },
]

const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  displayName: 'Trek and Stay Experiences',
  upiId: 'trekandstay@upi',
  supportPhone: '919876543210',
  supportLabel: '+91 98765 43210',
  verificationEta: 'within 15 minutes during support hours',
}

export function getPublishedTrip(slug: string) {
  return staticTrips.find((trip) => trip.slug === slug && trip.status === 'published') ?? null
}

export function getTripAddOns(trip: Trip) {
  return trip.availableAddOns?.length ? trip.availableAddOns : DEFAULT_ADD_ONS
}

export function getTripPaymentConfig(trip: Trip) {
  return trip.paymentConfig ?? DEFAULT_PAYMENT_CONFIG
}

export function calculateBookingPricing(
  trip: Trip,
  peopleCount: number,
  addOnIds: string[] = [],
): { pricing: BookingPricing; selectedAddOns: BookingAddOnSelection[] } {
  const selectedAddOns = getTripAddOns(trip)
    .filter((addOn) => addOnIds.includes(addOn.id))
    .map((addOn) => ({
      ...addOn,
      quantity: 1,
      total: addOn.price,
    }))

  const baseAmount = trip.startingPrice * peopleCount
  const addOnsAmount = selectedAddOns.reduce((sum, addOn) => sum + addOn.total, 0)

  return {
    pricing: {
      pricePerPerson: trip.startingPrice,
      baseAmount,
      addOnsAmount,
      totalAmount: baseAmount + addOnsAmount,
    },
    selectedAddOns,
  }
}

export async function createBookingDraft(tripSlug: string, input: CreateBookingDraftInput) {
  const trip = getPublishedTrip(tripSlug)
  if (!trip) {
    throw new Error('Trip not found')
  }

  const { pricing, selectedAddOns } = calculateBookingPricing(trip, input.contact.peopleCount, input.addOnIds ?? [])
  const now = new Date().toISOString()

  const draft: BookingDraft = {
    id: randomUUID(),
    tripSlug: trip.slug,
    status: 'awaiting_payment',
    contact: input.contact,
    selectedDate: input.selectedDate ?? trip.nextDeparture,
    selectedAddOns,
    pricing,
    createdAt: now,
    updatedAt: now,
  }

  bookingDrafts.set(draft.id, draft)
  return draft
}

export async function getBookingDraft(bookingId: string) {
  return bookingDrafts.get(bookingId) ?? null
}

export async function submitPaymentIntent(input: SubmitPaymentIntentInput) {
  const draft = bookingDrafts.get(input.bookingId)
  if (!draft) {
    throw new Error('Booking not found')
  }

  const updated: BookingDraft = {
    ...draft,
    status: 'payment_submitted',
    updatedAt: new Date().toISOString(),
    paymentSubmittedAt: new Date().toISOString(),
  }

  bookingDrafts.set(updated.id, updated)
  return updated
}

export async function getPaymentInstructions(params: { tripSlug?: string; bookingId?: string }) {
  const booking = params.bookingId ? await getBookingDraft(params.bookingId) : null
  const trip = booking ? getPublishedTrip(booking.tripSlug) : params.tripSlug ? getPublishedTrip(params.tripSlug) : null

  if (!trip) {
    throw new Error('Trip not found')
  }

  const paymentConfig = getTripPaymentConfig(trip)
  const amount = booking?.pricing.totalAmount ?? trip.startingPrice
  const note = booking ? `Trek and Stay booking ${booking.id}` : `${trip.title} reservation`

  return {
    bookingId: booking?.id,
    payeeName: paymentConfig.displayName,
    upiId: paymentConfig.upiId,
    qrSource:
      paymentConfig.qrSource ??
      createUpiQrSource({
        upiId: paymentConfig.upiId,
        payeeName: paymentConfig.displayName,
        amount,
        note,
      }),
    supportPhone: paymentConfig.supportPhone,
    supportLabel: paymentConfig.supportLabel,
    verificationEta: paymentConfig.verificationEta,
    amount,
    note,
  } satisfies PaymentInstruction
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(value))
}

export function createRouteQuestionHref(trip: Trip) {
  const subject = `Question before booking: ${trip.title}`
  const body = [
    `Hi Trek and Stay,`,
    ``,
    `I have a question before booking ${trip.title}.`,
    `Departure: ${formatDate(trip.nextDeparture)}`,
    ``,
    `My question:`,
  ].join('\n')

  return `mailto:hello@trekandstay.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function createUpiQrSource({
  upiId,
  payeeName,
  amount,
  note,
}: {
  upiId: string
  payeeName: string
  amount: number
  note: string
}) {
  const url = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`
  return `https://api.qrserver.com/v1/create-qr-code/?size=720x720&margin=12&data=${encodeURIComponent(url)}`
}
