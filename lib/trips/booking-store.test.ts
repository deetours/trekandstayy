import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateBookingPricing, createBookingDraft, getBookingDraft, getPublishedTrip, getPaymentInstructions, submitPaymentIntent } from '@/lib/trips/booking-store'

test('calculateBookingPricing includes per-person fare and selected add-ons', () => {
  const trip = getPublishedTrip('spiti-road-journey')
  assert.ok(trip)

  const addOnIds = trip.availableAddOns?.length ? [trip.availableAddOns[0].id] : ['city-transfer']
  const result = calculateBookingPricing(trip, 2, addOnIds)

  assert.equal(result.pricing.baseAmount, trip.startingPrice * 2)
  assert.ok(result.pricing.totalAmount > result.pricing.baseAmount)
  assert.equal(result.selectedAddOns.length, 1)
})

test('booking draft flows into payment instructions and submitted status', async () => {
  const draft = await createBookingDraft('spiti-road-journey', {
    contact: {
      fullName: 'Test Traveller',
      phone: '+919999999999',
      email: 'traveller@example.com',
      emergencyContact: '+918888888888',
      peopleCount: 2,
      experienceLevel: 'Some weekend trek experience',
      notes: 'Window seat if possible',
    },
    addOnIds: ['gear-rental'],
  })

  const storedDraft = await getBookingDraft(draft.id)
  assert.ok(storedDraft)
  assert.equal(storedDraft.status, 'awaiting_payment')

  const instructions = await getPaymentInstructions({ bookingId: draft.id })
  assert.equal(instructions.bookingId, draft.id)
  assert.equal(instructions.amount, storedDraft.pricing.totalAmount)
  assert.match(instructions.upiId, /@/)

  const updatedDraft = await submitPaymentIntent({ bookingId: draft.id })
  assert.equal(updatedDraft.status, 'payment_submitted')
  assert.ok(updatedDraft.paymentSubmittedAt)
})
