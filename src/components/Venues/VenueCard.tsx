'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Post, Venue } from '@/payload-types'

import { Media } from '@/components/Media'

export interface CardPostData
  extends Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>,
    Pick<Venue, 'images'> {}

export const VenueCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: Venue
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, title: titleFromProps } = props

  const { slug, meta, title } = doc || {}
  const { image: metaImage } = meta || {}

  const titleToUse = titleFromProps || title
  const href = slug ? `/venues/${slug}` : '#'

  let cardImage = metaImage

  if (!metaImage) {
    cardImage = doc?.images?.find((image) => image.type === 'hero_image')?.image
  }

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full ">
        {!cardImage && <div className="">No image</div>}
        {cardImage && typeof cardImage !== 'string' && <Media resource={cardImage} size="33vw" />}
      </div>
      <div className="p-4">
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
      </div>
    </article>
  )
}
