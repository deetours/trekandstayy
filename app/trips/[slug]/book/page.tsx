import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BookingExperience from '@/components/booking/BookingExperience'
import { getPublishedTrip } from '@/lib/trips/booking-store'

type BookingPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  const { slug } = await params
  const trip = getPublishedTrip(slug)

  if (!trip) {
    return {
      title: 'Booking not found | Trek and Stay',
    }
  }

  return {
    title: `Book ${trip.title} | Trek and Stay`,
    description: `Complete your ${trip.title} booking with a calm, secure payment handoff.`,
  }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { slug } = await params
  const trip = getPublishedTrip(slug)

  if (!trip) notFound()

  return <BookingExperience trip={trip} />
}
