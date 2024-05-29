import React from 'react';
import { EventContent } from '@/content.types';
import CalIcon from '../Icons/cal-icon.svg';
import ClockIcon from '../Icons/clock-icon.svg';
import MapIcon from '../Icons/map-icon.svg';
import styles from './EventInfo.module.scss';
import Link from 'next/link';
import { google, outlook, ics, CalendarEvent } from 'calendar-link';
import { formatDate } from '@/util/util';

type EventInfoProps = Omit<EventContent, 'date'> & {
  dateTimestamp: number;
};

const formatMapLink = (address: string): string =>
  `https://maps.apple.com/?address=${encodeURIComponent(address)},&t=m`;

const EventInfo = ({ dateTimestamp, title, duration, venue: { name, address } }: EventInfoProps) => {
  const date = new Date(dateTimestamp);
  const futureEvent = date > new Date();

  const event: CalendarEvent = {
    title: `Sitecore User Group - ${title}`,
    location: address,
    start: date.toISOString(),
    duration: [duration, 'minutes'],
  };

  return (
    <div className={styles.eventInfo}>
      <dl>
        <dt>
          <ClockIcon aria-label='Date and time of event' />
        </dt>
        <dd>
          <time dateTime={date.toISOString()}>{formatDate(date, 'eee do MMMM yyyy, HH:mm')}</time>
        </dd>

        <dt>
          <MapIcon aria-label='Location of event' />
        </dt>
        <dd>
          {name}
          <br />
          {address && (
            <Link href={formatMapLink(address)} target='_blank' rel='noreferrer'>
              {address}
            </Link>
          )}
        </dd>

        {futureEvent && (
          <>
            <dt>
              <CalIcon aria-label='Add event to calendar' />
            </dt>
            <dd>
              Add to calendar
              <br />
              <div className={styles.eventInfo__calendarLinks}>
                <Link href={google(event)} target='_blank' rel='noreferrer'>
                  Google
                </Link>
                <Link href={outlook(event)} target='_blank' rel='noreferrer'>
                  Outlook
                </Link>
                <Link href={ics(event)} target='_blank' rel='noreferrer'>
                  iCal
                </Link>
              </div>
            </dd>
          </>
        )}
      </dl>
    </div>
  );
};

export default EventInfo;
