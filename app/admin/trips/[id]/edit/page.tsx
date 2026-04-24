'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { staticTrips } from '@/lib/trips/static-trips'
import type { Trip } from '@/lib/trips/types'

export default function EditTripPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    const foundTrip = staticTrips.find(t => t.id === params.id)
    if (foundTrip) {
      setTrip(foundTrip)
    } else {
      toast.error('Trip not found')
      router.push('/admin/trips')
    }
  }, [params.id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!trip) return
    const { name, value } = e.target
    setTrip({ ...trip, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    if (!trip) return
    setTrip({ ...trip, [name]: value })
  }

  const handleAddTag = () => {
    if (!trip) return
    if (newTag && !trip.identityTags.includes(newTag)) {
      setTrip({ ...trip, identityTags: [...trip.identityTags, newTag] })
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    if (!trip) return
    setTrip({ ...trip, identityTags: trip.identityTags.filter(t => t !== tag) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Call API to update trip in database
      toast.success('Trip updated successfully!')
      router.push('/admin/trips')
    } catch (error) {
      toast.error('Failed to update trip')
    } finally {
      setLoading(false)
    }
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin">
          <div className="h-8 w-8 border-4 border-[#CFAF6B] border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold text-[#F5F4F1]">Edit Trip</h1>
        <h2 className="text-lg text-[#CFAF6B] mt-1">{trip.title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="bg-[#0a0c0f] border-[#F5F4F1]/10">
          <CardHeader>
            <CardTitle className="text-[#F5F4F1]">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#F5F4F1]">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={trip.title}
                  onChange={handleInputChange}
                  className="bg-[#050807] border-[#F5F4F1]/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-[#F5F4F1]">Destination</Label>
                <Input
                  id="destination"
                  name="destination"
                  type="text"
                  value={trip.destination}
                  onChange={handleInputChange}
                  className="bg-[#050807] border-[#F5F4F1]/20"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptor" className="text-[#F5F4F1]">Short Descriptor</Label>
              <Input
                id="descriptor"
                name="descriptor"
                type="text"
                value={trip.descriptor}
                onChange={handleInputChange}
                className="bg-[#050807] border-[#F5F4F1]/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="realityNote" className="text-[#F5F4F1]">Reality Note</Label>
              <Textarea
                id="realityNote"
                name="realityNote"
                value={trip.realityNote}
                onChange={handleInputChange}
                className="bg-[#050807] border-[#F5F4F1]/20"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Trip Details */}
        <Card className="bg-[#0a0c0f] border-[#F5F4F1]/10">
          <CardHeader>
            <CardTitle className="text-[#F5F4F1]">Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region" className="text-[#F5F4F1]">Region</Label>
                <Select value={trip.region} onValueChange={(value) => handleSelectChange('region', value)}>
                  <SelectTrigger className="bg-[#050807] border-[#F5F4F1]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050807] border-[#F5F4F1]/20">
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Himachal">Himachal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-[#F5F4F1]">Type</Label>
                <Select value={trip.type} onValueChange={(value) => handleSelectChange('type', value)}>
                  <SelectTrigger className="bg-[#050807] border-[#F5F4F1]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050807] border-[#F5F4F1]/20">
                    <SelectItem value="Trek">Trek</SelectItem>
                    <SelectItem value="Road Trip">Road Trip</SelectItem>
                    <SelectItem value="Weekend Escape">Weekend Escape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-[#F5F4F1]">Difficulty</Label>
                <Select value={trip.difficulty} onValueChange={(value) => handleSelectChange('difficulty', value)}>
                  <SelectTrigger className="bg-[#050807] border-[#F5F4F1]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050807] border-[#F5F4F1]/20">
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                    <SelectItem value="Extreme">Extreme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationDays" className="text-[#F5F4F1]">Duration (Days)</Label>
                <Input
                  id="durationDays"
                  type="number"
                  value={trip.durationDays}
                  onChange={(e) => setTrip({ ...trip, durationDays: parseInt(e.target.value) })}
                  className="bg-[#050807] border-[#F5F4F1]/20"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startingPrice" className="text-[#F5F4F1]">Starting Price (₹)</Label>
              <Input
                id="startingPrice"
                type="number"
                value={trip.startingPrice}
                onChange={(e) => setTrip({ ...trip, startingPrice: parseInt(e.target.value) })}
                className="bg-[#050807] border-[#F5F4F1]/20"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Identity Tags */}
        <Card className="bg-[#0a0c0f] border-[#F5F4F1]/10">
          <CardHeader>
            <CardTitle className="text-[#F5F4F1]">Identity Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="bg-[#050807] border-[#F5F4F1]/20"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                className="bg-[#CFAF6B] text-[#050807] hover:bg-[#CFAF6B]/90"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {trip.identityTags.map(tag => (
                <Badge
                  key={tag}
                  className="bg-[#CFAF6B]/20 text-[#CFAF6B] cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Publication Settings */}
        <Card className="bg-[#0a0c0f] border-[#F5F4F1]/10">
          <CardHeader>
            <CardTitle className="text-[#F5F4F1]">Publication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="text-[#F5F4F1]">Featured Trip</Label>
                <p className="text-xs text-[#F5F4F1]/60 mt-1">Show on homepage</p>
              </div>
              <Switch
                checked={trip.featured}
                onCheckedChange={(checked) => setTrip({ ...trip, featured: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[#F5F4F1]">Status</Label>
              <Select value={trip.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger className="bg-[#050807] border-[#F5F4F1]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#050807] border-[#F5F4F1]/20">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#CFAF6B] text-[#050807] hover:bg-[#CFAF6B]/90"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            onClick={() => router.back()}
            variant="outline"
            className="border-[#F5F4F1]/20 text-[#F5F4F1] hover:bg-[#F5F4F1]/10"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
