import { staticTrips } from './static-trips'

export async function getTrips() {
  return staticTrips
    .filter((trip) => trip.status === 'published')
    .sort((a, b) => a.title.localeCompare(b.title))
}
