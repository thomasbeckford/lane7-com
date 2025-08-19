// collections/Backups.ts
import { authenticated } from '@/access/authenticated'
import { CollectionConfig } from 'payload'

export const Backups: CollectionConfig = {
  slug: 'backups',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'date', 'size'],
    description: 'Gestión de backups de la base de datos',
  },
  access: {
    // Solo admins pueden ver/crear/editar backups
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Nombre descriptivo del backup',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        readOnly: true,
        description: 'Fecha y hora de creación',
      },
    },
    {
      name: 'filename',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        description: 'Nombre del archivo en el servidor',
      },
    },
    {
      name: 'size',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Tamaño del archivo en bytes',
      },
    },
  ],
}
