import type { Metadata } from 'next/types'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { VenueCollectionArchive } from '@/components/Venues/VenuesCollectionArchive'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache, unstable_ViewTransition as ViewTransition } from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page() {
  const payload = await getPayload({ config: configPromise })
  const { isEnabled: draft } = await draftMode()

  const venues = await payload.find({
    collection: 'venues',
    depth: 1,
    limit: 12,
    overrideAccess: false,
  })

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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}
