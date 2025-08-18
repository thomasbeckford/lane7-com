// src/blocks/ImageTextSplit/config.ts

import type { Block } from 'payload'

export const MediaTextBlock: Block = {
  slug: 'mediaTextBlock',
  imageURL: '/mediaTextBlock1.png',

  labels: {
    singular: 'Media Text Block',
    plural: 'Media Text Blocks',
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      options: [
        {
          label: 'Image Left, Text Right',
          value: 'image-left',
        },
        {
          label: 'Text Left, Image Right',
          value: 'text-left',
        },
      ],
      defaultValue: 'text-left',
      admin: {
        description: 'Choose the layout arrangement',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Image for the split section',
      },
    },
    {
      name: 'imageAspect',
      type: 'select',
      options: [
        {
          label: 'Square (1:1)',
          value: 'square',
        },
        {
          label: 'Landscape (16:9)',
          value: 'landscape',
        },
        {
          label: 'Portrait (3:4)',
          value: 'portrait',
        },
        {
          label: 'Auto (original)',
          value: 'auto',
        },
      ],
      defaultValue: 'auto',
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small text above heading (optional)',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Main heading text',
      },
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'Rich text content',
      },
    },
    {
      name: 'buttons',
      type: 'array',
      maxRows: 2,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'style',
          type: 'select',
          options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'].map(
            (variant) => ({
              label: variant,
              value: variant,
            }),
          ),
          defaultValue: 'default',
        },
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
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      options: [
        {
          label: 'White',
          value: 'white',
        },
        {
          label: 'Light Gray',
          value: 'gray-50',
        },
        {
          label: 'Dark Gray',
          value: 'gray-900',
        },
        {
          label: 'Black',
          value: 'black',
        },
      ],
      defaultValue: 'white',
    },
    {
      name: 'textColor',
      type: 'select',
      options: [
        {
          label: 'Auto (based on background)',
          value: 'auto',
        },
        {
          label: 'White',
          value: 'white',
        },
        {
          label: 'Black',
          value: 'black',
        },
      ],
      defaultValue: 'auto',
    },
    {
      name: 'verticalAlignment',
      type: 'select',
      options: [
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Top',
          value: 'start',
        },
        {
          label: 'Bottom',
          value: 'end',
        },
      ],
      defaultValue: 'center',
    },
  ],
}
