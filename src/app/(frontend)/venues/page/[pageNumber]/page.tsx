import type { Metadata } from 'next/types'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { VenueCollectionArchive } from '@/components/Venues/VenuesCollectionArchive'
import { RenderHero } from '@/heros/RenderHero'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache, unstable_ViewTransition as ViewTransition } from 'react'
import PageClient from './page.client'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const venues = await payload.find({
    collection: 'venues',
    depth: 1,
    limit: 10,
    page: sanitizedPageNumber,
    overrideAccess: false,
  })

  const { isEnabled: draft } = await draftMode()

  console.log('venues', venues)

  const page = await queryPageBySlug({
    slug: 'venues',
  })

  const { hero } = page

  return (
    <ViewTransition>
      <article>
        <PageClient />
        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={'/venues'} />

        {draft && <LivePreviewListener />}

        <RenderHero {...hero} />

        <VenueCollectionArchive venues={venues.docs} />
        <div className="container">
          {venues.totalPages > 1 && venues.page && (
            <Pagination page={venues.page} totalPages={venues.totalPages} relationTo="venues" />
          )}
        </div>
      </article>
      <div className="container mb-8">
        <PageRange
          collection="venues"
          currentPage={venues.page}
          limit={2}
          totalDocs={venues.totalDocs}
        />
      </div>
    </ViewTransition>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Payload Website Template Venues Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'venues',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
