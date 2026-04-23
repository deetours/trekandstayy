export type TripRegion = 'Karnataka' | 'Maharashtra' | 'Himachal'

export type TripType = 'Trek' | 'Road Trip' | 'Weekend Escape'

export type TripDifficulty = 'Beginner' | 'Moderate' | 'Hard' | 'Extreme'

export type TripStatus = 'draft' | 'published' | 'archived'

export type TripItineraryDay = {
  day: number
  route: string
  highlight: string
  details: string
}

export type TripPerson = {
  name: string
  role: string
  line: string
  image: string
}

export type TripProofMoment = {
  quote: string
  meta: string
  image: string
}

export type TripAddOn = {
  id: string
  label: string
  description: string
  price: number
}

export type PaymentConfig = {
  displayName: string
  upiId: string
  qrSource?: string
  supportPhone: string
  supportLabel: string
  verificationEta: string
}

export type BookingStatus =
  | 'draft'
  | 'awaiting_payment'
  | 'payment_submitted'
  | 'payment_verified'
  | 'payment_failed'

export type BookingContact = {
  fullName: string
  phone: string
  email: string
  emergencyContact: string
  peopleCount: number
  experienceLevel?: string
  notes?: string
}

export type BookingPricing = {
  pricePerPerson: number
  baseAmount: number
  addOnsAmount: number
  totalAmount: number
}

export type BookingAddOnSelection = TripAddOn & {
  quantity: number
  total: number
}

export type BookingDraft = {
  id: string
  tripSlug: string
  status: BookingStatus
  contact: BookingContact
  selectedDate: string
  selectedAddOns: BookingAddOnSelection[]
  pricing: BookingPricing
  createdAt: string
  updatedAt: string
  paymentSubmittedAt?: string
}

export type PaymentInstruction = {
  bookingId?: string
  payeeName: string
  upiId: string
  qrSource?: string
  supportPhone: string
  supportLabel: string
  verificationEta: string
  amount: number
  note: string
}

export type Trip = {
  id: string
  slug: string
  title: string
  descriptor: string
  realityNote: string
  region: TripRegion
  destination: string
  type: TripType
  identityTags: string[]
  durationDays: number
  durationLabel: string
  difficulty: TripDifficulty
  season: string[]
  startingPoint: string
  startingPrice: number
  nextDeparture: string
  spotsLeft?: number
  groupSize?: string
  altitude?: string
  availableAddOns?: TripAddOn[]
  paymentConfig?: PaymentConfig
  image: string
  gallery?: string[]
  featured: boolean
  featuredRank?: number
  highlights: string[]
  tripDetail?: {
    heroLine: string
    altitudeLine: string
    emotionalHook: string
    realityChecks: string[]
    itinerary: TripItineraryDay[]
    included: string[]
    notIncluded: string[]
    proof: TripProofMoment[]
    captains: TripPerson[]
    bestSeason: string
    finalLine: string
  }
  status: TripStatus
}

export type TripFilters = {
  identity: string
  region: string
  duration: string
  difficulty: string
  season: string
  type: string
  budget: string
}
