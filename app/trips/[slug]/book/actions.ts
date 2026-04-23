'use server'

import { z } from 'zod'
import { createBookingDraft } from '@/lib/trips/booking-store'

const bookingPayloadSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name'),
  phone: z
    .string()
    .trim()
    .min(10, 'Enter a valid phone number')
    .regex(/^[\d+\-\s()]+$/, 'Phone number can only include numbers and common symbols'),
  email: z.string().trim().email('Enter a valid email address'),
  emergencyContact: z.string().trim().min(10, 'Add an emergency contact'),
  peopleCount: z.coerce.number().int().min(1, 'At least 1 traveller is required').max(12, 'For larger groups, contact support'),
  experienceLevel: z.string().trim().optional(),
  notes: z.string().trim().max(300, 'Keep notes under 300 characters').optional(),
  addOnIds: z.array(z.string()).optional(),
})

export async function createBookingDraftAction(
  tripSlug: string,
  payload: z.input<typeof bookingPayloadSchema>,
) {
  const parsed = bookingPayloadSchema.safeParse(payload)

  if (!parsed.success) {
    return {
      success: false as const,
      message: parsed.error.issues[0]?.message ?? 'Please check the form and try again.',
    }
  }

  try {
    const draft = await createBookingDraft(tripSlug, {
      contact: {
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        email: parsed.data.email,
        emergencyContact: parsed.data.emergencyContact,
        peopleCount: parsed.data.peopleCount,
        experienceLevel: parsed.data.experienceLevel || undefined,
        notes: parsed.data.notes || undefined,
      },
      addOnIds: parsed.data.addOnIds ?? [],
    })

    return {
      success: true as const,
      bookingId: draft.id,
    }
  } catch (error) {
    return {
      success: false as const,
      message: error instanceof Error ? error.message : 'We could not start your booking right now.',
    }
  }
}
