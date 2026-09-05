import type { CollectionConfig } from 'payload';

/**
 * Editors of the site — the people who run the user group. This is NOT the attendee
 * identity used for RSVPs; that still lives in Auth0 + the Azure SQL `Users` table
 * (decision D4 in docs/epics/payload-overhaul.md is open).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'createdAt'],
    group: 'Admin',
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [{ name: 'name', type: 'text' }],
};
