import type { CollectionConfig } from 'payload';

/**
 * Companies that have given a venue, food or money.
 *
 * `lastSponsoredAt` orders the /sponsors page, newest first. In the YAML it was typed by
 * hand and had drifted on 3 of 14 — Sitecore's said 2024-11-14 against a real latest event
 * of 2026-09-24, so it was sorting almost two years too low. It is now maintained by the
 * `syncSponsorDates` hook on Events (`src/hooks/syncSponsorDates.ts`) instead of by a
 * person, which is why the field is read-only in the admin.
 */
export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'lastSponsoredAt', 'hideOnPage'],
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
      name: 'title',
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
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Usually an SVG.' },
    },
    {
      name: 'darkLogo',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Tick when the logo is dark and needs a light backing. One of the 14 imported sponsors sets this.',
      },
    },
    {
      name: 'website',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { description: 'One line, shown on the /sponsors page.' },
    },
    {
      name: 'hideOnPage',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Keep the sponsor on its events but leave it off the /sponsors listing.',
      },
    },
    {
      name: 'lastSponsoredAt',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description:
          'Maintained automatically from the events that name this sponsor. Seeded from the old YAML value for the four sponsors whose events predate this repo.',
      },
    },
  ],
};
