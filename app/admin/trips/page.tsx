'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Plus } from 'lucide-react'
import { staticTrips } from '@/lib/trips/static-trips'

export default function AdminTripsPage() {
  const [trips, setTrips] = useState(staticTrips)
  const [loading, setLoading] = useState(false)

  const publishedCount = trips.filter(t => t.status === 'published').length
  const draftCount = trips.filter(t => t.status === 'draft').length

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      setTrips(trips.filter(t => t.id !== id))
      // TODO: Call API to delete from database
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-[#F5F4F1]">Manage Trips</h1>
          <p className="text-[#F5F4F1]/60 mt-2">Edit, create, and manage trip listings</p>
        </div>
        <Link href="/admin/trips/new">
          <Button className="bg-[#CFAF6B] text-[#050807] hover:bg-[#CFAF6B]/90">
            <Plus className="w-4 h-4 mr-2" />
            New Trip
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#0a0c0f] border-[#F5F4F1]/10">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#CFAF6B]">{publishedCount}</div>
            <p className="text-xs text-[#F5F4F1]/60 mt-1">Published</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0c0f] border-[#F5F4F1]/10">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#CFAF6B]">{draftCount}</div>
            <p className="text-xs text-[#F5F4F1]/60 mt-1">Draft</p>
          </CardContent>
        </Card>
      </div>

      {/* Trips Table */}
      <Card className="bg-[#0a0c0f] border-[#F5F4F1]/10">
        <CardHeader>
          <CardTitle className="text-[#F5F4F1]">All Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#F5F4F1]/10">
                  <TableHead className="text-[#F5F4F1]/60">Title</TableHead>
                  <TableHead className="text-[#F5F4F1]/60">Region</TableHead>
                  <TableHead className="text-[#F5F4F1]/60">Type</TableHead>
                  <TableHead className="text-[#F5F4F1]/60">Status</TableHead>
                  <TableHead className="text-[#F5F4F1]/60">Featured</TableHead>
                  <TableHead className="text-[#F5F4F1]/60">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id} className="border-[#F5F4F1]/10">
                    <TableCell className="text-[#F5F4F1]">{trip.title}</TableCell>
                    <TableCell className="text-[#F5F4F1]/60">{trip.region}</TableCell>
                    <TableCell className="text-[#F5F4F1]/60">{trip.type}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          trip.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }
                      >
                        {trip.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={trip.featured ? 'default' : 'outline'}>
                        {trip.featured ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Link href={`/admin/trips/${trip.id}/edit`}>
                        <Button size="sm" variant="ghost" className="text-[#CFAF6B] hover:bg-[#F5F4F1]/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(trip.id)}
                        className="text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
