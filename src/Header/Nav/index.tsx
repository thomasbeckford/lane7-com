import { cn } from '@/utilities/ui'
import React from 'react'

import type { Header, Header as HeaderType, Venue } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import NearestLocations from '@/components/NearestLocation'
import { Button } from '@/components/ui/button'
import NavHamburger from '@/Header/Nav/NavHamburger'

export type NavHamburgerProps = {
  buttons: NonNullable<Header['buttons']>
  navItems: NonNullable<Header['navItems']>
}

export const HeaderNav: React.FC<{ data: HeaderType; venues: Venue[] }> = ({ data, venues }) => {
  const buttons = data?.buttons || ([] as NavHamburgerProps['buttons'])
  const navItems = data?.navItems || ([] as NavHamburgerProps['navItems'])
  const showNearestLocation = data?.showNearestLocation ?? true
  const nearestLocationConfig = data?.nearestLocationConfig

  // Render NearestLocation component with custom classes if configured
  const renderNearestLocation = () => {
    if (!showNearestLocation) return null

    return <NearestLocations venues={venues} />
  }

  // Render custom buttons with variants
  const renderButtons = () => {
    return buttons.map((button, index) => {
      const buttonProps = {
        variant: button.variant || 'default',
        size: button.size || 'default',
        className: cn(button.customClasses),
      }

      // If button has a link, wrap it with CMSLink
      if (button.link && (button.link.url || button.link.reference)) {
        return (
          <CMSLink key={`button-link-${index}`} {...button.link}>
            <Button {...buttonProps}>{button.text}</Button>
          </CMSLink>
        )
      }

      // If no link, render button without navigation
      return (
        <Button key={`button-${index}`} {...buttonProps}>
          {button.text}
        </Button>
      )
    })
  }

  return (
    <nav className="flex gap-3 items-center">
      {/* Render NearestLocation at start position */}
      {nearestLocationConfig?.position === 'start' && renderNearestLocation()}

      {/* Render NearestLocation at middle position */}
      {nearestLocationConfig?.position === 'middle' && renderNearestLocation()}

      {/* Render custom buttons - Hidden on mobile if there are nav items */}
      <div className={cn('flex gap-3 items-center', navItems.length > 0 && 'hidden md:flex')}>
        {renderButtons()}
      </div>

      {/* Render NearestLocation at end position (default) */}
      {(!nearestLocationConfig?.position || nearestLocationConfig?.position === 'end') &&
        renderNearestLocation()}

      {/* Hamburger Menu - Only show if there are nav items */}
      {navItems.length > 0 && <NavHamburger buttons={buttons} navItems={navItems} />}
    </nav>
  )
}
