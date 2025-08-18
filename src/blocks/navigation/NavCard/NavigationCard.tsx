import { Media } from '@/components/Media'
import Link from 'next/link'

// NavigationCard.tsx - Solo cambiar la interfaz
interface NavigationCardProps {
  card: {
    id?: string
    title: string
    description?: string
    image?: any
    overlayOpacity?: number
    link?: {
      type?: 'custom' | 'reference'
      reference?: any
      url?: string
      label?: string
      newTab?: boolean
    }
  }
  variant?: 'default' | 'banner'
}

export const NavigationCard: React.FC<NavigationCardProps> = ({ card, variant = 'default' }) => {
  // Función simple para obtener la URL
  const getUrl = () => {
    if (!card.link) return null

    if (card.link.type === 'reference' && card.link.reference?.value?.slug) {
      // Para pages usa la slug directamente
      if (card.link.reference.relationTo === 'pages') {
        return `/${card.link.reference.value.slug}`
      }
      // Para venues (u otras colecciones)
      if (card.link.reference.relationTo === 'venues') {
        return `/venues/${card.link.reference.value.slug}`
      }
    }

    if (card.link.type === 'custom' && card.link.url) {
      return card.link.url
    }

    return null
  }

  const url = getUrl()

  const content = (
    <div className="relative overflow-hidden skew-x-[-19deg] rounded-lg border-2 border-white/20 hover:border-white/40 h-64 hover:translate-x-[6px] hover:translate-y-[-6px] transition-all duration-300 group">
      {card.image && (
        <div className="absolute inset-0">
          <Media
            resource={card.image}
            className="w-full h-full scale-125"
            imgClassName="w-full h-full object-cover -skew-x-[-19deg]"
          />
        </div>
      )}

      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: (card.overlayOpacity || 60) / 100 }}
      />
      <div className="relative z-10 p-6 h-full flex flex-col justify-end">
        <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
        {variant === 'default' && card.description && (
          <p className="text-gray-200 text-sm">{card.description}</p>
        )}
      </div>
    </div>
  )

  console.log(url)
  // Si hay URL, envolver en Link
  if (url) {
    return (
      <Link
        href={url}
        target={card.link?.newTab ? '_blank' : undefined}
        rel={card.link?.newTab ? 'noopener noreferrer' : undefined}
        className="block"
      >
        {content}
      </Link>
    )
  }

  return content
}
