import type { CollectionConfig } from 'payload';

import { agendaBlocks } from '../blocks/agenda';
import { syncSponsorDates } from '../hooks/syncSponsorDates';

/**
 * An event. This is the collection the whole epic exists for: today an event is defined
 * twice — a YAML file in git and a row in Azure SQL joined only by a GUID somebody pastes
 * between them — and 3 of the 21 have already drifted apart on the date. Here it is
 * defined once.
 *
 * The RSVP half (capacity, attendees, waitlist) is NOT modelled yet; that is plan 4, and it
 * needs the SQL data. `legacyEventId` is the join that will make that migration possible.
 */
export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'location', 'dateConfirmed'],
    group: 'Content',
    description: 'One per meet-up. The slug is the URL: /events/<slug>.',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [syncSponsorDates],
  },
  defaultSort: '-date',
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
        description: 'The URL segment. Changing it breaks existing links — add a redirect.',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Start time, UK local. This alone decides whether the event is upcoming.',
      },
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
      defaultValue: 150,
      admin: { position: 'sidebar', description: 'Minutes. Used for the calendar links.' },
    },
    {
      name: 'dateConfirmed',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'talksTbc',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Shows the "not all talks are scheduled, get in touch" note.',
      },
    },
    {
      name: 'showOnlineRsvp',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Offer an "attending online" RSVP option.' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: { description: 'One paragraph, used on listings and as the share description.' },
    },
    {
      name: 'intro',
      type: 'richText',
      admin: {
        description: 'The body of the event page. Imported from the YAML `intro`, which was raw HTML.',
      },
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      required: true,
    },
    {
      name: 'venue',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'address',
          type: 'text',
          admin: { description: 'Blank for online events.' },
        },
      ],
    },
    {
      name: 'sponsors',
      type: 'relationship',
      relationTo: 'sponsors',
      hasMany: true,
      admin: { description: 'Saving the event updates each sponsor’s "last sponsored" date.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional in-page image. 5 of the imported events have one.' },
    },
    {
      name: 'showEventImage',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Uncheck to keep the image out of the page body.' },
    },
    {
      name: 'agenda',
      type: 'blocks',
      blocks: agendaBlocks,
      admin: { description: 'The running order, in order.' },
    },
    {
      name: 'meta',
      type: 'group',
      admin: { description: 'Search and social. Falls back to the title and excerpt.' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'legacyEventId',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description:
          'The GUID of the matching row in the old Azure SQL Events table. Kept only so plan 4 can attach the existing RSVPs to the right event; delete the field once that has run.',
      },
    },
  ],
};
