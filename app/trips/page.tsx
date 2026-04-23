import type { Metadata } from 'next'
import { getTrips } from '@/lib/trips/get-trips'
import TripsExperience from '@/components/trips/TripsExperience'

export const metadata: Metadata = {
  title: 'Trips | Choose Your Route',
  description:
    'Treks in Karnataka and Maharashtra. Road journeys through Himachal. No packages. Only real routes.',
}

export default async function TripsPage() {
  const trips = await getTrips()

  return <TripsExperience trips={trips} />
}
