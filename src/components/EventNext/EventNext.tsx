import { EventAbstract, SponsorContent } from '@/content.types';
import Link from 'next/link';
import React from 'react';
import { Col, Row } from 'reactstrap';
import Button from '../Button';
import ClockIcon from '../Icons/clock-icon.svg';
import MapIcon from '../Icons/map-icon.svg';
import styles from './EventNext.module.scss';
import { formatDate } from '@/util/util';

type EventNextProps = Omit<EventAbstract, 'date' | 'sponsors'> & {
  dateTimestamp: number;
  sponsors: Omit<SponsorContent, 'lastSponsorDate'>[];
};

const EventNext = ({ eventKey, excerpt, dateTimestamp, venue, sponsors, title }: EventNextProps) => {
  const eventUrl = `/events/${eventKey}`;

  return (
    <div className={styles.eventNext}>
      <h3>
        <Link className={styles.eventNext__link} href={eventUrl}>
          {title}
        </Link>
      </h3>
      <Row>
        <Col xs={12}>
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
      </Row>

      <div className={styles.eventNext__button}>
        <Button href={eventUrl}>View event</Button>
      </div>
    </div>
  );
};

export default EventNext;
