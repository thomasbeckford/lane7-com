import type { Metadata } from 'next/types'

import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { VenueCollectionArchive } from '@/components/Venues/VenuesCollectionArchive'
import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
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

  return (
    <div>
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <Link href="/venues">
            <h1>Venues Page {pageNumber}</h1>
          </Link>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="venues"
          currentPage={venues.page}
          limit={2}
          totalDocs={venues.totalDocs}
        />
      </div>

      <VenueCollectionArchive venues={venues.docs} />

      <div className="container">
        {venues?.page && venues?.totalPages > 1 && (
          <Pagination page={venues.page} totalPages={venues.totalPages} relationTo="venues" />
        )}
      </div>
    </div>
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
