// src/blocks/Testimonials/Component.tsx

'use client'

import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from '@/components/AutoTextMarquee'
import React from 'react'

type Props = {
  heading?: string
  testimonials?: Array<{
    quote: string
    author: string
    location: string
    rating?: number
    variant?: 'black-white' | 'white-black'
  }>
  backgroundColor?: string
  autoplay?: boolean
  autoplaySpeed?: number
}

export const TestimonialBlock: React.FC<Props> = ({
  heading = 'WHAT OUR GUESTS SAID',
  testimonials = [],
  backgroundColor = 'black',
}) => {
  const renderStars = (rating: number = 5, variant: string = 'white-black') => {
    const activeColor = variant === 'black-white' ? 'text-yellow-400' : 'text-yellow-500'
    const inactiveColor = variant === 'black-white' ? 'text-gray-600' : 'text-gray-400'

    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? activeColor : inactiveColor}`}>
        ★
      </span>
    ))
  }

  if (!testimonials.length) return null

  const bgColor = backgroundColor === 'custom' ? 'bg-gray-900' : `bg-${backgroundColor}`

  return (
    <section className={`py-16 ${bgColor} text-white relative overflow-hidden`}>
      <div className="">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-wider">{heading}</h2>
        </div>

        {/* Testimonials Marquee */}
        <Marquee className="relative w-full">
          <MarqueeFade side="left" />
          <MarqueeFade side="right" />

          <MarqueeContent speed={30} pauseOnHover={true}>
            {testimonials.map((testimonial, index) => {
              const isBlackBg = testimonial.variant === 'black-white'
              const cardBg = isBlackBg ? 'bg-black' : 'bg-white'
              const textColor = isBlackBg ? 'text-white' : 'text-black'
              const locationColor = isBlackBg ? 'text-gray-300' : 'text-gray-700'

              return (
                <MarqueeItem key={index} className="">
                  <div
                    className={`p-6 w-80 transform -skew-x-19 transition-transform duration-300 border-2 border-white ${cardBg} ${textColor} w-[500px] px-12`}
                  >
                    <div className="flex flex-col gap-3">
                      <div>
                        {/* Stars */}
                        <div className="flex justify-start">
                          {renderStars(testimonial.rating, testimonial.variant)}
                        </div>

                        {/* Location */}
                        <div className="text-left">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${locationColor}`}
                          >
                            {testimonial.location}
                          </span>
                        </div>
                      </div>

                      {/* Quote */}
                      <p className="text-sm leading-relaxed italic text-left">
                        {testimonial.quote}
                      </p>

                      {/* Author */}
                      <div className="text-left">
                        <span className="text-sm font-semibold">- {testimonial.author}</span>
                      </div>
                    </div>
                  </div>
                </MarqueeItem>
              )
            })}
          </MarqueeContent>
        </Marquee>
      </div>
    </section>
  )
}
