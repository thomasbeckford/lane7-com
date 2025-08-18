import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Logo image. If not provided, default Logo component will be used.',
          },
        },
        {
          name: 'alt',
          type: 'text',
          required: false,
          admin: {
            condition: (data) => Boolean(data?.logo?.image),
          },
        },
        {
          name: 'width',
          type: 'number',
          required: false,
          defaultValue: 150,
          admin: {
            condition: (data) => Boolean(data?.logo?.image),
            description: 'Logo width in pixels',
          },
        },
        {
          name: 'height',
          type: 'number',
          required: false,
          defaultValue: 50,
          admin: {
            condition: (data) => Boolean(data?.logo?.image),
            description: 'Logo height in pixels',
          },
        },
      ],
      admin: {
        description: 'Configure the header logo',
      },
    },

    {
      name: 'topMarquee',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },

    // ⭐ NUEVO: Campo para elementos de navegación del menú hamburguesa
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Items',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Text',
          required: true,
        },
        link({
          appearances: false,
          disableLabel: false,
          overrides: {
            name: 'link',
            admin: {
              description: 'Navigation item destination',
            },
          },
        }),
        {
          name: 'subItems',
          type: 'array',
          label: 'Sub Items',
          maxRows: 10,
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Text',
              required: true,
            },
            link({
              appearances: false,
              disableLabel: false,
              overrides: {
                name: 'link',
                admin: {
                  description: 'Sub-item destination',
                },
              },
            }),
          ],
          admin: {
            description: 'Optional sub-navigation items',
            initCollapsed: true,
          },
        },
      ],
      maxRows: 10,
      admin: {
        description: 'Navigation items for the hamburger menu',
        initCollapsed: true,
      },
    },
    {
      name: 'buttons',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'variant',
          type: 'select',
          required: true,
          defaultValue: 'lane7-primary',
          options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'].map(
            (variant) => ({
              label: variant,
              value: variant,
            }),
          ),
        },
        {
          name: 'size',
          type: 'select',
          required: false,
          defaultValue: 'default',
          options: [
            {
              label: 'Default',
              value: 'default',
            },
            {
              label: 'Small',
              value: 'sm',
            },
            {
              label: 'Large',
              value: 'lg',
            },
            {
              label: 'Icon',
              value: 'icon',
            },
          ],
        },
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            name: 'link',
            admin: {
              description: 'Button destination',
            },
          },
        }),
        {
          name: 'customClasses',
          type: 'text',
          required: false,
          admin: {
            description: 'Additional CSS classes (optional)',
          },
        },
      ],
      maxRows: 5,
      admin: {
        description: 'Configure header buttons with shadcn/ui variants',
        initCollapsed: true,
      },
    },
    {
      name: 'showNearestLocation',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show the NearestLocation component in the header',
      },
    },
    {
      name: 'nearestLocationConfig',
      type: 'group',
      fields: [
        {
          name: 'position',
          type: 'select',
          required: false,
          defaultValue: 'end',
          options: [
            {
              label: 'At the beginning',
              value: 'start',
            },
            {
              label: 'After nav items',
              value: 'middle',
            },
            {
              label: 'At the end',
              value: 'end',
            },
          ],
        },
      ],
      admin: {
        condition: (data) => Boolean(data?.showNearestLocation),
        description: 'Configure NearestLocation component settings',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
