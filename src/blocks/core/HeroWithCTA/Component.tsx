// src/blocks/HeroWithCTA/Component.tsx

'use client'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import React, { useState } from 'react'

type Props = {
  variant?: 'basic' | 'newsletter' | 'promo'
  backgroundImage?: any
  overlayOpacity?: number
  eyebrow?: string
  heading?: string
  subheading?: string
  primaryButton?: {
    text: string
    type: 'reference' | 'custom'
    reference?: any
    url?: string
  }
  secondaryButton?: {
    text?: string
    type?: 'reference' | 'custom'
    reference?: any
    url?: string
  }
  newsletterSettings?: {
    placeholderText?: string
    buttonText?: string
  }
  promoSettings?: {
    promoText?: string
    disclaimer?: string
  }
  textAlignment?: 'center' | 'left' | 'right'
  verticalPosition?: 'center' | 'top' | 'bottom'
}

export const HeroWithCTA: React.FC<Props> = ({
  variant = 'basic',
  backgroundImage,
  overlayOpacity = 50,
  eyebrow,
  heading,
  subheading,
  primaryButton,
  secondaryButton,
  newsletterSettings,
  promoSettings,
  textAlignment = 'center',
  verticalPosition = 'center',
}) => {
  const [email, setEmail] = useState('')

  const getAlignmentClasses = () => {
    switch (textAlignment) {
      case 'left':
        return 'text-left items-start justify-self-start'
      case 'right':
        return 'text-right items-end justify-self-end'
      default:
        return 'text-center items-center justify-self-center'
    }
  }

  const getVerticalClasses = () => {
    switch (verticalPosition) {
      case 'top':
        return 'justify-start pt-20 '
      case 'bottom':
        return 'justify-end pb-20'
      default:
        return 'justify-center'
    }
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter submission
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <section className="relative h-[20vh] md:h-[30vh] overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <Media
            resource={backgroundImage}
            className="w-full h-full"
            imgClassName="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }} />

      {/* Content */}
      <div
        className={`relative z-10 h-full flex flex-col px-8 text-white ${getVerticalClasses()} ${getAlignmentClasses()}`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Eyebrow */}
          {eyebrow && (
            <p className="text-sm md:text-base font-semibold tracking-wider uppercase mb-4 opacity-90">
              {eyebrow}
            </p>
          )}

          {/* Heading */}
          {heading && (
            <h1
              className={`text-4xl md:text-6xl lg:text-7xl font-bold italic tracking-wide mb-6 ${getAlignmentClasses()} ${getVerticalClasses()}`}
            >
              {heading}
            </h1>
          )}

          {/* Subheading */}
          {subheading && (
            <p
              className={`text-lg md:text-xl mb-8 opacity-90 leading-relaxed max-w-2xl ${getAlignmentClasses()} ${getVerticalClasses()}`}
            >
              {subheading}
            </p>
          )}

          {/* Newsletter Form */}
          {variant === 'newsletter' && (
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletterSettings?.placeholderText || 'Enter your email'}
                className="flex-1 px-4 py-3 text-black rounded-none focus:outline-hidden focus:ring-2 focus:ring-white/50"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-black font-semibold tracking-wider uppercase hover:bg-gray-200 transition-colors"
              >
                {newsletterSettings?.buttonText || 'HELL YES'}
              </button>
            </form>
          )}

          {/* CTA Buttons */}
          {variant !== 'newsletter' && (
            <div
              className={`flex flex-col sm:flex-row gap-4 ${getAlignmentClasses()} ${getVerticalClasses()}`}
            >
              {/* Primary Button */}
              {primaryButton && (
                <CMSLink
                  {...primaryButton}
                  className="inline-block bg-white text-black px-8 py-3 font-semibold tracking-wider uppercase hover:bg-gray-200 transition-colors"
                >
                  {primaryButton.text}
                </CMSLink>
              )}

              {/* Secondary Button */}
              {secondaryButton?.text && (
                <CMSLink
                  {...secondaryButton}
                  className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 font-semibold tracking-wider uppercase hover:bg-white hover:text-black transition-colors"
                >
                  {secondaryButton.text}
                </CMSLink>
              )}
            </div>
          )}

          {/* Promo Additional Info */}
          {variant === 'promo' && promoSettings && (
            <div className="mt-8 space-y-2">
              {promoSettings.promoText && (
                <p className="text-sm opacity-80">{promoSettings.promoText}</p>
              )}
              {promoSettings.disclaimer && (
                <p className="text-xs opacity-60">{promoSettings.disclaimer}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
