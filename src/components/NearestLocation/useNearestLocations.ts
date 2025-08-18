// Hook simplificado
import type { Venue } from '@/payload-types'
import { useMemo } from 'react'
import { calculateDistance } from './distance'
import { useGeolocation } from './useGeolocation'

export function useNearestLocations(venues: Venue[]) {
  const { location: userLocation, loading, error } = useGeolocation()

  const nearestVenue = useMemo(() => {
    // Si no hay ubicación del usuario o venues, retornar null
    if (!userLocation || !venues?.length) {
      return null
    }

    // Encontrar el venue más cercano
    let closest = null
    let shortestDistance = Infinity
    const allDistances = []

    for (const venue of venues) {
      // Verificar que el venue tenga coordenadas válidas
      if (!venue.latitude || !venue.longitude) {
        console.log(`❌ ${venue.title}: No tiene coordenadas`)
        continue
      }

      const distance = calculateDistance(
        userLocation, // {lat: number, lng: number}
        { lat: venue.latitude, lng: venue.longitude },
      )

      allDistances.push({
        name: venue.title,
        distance: distance.toFixed(1),
        coords: `${venue.latitude}, ${venue.longitude}`,
      })

      if (distance < shortestDistance) {
        shortestDistance = distance
        closest = {
          ...venue,
          distance,
          formattedDistance:
            distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`,
        }
      }
    }

    // Mostrar todas las distancias para debugging
    // console.table(allDistances.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)))

    return closest
  }, [userLocation, venues])

  return {
    nearestVenue,
    userLocation,
    loading,
    error,
  }
}
