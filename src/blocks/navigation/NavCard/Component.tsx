// NavCardBlock.tsx - NO need for 'use client'
import type { Page } from '@/payload-types'
import React from 'react'
import { NavigationCard } from './NavigationCard'

type NavCardType = Extract<Page['layout'][number], { blockType: 'navCardBlock' }>

export const NavCardBlock: React.FC<NavCardType> = ({
  heading,
  subheading,
  cards,
  variant,
  gridColumns = '2',
}) => {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        {heading && (
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold italic mb-4">{heading}</h2>
            {subheading && <p className="text-lg text-gray-300">{subheading}</p>}
          </div>
        )}

        {/* Grid */}
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${Math.min(parseInt(gridColumns || '2'), cards?.length || 0)}, 1fr)`,
          }}
        >
          {cards?.map((card, index) => {
            return <NavigationCard key={index} card={card} variant={variant || 'default'} />
          })}
        </div>
      </div>
    </section>
  )
}
