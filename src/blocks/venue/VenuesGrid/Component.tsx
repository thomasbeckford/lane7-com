'use server'

import { NavCardBlock } from '@/blocks/navigation/NavCard/Component'
import { calculateDistance } from '@/components/NearestLocation/distance'
import { getUserLocation } from '@/server/getUserLocation'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

interface Venue {
  id: string
  title: string
  slug: string
  hero_title: string
  description: string
  address: string
  phone: string
  booking_url: string
  images: Array<{
    type: string
    image: {
      url: string
      alt: string
    }
  }>
}

interface VenuesGridProps {
  heading?: string
  description?: string
  gridColumns?: number
}

async function fetchVenues() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const userLocation = await getUserLocation()

  const coords = {
    lat: userLocation?.latitude || 0,
    lng: userLocation?.longitude || 0,
  }

  const result = await payload.find({
    collection: 'venues',
    draft,
    limit: 0,
    pagination: false,
    overrideAccess: draft,
    depth: 2,
  })

  if (!userLocation || !result.docs?.[0]) {
    return result.docs?.[0]
  }

  const sortedByNearest = result.docs?.sort((a, b) => {
    const distanceA = calculateDistance(coords, {
      lat: a.latitude || 0,
      lng: a.longitude || 0,
    })
    const distanceB = calculateDistance(coords, {
      lat: b.latitude || 0,
      lng: b.longitude || 0,
    })
    return distanceA - distanceB
  })

  return sortedByNearest
}

export async function VenuesGridBlock({
  heading = 'Our Venues',
  description = '',
  gridColumns = 3,
}: VenuesGridProps) {
  const venues = (await fetchVenues()) as unknown as Venue[]

  return (
    <>
      {venues.length > 0 && (
        <NavCardBlock
          cards={venues.map((venue) => ({
            title: venue.title,
            description: venue.description,
            image: venue.images?.find((img) => img.type === 'hero_image')?.image.url,
            link: {
              type: 'custom' as const,
              url: `/venues/${venue.slug}`,
              label: 'Learn More',
            },
          }))}
          container={false}
          gridColumns={gridColumns}
          variant="banner"
          heading={heading}
          subheading={description}
        />
      )}
    </>
  )
}
