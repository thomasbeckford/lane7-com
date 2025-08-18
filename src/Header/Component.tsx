import { Logo } from '@/components/Logo/Logo'
import { HeaderClient } from '@/Header/Component.client'
import type { Header, Venue } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import { HeaderNav } from './Nav'

async function fetchVenues(): Promise<Venue[]> {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'venues',
      where: {},
      limit: 100,
    })

    return result.docs as unknown as Venue[]
  } catch (error) {
    console.error('Error fetching venues:', error)
    return []
  }
}

export async function Header() {
  const headerData = (await getCachedGlobal('header', 1)()) as Header
  const venues = await fetchVenues()

  const renderLogo = () => {
    const logoData = headerData?.logo

    if (logoData?.image && typeof logoData.image === 'object') {
      const logoImage = logoData.image as any

      return (
        <Image
          src={logoImage.url || ''}
          alt={logoData.alt || 'Logo'}
          width={logoData.width || 150}
          height={logoData.height || 50}
          priority
          className="object-contain"
        />
      )
    }

    return <Logo loading="eager" priority="high" className="invert dark:invert-0" />
  }

  return (
    <header className="px-4 py-2 absolute top-0 z-20 flex items-center w-full justify-between bg-transparent">
      <HeaderClient />
      <Link href="/" className="shrink-0">
        {renderLogo()}
      </Link>

      <HeaderNav data={headerData} venues={venues} />
    </header>
  )
}
