// src/blocks/NavigationCards/types.ts

export interface NavigationCardsType {
  heading?: string
  subheading?: string
  variant?: 'default' | 'banner'
  gridColumns?: number
  container?: boolean
  cards?: Array<{
    title: string
    description?: string // ← Hacer opcional para banner
    image?: any // o el tipo específico de tu Media
    link?: {
      type?: 'custom' | 'reference'
      reference?: any
      url?: string
      label?: string
    }
    overlayOpacity?: number
    id?: string
  }>
}

// Export for use in block components map
export { NavCardBlock } from './Component'
