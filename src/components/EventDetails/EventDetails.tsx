import React from 'react';
import { EventContent } from '@/content.types';
import Markdown from 'markdown-to-jsx';
import styles from './EventDetails.module.scss';

type EventDetailsProps = Omit<EventContent, 'date'> & {
  dateTimestamp: number;
};

const markdownOptions = {
  forceBlock: true,
  overrides: {
    a: {
      props: {
        target: `_blank`,
      },
    },
  },
};

const EventDetails = ({ intro, excerpt, eventKey, showEventImage }: EventDetailsProps) => (
  <section className={styles.eventDetails}>
    {showEventImage && (
      <p>
        <img src={`/data/events/${eventKey}.jpg`} />
      </p>
    )}
    {intro ? <Markdown options={{ ...markdownOptions }}>{intro}</Markdown> : <p>{excerpt}</p>}
  </section>
);

export default EventDetails;
