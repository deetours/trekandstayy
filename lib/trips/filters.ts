import type { Trip, TripFilters } from './types'

export const defaultTripFilters: TripFilters = {
  identity: 'All Routes',
  region: 'All',
  duration: 'All',
  difficulty: 'All',
  season: 'All',
  type: 'All',
  budget: 'All',
}

export function filterTrips(trips: Trip[], filters: TripFilters) {
  return trips.filter((trip) => {
    const identityMatch =
      filters.identity === 'All Routes' || trip.identityTags.includes(filters.identity)

    const regionMatch = filters.region === 'All' || trip.region === filters.region
    const difficultyMatch = filters.difficulty === 'All' || trip.difficulty === filters.difficulty
    const typeMatch = filters.type === 'All' || trip.type === filters.type
    const seasonMatch = filters.season === 'All' || trip.season.includes(filters.season)

    const durationMatch =
      filters.duration === 'All' ||
      (filters.duration === 'Weekend' && trip.durationDays <= 3) ||
      (filters.duration === '4-6 Days' && trip.durationDays >= 4 && trip.durationDays <= 6) ||
      (filters.duration === '7+ Days' && trip.durationDays >= 7)

    const budgetMatch =
      filters.budget === 'All' ||
      (filters.budget === 'Under 5K' && trip.startingPrice < 5000) ||
      (filters.budget === '5K-15K' && trip.startingPrice >= 5000 && trip.startingPrice <= 15000) ||
      (filters.budget === '15K+' && trip.startingPrice > 15000)

    return (
      identityMatch &&
      regionMatch &&
      difficultyMatch &&
      typeMatch &&
      seasonMatch &&
      durationMatch &&
      budgetMatch
    )
  })
}

export function getFeaturedTrips(trips: Trip[]) {
  return trips
    .filter((trip) => trip.featured)
    .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99))
}
