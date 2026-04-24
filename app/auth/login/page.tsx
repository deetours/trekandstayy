'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/auth/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (data.user) {
        // Check if user is admin
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (adminUser?.role === 'admin') {
          router.push('/admin')
        } else {
          toast.error('You do not have admin access')
          await supabase.auth.signOut()
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#050807] to-[#0a0c0f] px-4">
      <Card className="w-full max-w-md border-[#F5F4F1]/10 bg-[#0a0c0f]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#F5F4F1]">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F5F4F1]">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@trekandstay.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#050807] border-[#F5F4F1]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#F5F4F1]">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#050807] border-[#F5F4F1]/20"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#CFAF6B] text-[#050807] hover:bg-[#CFAF6B]/90"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-[#F5F4F1]/60">
            Need help? <Link href="/contact" className="text-[#CFAF6B] hover:underline">Contact support</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
