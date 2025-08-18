import { cn } from '@/utilities/ui'
import React from 'react'

import { VenueCard } from '@/components/Venues/VenueCard'
import type { Venue } from '@/payload-types'

export type Props = {
  venues?: Venue[]
}

export const VenueCollectionArchive: React.FC<Props> = (props) => {
  const { venues } = props

  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4">
        {venues?.map((venue, index) => {
          if (typeof venue === 'object' && venue !== null) {
            return (
              <div className="col-span-4  h-full" key={index}>
                <VenueCard doc={venue} />
              </div>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}
