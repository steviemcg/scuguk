import type { CollectionConfig } from 'payload';

/**
 * One per person who has given a talk. `slug` carries over the YAML filename, because
 * that is what agenda entries referenced (`speaker: jeremydavis`) and what the importer
 * matches on. Nothing in the rendered site uses the slug — it can be renamed freely
 * once the import has run.
 */
export const Speakers: CollectionConfig = {
  slug: 'speakers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'title', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Was the YAML filename. Only the importer depends on it.',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Job title, e.g. "Solutions Architect".' },
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional. Two of the 35 imported speakers have no photo and the agenda falls back to a silhouette.',
      },
    },
  ],
};
