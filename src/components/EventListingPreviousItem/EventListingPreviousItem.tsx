import { EventAbstract } from '@/content.types';
import Link from 'next/link';
import React from 'react';
import Button from '../Button';
import Container from '../Container';
import styles from './EventListingPreviousItem.module.scss';

type EventListingPreviousItemProps = Omit<EventAbstract, 'date'> & {
  dateTimestamp: number;
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);

  const dateAsString = date.toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'utc',
  });
  const timeAsString = date.toLocaleTimeString('en-gb', { hour: '2-digit', minute: '2-digit' });

  return `${dateAsString} - ${timeAsString}`;
};

const EventListingItem = ({
  eventKey,
  excerpt,
  dateTimestamp,
  venue,
  sponsors,
  title,
}: EventListingPreviousItemProps) => {
  const eventUrl = `/events/${eventKey}`;

  return (
    <div className={styles.eventListingItem}>
      <h3>
        <Link className={styles.eventListingItem__link} href={eventUrl}>
          {title}
        </Link>
      </h3>
    </div>
  );
};

export default EventListingItem;
