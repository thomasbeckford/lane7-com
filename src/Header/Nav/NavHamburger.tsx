'use client'

import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/utilities/ui'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { NavHamburgerProps } from './index'

export default function NavHamburger({ buttons, navItems }: NavHamburgerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Render navigation items for hamburger menu
  const renderNavItems = () => {
    return navItems.map((item, index) => (
      <div key={`nav-item-${index}`} className="py-2">
        {item.link && (item.link.url || item.link.reference) ? (
          <CMSLink
            {...item.link}
            className="block px-4 py-3 text-lg hover:bg-gray-100 rounded-md transition-colors"
          >
            {item.text}
          </CMSLink>
        ) : (
          <span className="block px-4 py-3 text-lg text-gray-500">{item.text}</span>
        )}

        {/* Render subitems if they exist */}
        {item.subItems && item.subItems.length > 0 && (
          <div className="ml-4 border-l border-gray-200">
            {item.subItems.map((subItem, subIndex) => (
              <div key={`sub-item-${subIndex}`} className="pl-4">
                {subItem.link && (subItem.link.url || subItem.link.reference) ? (
                  <CMSLink
                    {...subItem.link}
                    className="block px-4 py-2 text-base text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    {subItem.text}
                  </CMSLink>
                ) : (
                  <span className="block px-4 py-2 text-base text-gray-400">{subItem.text}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    ))
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Navegación</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col space-y-2">
          {/* Render navigation items */}
          {renderNavItems()}

          {/* Render buttons in hamburger menu if there are any */}
          {buttons?.length > 0 && (
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {buttons?.map((button, index) => {
                const buttonProps: any = {
                  variant: button.variant || 'default',
                  size: button.size || 'default',
                  className: cn(button.customClasses, 'w-full justify-start'),
                }

                if (button.link && (button.link.url || button.link.reference)) {
                  return (
                    <CMSLink key={`mobile-button-link-${index}`} {...button.link}>
                      <Button {...buttonProps}>{button.text}</Button>
                    </CMSLink>
                  )
                }

                return (
                  <Button
                    key={`mobile-button-${index}`}
                    {...buttonProps}
                    onClick={() => setIsOpen(false)}
                  >
                    {button.text}
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
