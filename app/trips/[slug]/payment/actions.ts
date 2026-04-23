'use server'

import { submitPaymentIntent } from '@/lib/trips/booking-store'

export async function submitPaymentIntentAction(bookingId: string) {
  try {
    const booking = await submitPaymentIntent({ bookingId })

    return {
      success: true as const,
      status: booking.status,
      submittedAt: booking.paymentSubmittedAt,
    }
  } catch (error) {
    return {
      success: false as const,
      message: error instanceof Error ? error.message : 'We could not record the payment update.',
    }
  }
}
