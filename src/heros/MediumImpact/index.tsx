import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const MediumImpactHero: React.FC<Page['hero']> = ({
  links,
  backgroundImage,
  richText,
  heroExtraImage,
}) => {
  return (
    <div>
      {backgroundImage && typeof backgroundImage === 'object' && (
        <div
          className="relative"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%)',
            maskSize: 'cover',
            maskRepeat: 'no-repeat',
          }}
        >
          <Media
            className="w-full"
            imgClassName="max-h-[40vh] w-full object-cover"
            priority
            resource={backgroundImage}
          />

          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Contenido encima de la imagen */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-left px-8 pt-42">
            <div className="flex flex-row items-center justify-center gap-8 max-w-6xl w-full">
              {/* Columna de la heroImage - 50% del espacio */}
              <div className="flex-1 flex justify-center">
                {heroExtraImage && typeof heroExtraImage === 'object' && (
                  <Media
                    priority
                    resource={heroExtraImage}
                    imgClassName="max-h-[30vh] w-auto object-contain"
                    className="w-full flex justify-center"
                  />
                )}
              </div>

              {/* Columna del contenido - 50% del espacio */}
              <div
                className={`${heroExtraImage ? 'flex-1' : 'flex-2'} flex flex-col items-center justify-center space-y-6`}
              >
                {richText && (
                  <div className="w-full">
                    <RichText className="text-white" data={richText} enableGutter={false} />
                  </div>
                )}

                {Array.isArray(links) && links.length > 0 && (
                  <ul className="flex gap-4 flex-wrap justify-center">
                    {links.map(({ link }, i) => {
                      return (
                        <li key={i}>
                          <CMSLink {...link} />
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* Caption de la imagen de fondo */}
            {backgroundImage?.caption && (
              <div className="mt-8 max-w-4xl">
                <RichText
                  data={backgroundImage.caption}
                  enableGutter={false}
                  className="text-white text-sm"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
