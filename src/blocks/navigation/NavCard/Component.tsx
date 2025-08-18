// NavCardBlock.tsx - NO need for 'use client'
import React from 'react'
import { NavigationCard } from './NavigationCard'
import type { NavigationCardsType } from './types'

export const NavCardBlock: React.FC<NavigationCardsType> = ({
  heading,
  subheading,
  cards = [],
  variant = 'default',
  gridColumns = 2,
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
            gridTemplateColumns: `repeat(${Math.min(gridColumns, cards.length)}, 1fr)`,
          }}
        >
          {cards.map((card, index) => (
            <NavigationCard key={card.id || index} card={card} variant={variant} />
          ))}
        </div>
      </div>
    </section>
  )
}
