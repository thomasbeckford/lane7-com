// src/blocks/ImageTextSplit/Component.tsx

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import React from 'react'

type Props = {
  layout?: 'image-left' | 'text-left'
  image?: any
  imageAspect?: 'square' | 'landscape' | 'portrait' | 'auto'
  eyebrow?: string
  heading?: string
  content?: any
  buttons?: Array<{
    text: string
    style?: 'primary' | 'secondary' | 'link'
    type?: 'reference' | 'custom'
    reference?: any
    url?: string
  }>
  backgroundColor?: string
  textColor?: 'auto' | 'white' | 'black'
  verticalAlignment?: 'center' | 'start' | 'end'
}

export const MediaTextBlock: React.FC<Props> = ({
  layout = 'text-left',
  image,
  imageAspect = 'auto',
  eyebrow,
  heading,
  content,
  buttons = [],
  backgroundColor = 'white',
  textColor = 'auto',
  verticalAlignment = 'center',
}) => {
  // Determine text color automatically
  const getTextColor = () => {
    if (textColor !== 'auto') return textColor === 'white' ? 'text-white' : 'text-black'

    // Auto-determine based on background
    const darkBackgrounds = ['black', 'gray-900']
    return darkBackgrounds.includes(backgroundColor) ? 'text-white' : 'text-black'
  }

  // Get aspect ratio classes
  const getAspectClasses = () => {
    switch (imageAspect) {
      case 'square':
        return 'aspect-square'
      case 'landscape':
        return 'aspect-video'
      case 'portrait':
        return 'aspect-3/4'
      default:
        return ''
    }
  }

  // Get alignment classes
  const getAlignmentClasses = () => {
    switch (verticalAlignment) {
      case 'start':
        return 'items-start'
      case 'end':
        return 'items-end'
      default:
        return 'items-center'
    }
  }

  // Get button styles
  const getButtonClasses = (style: string) => {
    const isDark = backgroundColor === 'black' || backgroundColor === 'gray-900'

    switch (style) {
      case 'primary':
        return isDark
          ? 'bg-white text-black hover:bg-gray-200'
          : 'bg-black text-white hover:bg-gray-800'
      case 'secondary':
        return isDark
          ? 'border-2 border-white text-white hover:bg-white hover:text-black'
          : 'border-2 border-black text-black hover:bg-black hover:text-white'
      case 'link':
        return isDark
          ? 'text-white hover:text-gray-300 underline'
          : 'text-black hover:text-gray-600 underline'
      default:
        return getButtonClasses('primary')
    }
  }

  const textColorClass = getTextColor()
  const isImageLeft = layout === 'image-left'
  const bgClass = backgroundColor === 'white' ? 'bg-white' : `bg-${backgroundColor}`

  return (
    <section className={`py-16 md:py-24 ${bgClass} ${textColorClass}`}>
      <div className="container mx-auto px-4">
        <div className={`grid lg:grid-cols-2 gap-12 ${getAlignmentClasses()}`}>
          {/* Image Column */}
          <div className={`${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
            {image && (
              <div className={`relative overflow-hidden rounded-lg ${getAspectClasses()}`}>
                <Media
                  resource={image}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Text Column */}
          <div
            className={`flex flex-col justify-center ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}
          >
            {/* Eyebrow */}
            {eyebrow && (
              <p className="text-sm font-semibold tracking-wider uppercase mb-4 opacity-80">
                {eyebrow}
              </p>
            )}

            {/* Heading */}
            {heading && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {heading}
              </h2>
            )}

            {/* Content */}
            {content && (
              <div className="mb-8 prose prose-lg max-w-none">
                <RichText data={content} enableGutter={false} />
              </div>
            )}

            {/* Buttons */}
            {buttons.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                {buttons.map((button, index) => (
                  <CMSLink
                    key={index}
                    {...button}
                    className={`inline-block px-8 py-3 font-semibold tracking-wider uppercase transition-colors ${getButtonClasses(button.style || 'primary')} ${
                      button.style === 'link' ? 'px-0 py-0' : ''
                    }`}
                  >
                    {button.text}
                  </CMSLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
