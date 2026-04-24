import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#F5F4F1]">Admin Dashboard</h1>
        <p className="text-[#F5F4F1]/60 mt-2">Manage Trek & Stay operations</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#0a0c0f] border-[#F5F4F1]/10">
          <CardHeader>
            <CardTitle className="text-sm text-[#F5F4F1]/60">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#CFAF6B]">12</div>
            <p className="text-xs text-[#F5F4F1]/40 mt-2">Live & Published</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0c0f] border-[#F5F4F1]/10">
          <CardHeader>
            <CardTitle className="text-sm text-[#F5F4F1]/60">Upcoming Departures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#CFAF6B]">24</div>
            <p className="text-xs text-[#F5F4F1]/40 mt-2">Next 90 days</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0c0f] border-[#F5F4F1]/10">
          <CardHeader>
            <CardTitle className="text-sm text-[#F5F4F1]/60">Draft Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#CFAF6B]">3</div>
            <p className="text-xs text-[#F5F4F1]/40 mt-2">Awaiting publication</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-[#0a0c0f] border-[#F5F4F1]/10">
        <CardHeader>
          <CardTitle className="text-[#F5F4F1]">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link href="/admin/trips/new">
            <Button className="bg-[#CFAF6B] text-[#050807] hover:bg-[#CFAF6B]/90">
              Create New Trip
            </Button>
          </Link>
          <Link href="/admin/trips">
            <Button variant="outline" className="border-[#F5F4F1]/20 text-[#F5F4F1] hover:bg-[#F5F4F1]/10">
              Manage Trips
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-[#0a0c0f] border-[#F5F4F1]/10">
        <CardHeader>
          <CardTitle className="text-[#F5F4F1]">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-[#F5F4F1]/10">
              <span className="text-[#F5F4F1]/60">Kudremukh Trek - Updated</span>
              <span className="text-[#CFAF6B]">2 hours ago</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#F5F4F1]/10">
              <span className="text-[#F5F4F1]/60">Spiti Road Trip - Departure Added</span>
              <span className="text-[#CFAF6B]">5 hours ago</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[#F5F4F1]/60">Kokan Kada - New departure booked</span>
              <span className="text-[#CFAF6B]">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
