import type { CollectionConfig } from 'payload';

/**
 * The cities the group meets in. Today this is a bare string on each event
 * (`location: London`) that the page lowercases into an image path — which is why
 * "Online", used by 3 events, silently has no image: `src/data/locations/online.jpg`
 * does not exist. Making it a collection lets a location carry its own image, or
 * legitimately have none.
 */
export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'image'],
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
      unique: true,
      admin: { description: 'As shown on the event page, e.g. "London", "Online".' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Backdrop for the event advert. Optional — "Online" has never had one, and the page copes.',
      },
    },
  ],
};
