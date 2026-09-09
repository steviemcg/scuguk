import type { Block } from 'payload';

/**
 * The running order of an event. In YAML this was a list of objects discriminated by a
 * `type` string — and one entry in `2025-11-remarkable-london-sitecore-usergroup.yml`
 * has `item: talk` where it meant `type: talk`. That renders correctly today only because
 * `EventAgenda.tsx:127` treats "anything that isn't item or tbd" as a talk. As Payload
 * blocks the discriminator is structural, so the typo has nowhere to live.
 */

const time: Block['fields'][number] = {
  name: 'time',
  type: 'text',
  required: true,
  admin: {
    width: '30%',
    description: '24-hour, e.g. 18:45. Free text — it is printed, never parsed.',
  },
};

/** A talk, with one or more speakers. 52 of the 109 imported agenda entries. */
export const TalkBlock: Block = {
  slug: 'talk',
  labels: { singular: 'Talk', plural: 'Talks' },
  fields: [
    {
      type: 'row',
      fields: [
        time,
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { width: '70%' },
        },
      ],
    },
    {
      name: 'speakers',
      type: 'relationship',
      relationTo: 'speakers',
      hasMany: true,
      admin: {
        description: 'The YAML had both a `speaker` and a `speakers` field; they are one list here.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description:
          'The YAML had a plain `description` and an HTML `descriptionHtml`, never both. Both import into this field.',
      },
    },
    {
      name: 'youtubeVideoId',
      type: 'text',
      admin: { description: 'Just the id, not the URL — the embed builds the rest.' },
    },
    {
      name: 'links',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      admin: { description: 'Slides, demos, blog posts. 8 imported entries have these.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'text', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'url', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
  ],
};

/** Arrival, food, a break, the close. 53 of the 109 imported entries. */
export const ScheduleItemBlock: Block = {
  slug: 'item',
  labels: { singular: 'Schedule item', plural: 'Schedule items' },
  fields: [
    {
      type: 'row',
      fields: [
        time,
        {
          name: 'description',
          type: 'text',
          required: true,
          admin: { width: '70%', description: 'e.g. "Arrival and networking".' },
        },
      ],
    },
  ],
};

/** A slot held open for a speaker who has not been confirmed. 3 imported entries. */
export const TbdTalkBlock: Block = {
  slug: 'tbd',
  labels: { singular: 'Talk to be confirmed', plural: 'Talks to be confirmed' },
  fields: [time],
};

export const agendaBlocks = [TalkBlock, ScheduleItemBlock, TbdTalkBlock];
