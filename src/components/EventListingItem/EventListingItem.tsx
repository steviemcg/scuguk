import { EventAbstract, SponsorContent } from '@/content.types';
import Link from 'next/link';
import React from 'react';
import { Col, Row } from 'reactstrap';
import ClockIcon from '../Icons/clock-icon.svg';
import MapIcon from '../Icons/map-icon.svg';
import Button from '../Button';
import EventSponsors from '../EventSponsors';
import styles from './EventListingItem.module.scss';
import { formatDate } from '@/util/util';

type EventListingItemProps = Omit<EventAbstract, 'date' | 'sponsors'> & {
  dateTimestamp: number;
  sponsors: Omit<SponsorContent, 'lastSponsorDate'>[];
};

const EventListingItem = ({ eventKey, excerpt, dateTimestamp, venue, sponsors, title }: EventListingItemProps) => {
  const eventUrl = `/events/${eventKey}`;

  return (
    <div className={styles.eventListingItem}>
      <h2>
        <Link className={styles.eventListingItem__link} href={eventUrl}>
          {title}
        </Link>
      </h2>
      <Row>
        <Col xs={12} md={8}>
          <p>{excerpt}</p>
          <dl>
            <dt>
              <ClockIcon aria-label='Date and time of event' />
            </dt>
            <dd>{formatDate(new Date(dateTimestamp), 'eee do MMMM yyyy, HH:mm')}</dd>
            <dt>
              <MapIcon aria-label='Location of event' />
            </dt>
            <dd>
              {venue.name}
              {venue.address && <>, {venue.address}</>}
            </dd>
          </dl>
        </Col>
        <Col md={4} className={styles.eventListingItem__sponsor}>
          <EventSponsors sponsors={sponsors} />
        </Col>
      </Row>

      <div className={styles.eventListingItem__button}>
        <Button href={eventUrl}>View event</Button>
      </div>
    </div>
  );
};

export default EventListingItem;
