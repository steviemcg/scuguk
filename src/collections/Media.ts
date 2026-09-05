import type { CollectionConfig } from 'payload';

/**
 * Speaker photos, sponsor logos and event images. Sizes are chosen to cover what the
 * current site actually renders: the round speaker portraits in EventAgenda, the sponsor
 * strip, and the 1126x569 event share image the Puppeteer script used to produce.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 200, height: 200, position: 'centre' },
      { name: 'portrait', width: 400, height: 400, position: 'centre' },
      { name: 'wide', width: 1200, height: 630, position: 'centre' },
    ],
    mimeTypes: ['image/*'],
    adminThumbnail: 'thumbnail',
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
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
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Alt text for accessibility. Required.' },
    },
  ],
};
