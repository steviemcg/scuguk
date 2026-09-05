import { EventAbstract } from '@/content.types';
import Link from 'next/link';
import React from 'react';
import styles from './EventListingPreviousItem.module.scss';

type EventListingPreviousItemProps = Omit<EventAbstract, 'date'> & {
  dateTimestamp: number;
};

const EventListingItem = ({ eventKey, title }: EventListingPreviousItemProps) => {
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
