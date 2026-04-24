'use client'

import { useState } from 'react'
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
import type { Trip, TripRegion, TripDifficulty, TripType } from '@/lib/trips/types'

export default function NewTripPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<Partial<Trip>>({
    title: '',
    descriptor: '',
    realityNote: '',
    region: 'Karnataka',
    destination: '',
    type: 'Trek',
    identityTags: [],
    durationDays: 2,
    durationLabel: '2 Days',
    difficulty: 'Moderate',
    season: [],
    startingPoint: '',
    startingPrice: 0,
    nextDeparture: '',
    image: '',
    featured: false,
    status: 'draft',
    highlights: [],
  })

  const [newTag, setNewTag] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddTag = () => {
    if (newTag && formData.identityTags && !formData.identityTags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        identityTags: [...(prev.identityTags || []), newTag]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      identityTags: (prev.identityTags || []).filter(t => t !== tag)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Call API to create trip in database
      toast.success('Trip created successfully!')
      router.push('/admin/trips')
    } catch (error) {
      toast.error('Failed to create trip')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold text-[#F5F4F1]">Create New Trip</h1>
        <p className="text-[#F5F4F1]/60 mt-2">Add a new trip to Trek & Stay</p>
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
                  placeholder="e.g., Kudremukh Trek"
                  value={formData.title || ''}
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
                  placeholder="e.g., Kudremukh, Karnataka"
                  value={formData.destination || ''}
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
                placeholder="One line emotional hook"
                value={formData.descriptor || ''}
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
                placeholder="Be honest about what to expect"
                value={formData.realityNote || ''}
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
                <Select value={formData.region || ''} onValueChange={(value) => handleSelectChange('region', value)}>
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
                <Select value={formData.type || ''} onValueChange={(value) => handleSelectChange('type', value)}>
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
                <Select value={formData.difficulty || ''} onValueChange={(value) => handleSelectChange('difficulty', value)}>
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
                  name="durationDays"
                  type="number"
                  value={formData.durationDays || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationDays: parseInt(e.target.value) }))}
                  className="bg-[#050807] border-[#F5F4F1]/20"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startingPrice" className="text-[#F5F4F1]">Starting Price (₹)</Label>
              <Input
                id="startingPrice"
                name="startingPrice"
                type="number"
                value={formData.startingPrice || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, startingPrice: parseInt(e.target.value) }))}
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
                placeholder="Add tag (e.g., Solo Traveler, Adventure Seeker)"
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
              {(formData.identityTags || []).map(tag => (
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
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#F5F4F1]">Featured Trip</Label>
                <p className="text-xs text-[#F5F4F1]/60 mt-1">Show on homepage</p>
              </div>
              <Switch
                checked={formData.featured || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
              />
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
            {loading ? 'Creating...' : 'Create Trip'}
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
