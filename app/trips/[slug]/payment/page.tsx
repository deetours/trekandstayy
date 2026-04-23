import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PaymentExperience from '@/components/booking/PaymentExperience'
import { getBookingDraft, getPaymentInstructions, getPublishedTrip } from '@/lib/trips/booking-store'

type PaymentPageProps = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    booking?: string
  }>
}

export async function generateMetadata({ params }: PaymentPageProps): Promise<Metadata> {
  const { slug } = await params
  const trip = getPublishedTrip(slug)

  if (!trip) {
    return {
      title: 'Payment not found | Trek and Stay',
    }
  }

  return {
    title: `Payment for ${trip.title} | Trek and Stay`,
    description: `Secure your Trek and Stay booking for ${trip.title} with a clear UPI payment flow.`,
  }
}

export default async function PaymentPage({ params, searchParams }: PaymentPageProps) {
  const { slug } = await params
  const { booking: bookingId } = await searchParams
  const trip = getPublishedTrip(slug)

  if (!trip) notFound()

  const booking = bookingId ? await getBookingDraft(bookingId) : null
  const instructions =
    booking && booking.tripSlug === trip.slug
      ? await getPaymentInstructions({ bookingId })
      : null

  return <PaymentExperience trip={trip} booking={booking && booking.tripSlug === trip.slug ? booking : null} instructions={instructions} />
}
