import { Media as MediaResource } from '@/payload-types'

export interface NavigationCardsType {
  heading?: string
  subheading?: string
  variant?: 'default' | 'banner'
  gridColumns?: number
  container?: boolean
  cards?: Array<{
    title: string
    description?: string // ← Hacer opcional para banner
    image?: MediaResource

    link?: {
      type?: 'custom' | 'reference'
      reference?: { value: { slug: string; relationTo: string }; relationTo: string }
      url?: string
      label?: string
    }
    overlayOpacity?: number
    id?: string
  }>
}

// Export for use in block components map
export { NavCardBlock } from './Component'
