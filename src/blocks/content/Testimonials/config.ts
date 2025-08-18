// src/blocks/Testimonials/config.ts

import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  imageURL: '/testimonialsBlock.png',
  labels: {
    singular: 'Testimonials',
    plural: 'Testimonials',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'WHAT OUR GUESTS SAID',
      admin: {
        description: 'Section heading',
      },
    },
    {
      name: 'testimonials',
      type: 'array',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Customer testimonial text',
          },
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          admin: {
            description: 'Customer name',
          },
        },
        {
          name: 'location',
          type: 'text',
          required: true,
          admin: {
            description: 'Review location (e.g., "REVIEW OF BIRMINGHAM")',
          },
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          defaultValue: 5,
          admin: {
            description: 'Star rating (1-5)',
          },
        },
        {
          name: 'variant',
          type: 'select',
          options: [
            {
              label: 'Black background, White text',
              value: 'black-white',
            },
            {
              label: 'White background, Black text',
              value: 'white-black',
            },
          ],
          defaultValue: 'white-black',
          admin: {
            description: 'Card color scheme',
          },
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      options: [
        {
          label: 'Black (Default)',
          value: 'black',
        },
        {
          label: 'Dark Gray',
          value: 'gray-900',
        },
        {
          label: 'Custom',
          value: 'custom',
        },
      ],
      defaultValue: 'black',
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Auto-scroll through testimonials',
      },
    },
    {
      name: 'autoplaySpeed',
      type: 'number',
      defaultValue: 5000,
      admin: {
        description: 'Time between slides (milliseconds)',
        condition: (_, siblingData) => siblingData?.autoplay,
      },
    },
  ],
}
