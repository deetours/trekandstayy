import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import TripDetailExperience from '@/components/trip-detail/TripDetailExperience'
import { staticTrips } from '@/lib/trips/static-trips'

type TripDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return staticTrips.filter((trip) => trip.status === 'published').map((trip) => ({ slug: trip.slug }))
}

export async function generateMetadata({ params }: TripDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const trip = staticTrips.find((item) => item.slug === slug && item.status === 'published')

  if (!trip) {
    return {
      title: 'Trip not found | Trek and Stay',
    }
  }

  return {
    title: `${trip.title} | Trek and Stay`,
    description: trip.realityNote,
  }
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { slug } = await params
  const trip = staticTrips.find((item) => item.slug === slug && item.status === 'published')

  if (!trip) notFound()

  return <TripDetailExperience trip={trip} />
}
