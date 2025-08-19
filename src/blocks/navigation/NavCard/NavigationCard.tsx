import { Media } from '@/components/Media'
import type { Page } from '@/payload-types'
import Link from 'next/link'

// SOLUCIÓN CORRECTA: Manejar el tipo opcional y nullable
type NavCardBlockType = Extract<Page['layout'][number], { blockType: 'navCardBlock' }>

// Extraer el tipo del elemento del array cards, manejando que sea opcional y nullable
type CardType = NonNullable<NavCardBlockType['cards']>[number]

export const NavigationCard: React.FC<{
  card: CardType
  variant?: string
}> = ({ card, variant = 'default' }) => {
  if (!card) return null

  // Función simple para obtener la URL
  const getUrl = () => {
    if (!card.link) return null

    if (card.link.type === 'reference' && card.link.reference?.value) {
      // Manejar tanto string como objeto Page
      const pageValue = card.link.reference.value
      const slug = typeof pageValue === 'string' ? pageValue : pageValue?.slug

      if (!slug) return null

      // Como solo tienes 'pages' en relationTo, siempre será una página
      return `/${slug}`
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
            imgClassName="w-full h-full object-cover skew-x-[19deg]"
          />
        </div>
      )}

      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: (card.overlayOpacity || 60) / 100 }}
      />
      <div className="relative z-10 p-6 h-full flex flex-col gap-2 justify-end">
        {card.title && (
          <h3 className="text-4xl font-bold text-white uppercase skew-x-[19deg]">{card.title}</h3>
        )}
        {variant === 'default' && card.description && (
          <p className="text-gray-200 uppercase text-xl skew-x-[19deg]">{card.description}</p>
        )}
        {card.link?.label && (
          <p className="text-gray-200 uppercase text-xl skew-x-[19deg]">{card.link.label}</p>
        )}
      </div>
    </div>
  )

  // Si hay URL, envolver en Link
  if (url) {
    return (
      <Link
        href={url}
        target={card.link.reference?.relationTo !== 'pages' ? '_blank' : undefined}
        rel={card.link.reference?.relationTo !== 'pages' ? 'noopener noreferrer' : undefined}
        className="block"
      >
        {content}
      </Link>
    )
  }

  return content
}

// NavCardBlock component
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
            return (
              <NavigationCard key={card.id || index} card={card} variant={variant || 'default'} />
            )
          })}
        </div>
      </div>
    </section>
  )
}
