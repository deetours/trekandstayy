'use client'

import { useRequireAdmin } from '@/lib/auth/hooks'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from '@/components/ui/sidebar'
import { BarChart3, MapPin, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/client'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useRequireAdmin()
  const router = useRouter()
  const supabase = createClient()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050807]">
        <div className="animate-spin">
          <div className="h-8 w-8 border-4 border-[#CFAF6B] border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <SidebarProvider>
      <div className="flex w-full gap-0 bg-[#050807] text-[#F5F4F1]">
        {/* Sidebar */}
        <Sidebar className="border-r border-[#F5F4F1]/10 bg-[#0a0c0f] w-64">
          <SidebarHeader className="border-b border-[#F5F4F1]/10 p-4">
            <h1 className="text-xl font-bold text-[#CFAF6B]">Trek & Stay</h1>
            <p className="text-xs text-[#F5F4F1]/60 mt-1">Admin Dashboard</p>
          </SidebarHeader>
          <SidebarContent className="p-4 space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#F5F4F1]/10 transition"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </Link>
            <Link
              href="/admin/trips"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#F5F4F1]/10 transition"
            >
              <MapPin className="w-4 h-4" />
              <span>Trips</span>
            </Link>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-[#F5F4F1]/10">
            <div className="text-xs text-[#F5F4F1]/60 mb-3">
              Logged in as: <br />
              <span className="text-[#CFAF6B]">{user?.email}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full border-[#F5F4F1]/20 text-[#F5F4F1] hover:bg-[#F5F4F1]/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
