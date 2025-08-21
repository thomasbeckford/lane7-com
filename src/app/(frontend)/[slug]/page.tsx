import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'

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

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  const page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({
    slug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  const homePageHero = () => (
    <div className="w-full h-[56.25vw]">
      <iframe
        src="https://iframe.mediadelivery.net/embed/238498/45b037ff-b45d-48e4-8aef-959ea273fcbd?autoplay=true&loop=true&muted=false&preload=true&responsive=true"
        loading="lazy"
        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
        allowFullScreen
      ></iframe>
    </div>
  )

  console.log('slug', slug)

  return (
    <article>
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {slug === '' ? homePageHero() : <RenderHero {...hero} />}
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
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
