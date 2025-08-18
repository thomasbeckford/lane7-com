// blocks/VenuesGrid.ts
import type { Block } from 'payload'

export const VenuesGrid: Block = {
  slug: 'venuesGrid',
  interfaceName: 'VenuesGridBlock',
  labels: {
    singular: 'Venues Grid',
    plural: 'Venues Grid',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Our Venues',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      defaultValue: 'Discover all our amazing venues across the UK and beyond.',
    },
    {
      name: 'displayMode',
      type: 'select',
      label: 'Display Mode',
      defaultValue: 'all',
      options: [
        {
          label: 'Show All Published Venues',
          value: 'all',
        },
        {
          label: 'Select Specific Venues',
          value: 'selected',
        },
      ],
    },
    {
      name: 'selectedVenues',
      type: 'relationship',
      relationTo: 'venues',
      hasMany: true,
      label: 'Select Venues',
      admin: {
        condition: (data, siblingData) => siblingData.displayMode === 'selected',
        description: 'Choose specific venues to display',
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
      name: 'showImages',
      type: 'checkbox',
      label: 'Show Venue Images',
      defaultValue: true,
    },
    {
      name: 'showDescription',
      type: 'checkbox',
      label: 'Show Venue Descriptions',
      defaultValue: true,
    },
    {
      name: 'showAddress',
      type: 'checkbox',
      label: 'Show Venue Address',
      defaultValue: true,
    },
    {
      name: 'showPhone',
      type: 'checkbox',
      label: 'Show Phone Number',
      defaultValue: false,
    },
    {
      name: 'showBookingButton',
      type: 'checkbox',
      label: 'Show Booking Button',
      defaultValue: true,
    },
  ],
}

export default VenuesGrid
