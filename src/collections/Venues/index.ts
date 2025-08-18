import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'

import { slugField } from '@/fields/slug'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Venues: CollectionConfig<'venues'> = {
  slug: 'venues',
  access: {
    // create: authenticated,
    // delete: authenticated,
    // read: authenticatedOrPublished, // Mejorado: usar el mismo sistema que Posts
    // update: authenticated,
    create: anyone,
    delete: anyone,
    read: anyone,
    update: anyone,
  },
  // Control de qué se populate por defecto cuando se referencia una venue
  defaultPopulate: {
    title: true,
    slug: true,
    hero_title: true,
    address: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'address', 'updatedAt'], // Mejorado: mostrar slug y updatedAt
    // Live preview para venues
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'venues',
          req,
        })
        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'venues',
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Venue Title',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Information',
          fields: [
            {
              name: 'hero_title',
              type: 'text',
              required: true,
              label: 'Hero Section Title',
            },
            {
              name: 'description',
              type: 'text',
              required: true,
              label: 'Venue Description',
            },
          ],
        },
        {
          label: 'Contact & Location',
          fields: [
            {
              name: 'address',
              type: 'text',
              label: 'Full Address',
            },
            {
              name: 'latitude',
              type: 'number',
              label: 'Latitude',
              admin: {
                description: 'GPS latitude coordinate (e.g., 51.5074)',
                step: 0.0000001,
              },
            },
            {
              name: 'longitude',
              type: 'number',
              label: 'Longitude',
              admin: {
                description: 'GPS longitude coordinate (e.g., -0.1278)',
                step: 0.0000001,
              },
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Phone Number',
            },
            {
              name: 'email',
              type: 'email',
              label: 'Contact Email',
            },
            {
              name: 'booking_url',
              type: 'text',
              label: 'Booking URL',
            },
            {
              name: 'menu_url',
              type: 'text',
              label: 'Menu URL',
            },
            {
              name: 'opening_hours',
              type: 'text',
              label: 'Opening Hours',
              admin: {
                description:
                  'Example: Monday - Thursday: 11am - 12am | Friday - Saturday: 11am - 1am',
              },
            },
          ],
        },

        {
          label: 'Media',
          fields: [
            {
              name: 'images',
              type: 'array',
              label: 'Venue Images',
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  options: [
                    {
                      label: 'Hero Logo',
                      value: 'hero_logo',
                    },
                    {
                      label: 'Hero Image',
                      value: 'hero_image',
                    },
                    {
                      label: 'Find Us Map',
                      value: 'find_us',
                    },
                    {
                      label: 'Gallery',
                      value: 'gallery',
                    },
                  ],
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'alt',
                  type: 'text',
                  label: 'Alt Text',
                  admin: {
                    description: 'Alternative text for accessibility',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Relationships',
          fields: [
            {
              name: 'relatedVenues',
              type: 'relationship',
              label: 'Related Venues',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'venues',
            },
            // Si tienes categorías de venues en el futuro
            // {
            //   name: 'venueTypes',
            //   type: 'relationship',
            //   admin: {
            //     position: 'sidebar',
            //   },
            //   hasMany: true,
            //   relationTo: 'venue-types',
            // },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    // Campos en sidebar
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    ...slugField(),
  ],
  hooks: {
    // afterChange: [revalidateVenue], // Crear función similar a revalidatePost
    // afterDelete: [revalidateVenueDelete],
  },
  // Mejorado: sistema de drafts y versioning
  versions: {
    drafts: {
      autosave: {
        interval: 100, // Para live preview
      },
      schedulePublish: true, // Permite programar publicación
    },
    maxPerDoc: 50,
  },
  timestamps: true,
}
