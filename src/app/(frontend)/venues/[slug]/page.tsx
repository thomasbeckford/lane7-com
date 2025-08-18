import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { VenueHero } from '@/heros/VenueHero'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'
import { cache, unstable_ViewTransition as ViewTransition } from 'react'
import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const venues = await payload.find({
    collection: 'venues',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: {
        exists: true,
        not_equals: '',
      },
    },
    select: {
      slug: true,
    },
  })

  const params = venues.docs
    .filter(({ slug }) => {
      const isValid = slug && typeof slug === 'string' && slug.trim().length > 0
      if (!isValid) {
        console.warn('⚠️  Venue con slug inválido filtrado:', { slug })
      }
      return isValid
    })
    .map(({ slug }) => {
      return { slug }
    })

  console.log(
    `📊 generateStaticParams: ${params.length} rutas válidas de ${venues.docs.length} venues`,
  )

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Venue({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/venues/' + slug
  const venue = await queryVenueBySlug({ slug })

  if (!venue) return <PayloadRedirects url={url} />

  return (
    <ViewTransition name={venue.title}>
      <article>
        <PageClient />

        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={url} />

        {draft && <LivePreviewListener />}
        <VenueHero venue={venue} />

        <div className="flex flex-col items-center gap-4 pt-8">
          <div className="container">
            <div>{venue.description}</div>

            {/* Nuevo: Sección de contacto e información */}
            {(venue.address || venue.opening_hours) && (
              <div className="mt-16 max-w-[48rem] mx-auto">
                <h2 className="text-2xl font-bold mb-6">Venue Information</h2>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Información de contacto */}
                  {venue.phone && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Contact</h3>
                      {venue.phone && (
                        <p>
                          <strong>Phone:</strong>{' '}
                          <Link
                            href={`tel:${venue.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {venue.phone}
                          </Link>
                        </p>
                      )}
                      {venue.email && (
                        <p>
                          <strong>Email:</strong>{' '}
                          <Link
                            href={`mailto:${venue.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {venue.email}
                          </Link>
                        </p>
                      )}
                      {venue.booking_url && (
                        <p>
                          <Link
                            href={venue.booking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                          >
                            Book Now
                          </Link>
                        </p>
                      )}
                      {venue.menu_url && (
                        <p>
                          <Link
                            href={venue.menu_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Menu
                          </Link>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Información de ubicación y horarios */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Location & Hours</h3>
                    {venue.address && (
                      <p>
                        <strong>Address:</strong>
                        <br />
                        {venue.address}
                      </p>
                    )}
                    {venue.opening_hours && (
                      <p>
                        <strong>Opening Hours:</strong>
                        <br />
                        {venue.opening_hours}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </ViewTransition>
  )
}

const queryVenueBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'venues',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
