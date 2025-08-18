// Componente simplificado
'use client'
import { Button } from '@/components/ui/button'
import type { Venue } from '@/payload-types'
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import { useNearestLocations } from './useNearestLocations'

interface NearestLocationProps {
  venues: Venue[]
}

export default function NearestLocation({ venues }: NearestLocationProps) {
  const { nearestVenue, loading, error } = useNearestLocations(venues)

  if (loading) {
    return <div>Buscando ubicación...</div>
  }

  if (error || !nearestVenue) {
    return <div>No se pudo encontrar venues cercanos</div>
  }

  return (
    <Link href={`/venues/${nearestVenue.slug}`}>
      <Button className="flex gap-2">
        <MapPin className="w-4 h-4" />
        <span>{nearestVenue.title}</span>
        <span className="text-sm text-gray-500">({nearestVenue.formattedDistance})</span>
      </Button>
    </Link>
  )
}
