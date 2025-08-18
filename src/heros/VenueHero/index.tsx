'use client'

import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import type { Venue } from '@/payload-types'
import { motion } from 'motion/react'
import Link from 'next/link'
import React, { unstable_ViewTransition as ViewTransition } from 'react'

export const VenueHero: React.FC<{
  venue: Venue
}> = ({ venue }) => {
  const { title, hero_title, address, opening_hours, images, slug } = venue

  // Buscar la imagen hero
  const heroImage = images?.find(
    (img) => img.type === 'hero_image' && typeof img.image === 'object',
  )?.image

  // Buscar el logo hero
  const heroLogo = images?.find(
    (img) => img.type === 'hero_logo' && typeof img.image === 'object',
  )?.image

  return (
    <ViewTransition name={slug!}>
      <div className="relative flex items-center">
        <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
          <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
            {/* Logo si existe */}
            {heroLogo && typeof heroLogo === 'object' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2,
                  },
                }}
              >
                <Media
                  resource={heroLogo}
                  imgClassName="max-h-20 w-auto object-contain"
                  className="flex justify-start"
                />
              </motion.div>
            )}

            <div className="">
              <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{hero_title || title}</h1>
            </div>

            {/* Información del venue */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-16">
              {/* Dirección */}
              {address && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm uppercase tracking-wide">Location</p>
                  <p className="text-lg">{address}</p>
                </div>
              )}

              {/* Horarios */}
              {opening_hours && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm uppercase tracking-wide">Hours</p>
                  <p className="text-lg">{opening_hours}</p>
                </div>
              )}

              {/* Contacto principal */}
              {(venue?.phone || venue?.email) && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm uppercase tracking-wide">Contact</p>
                  <div className="space-y-1">
                    {venue?.phone && (
                      <p className="text-lg">
                        <Link
                          href={`tel:${venue.phone}`}
                          className="hover:text-blue-300 transition-colors"
                        >
                          {venue.phone}
                        </Link>
                      </p>
                    )}
                    {venue?.email && (
                      <p className="text-lg">
                        <Link
                          href={`mailto:${venue.email}`}
                          className="hover:text-blue-300 transition-colors"
                        >
                          {venue.email}
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Botones de acción */}
            {(venue?.booking_url || venue?.menu_url) && (
              <div className="flex flex-wrap gap-4 mt-8">
                {venue.booking_url && (
                  <Link href={venue.booking_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="default">Book Now</Button>
                  </Link>
                )}
                {venue.menu_url && (
                  <Link href={venue.menu_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">View Menu</Button>
                  </Link>
                )}

                <Link href="/venues" scroll>
                  <Button>Back to Venues</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Imagen de fondo */}

        <div className="min-h-[60vh] select-none opacity-50">
          <Media
            fill
            priority
            imgClassName="-z-10 object-cover"
            resource={heroImage}
            maskImage={true}
            size="100vw"
          />
        </div>
      </div>
    </ViewTransition>
  )
}
