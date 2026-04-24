import { createServerClient_Auth } from '@/lib/auth/server'
import { redirect } from 'next/navigation'

export async function GET() {
  const supabase = await createServerClient_Auth()
  await supabase.auth.signOut()
  redirect('/auth/login')
}
