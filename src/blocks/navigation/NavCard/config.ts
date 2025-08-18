// src/blocks/NavigationCards/config.ts

import type { Block } from 'payload'

export const NavCardBlock: Block = {
  slug: 'navCardBlock',
  labels: {
    singular: 'Navigation Cards',
    plural: 'Navigation Cards',
  },
  fields: [
    {
      name: 'variant',
      type: 'radio',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Banner', value: 'banner' },
      ],
      defaultValue: 'default',
      admin: { layout: 'horizontal' },
    },
    {
      name: 'heading',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional heading above the cards',
      },
    },
    {
      name: 'gridColumns',
      type: 'select',
      label: 'Grid Columns',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      name: 'subheading',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional subheading text',
      },
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Card title (e.g., "VENUES")',
          },
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          admin: {
            description: 'Card description text',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Background image for the card',
          },
        },
        {
          name: 'link',
          type: 'group',
          fields: [
            {
              name: 'type',
              type: 'radio',
              options: [
                {
                  label: 'Internal Link',
                  value: 'reference',
                },
                {
                  label: 'Custom URL',
                  value: 'custom',
                },
              ],
              defaultValue: 'custom',
              admin: {
                layout: 'horizontal',
              },
            },
            {
              name: 'reference',
              type: 'relationship',
              relationTo: ['pages'],
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'reference',
              },
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'custom',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'Button text (e.g., "FIND US")',
              },
            },
          ],
        },
        {
          name: 'overlayOpacity',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 60,
          admin: {
            description: 'Dark overlay opacity (0-100%)',
          },
        },
      ],
    },
  ],
}
