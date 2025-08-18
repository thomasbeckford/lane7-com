'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import type { Post, Venue } from '@/payload-types'
import { unstable_ViewTransition as ViewTransition } from 'react'

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
    <ViewTransition name={doc?.slug || 'auto'}>
      <article
        className={cn(
          'border-card hover:cursor-pointer min-h-[250px] h-full hover:translate-x-[4px] hover:translate-y-[-4px] transition-all duration-300',
          className,
        )}
        ref={card.ref}
      >
        <div className="relative h-full w-full skew-x-[-19deg] border border-secondary overflow-hidden">
          {!cardImage && <div className="h-full w-full" />}
          {cardImage && typeof cardImage !== 'string' && (
            <div className="absolute inset-0">
              <Media
                resource={cardImage}
                size="33vw"
                className="h-full w-full object-cover skew-x-[19deg] scale-125 "
              />
            </div>
          )}

          <div className="p-4 absolute bottom-0 left-0 right-0">
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
        </div>
      </article>
    </ViewTransition>
  )
}
