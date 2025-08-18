// src/blocks/HeroWithCTA/config.ts

import type { Block } from 'payload'

export const HeroWithCTA: Block = {
  slug: 'heroWithCTA',
  labels: {
    singular: 'Hero with CTA',
    plural: 'Hero with CTA',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      options: [
        {
          label: 'Basic CTA',
          value: 'basic',
        },
        {
          label: 'Newsletter Signup',
          value: 'newsletter',
        },
        {
          label: 'Promotional',
          value: 'promo',
        },
      ],
      defaultValue: 'basic',
      admin: {
        description: 'Type of hero section',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Background image for the hero',
      },
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 50,
      admin: {
        description: 'Dark overlay opacity (0-100%)',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small text above main heading (e.g., "GO ALL IN")',
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
      name: 'subheading',
      type: 'textarea',
      admin: {
        description: 'Description text below heading',
      },
    },
    {
      name: 'primaryButton',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          defaultValue: 'LEARN MORE',
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
      name: 'secondaryButton',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.variant !== 'newsletter',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
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
      name: 'newsletterSettings',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'newsletter',
      },
      fields: [
        {
          name: 'placeholderText',
          type: 'text',
          defaultValue: 'Enter your email',
        },
        {
          name: 'buttonText',
          type: 'text',
          defaultValue: 'HELL YES',
        },
      ],
    },
    {
      name: 'promoSettings',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'promo',
      },
      fields: [
        {
          name: 'promoText',
          type: 'text',
          admin: {
            description: 'Additional promotional text (e.g., "Available Sunday - Friday")',
          },
        },
        {
          name: 'disclaimer',
          type: 'text',
          admin: {
            description: 'Small disclaimer text',
          },
        },
      ],
    },
    {
      name: 'textAlignment',
      type: 'select',
      options: [
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      defaultValue: 'center',
    },
    {
      name: 'verticalPosition',
      type: 'select',
      options: [
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Top',
          value: 'top',
        },
        {
          label: 'Bottom',
          value: 'bottom',
        },
      ],
      defaultValue: 'center',
    },
  ],
}
