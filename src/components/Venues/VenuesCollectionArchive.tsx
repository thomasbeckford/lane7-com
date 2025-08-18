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
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {venues?.map((venue, index) => {
            if (typeof venue === 'object' && venue !== null) {
              return (
                <div className="col-span-4" key={index}>
                  <VenueCard className="h-full" doc={venue} />
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}
