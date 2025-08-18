import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { MediaBlock } from '@/blocks/content/MediaBlock/Component'
import { MediaTextBlock } from '@/blocks/content/MediaTextBlock/Component'
import { TestimonialBlock } from '@/blocks/content/Testimonials/Component'
import { ArchiveBlock } from '@/blocks/core/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/core/CallToAction/Component'
import { ContentBlock } from '@/blocks/core/Content/Component'
import { FormBlock } from '@/blocks/core/Form/Component'
import { NavCardBlock } from '@/blocks/navigation/NavCard/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  navCardBlock: NavCardBlock,
  testimonials: TestimonialBlock,
  mediaTextBlock: MediaTextBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
