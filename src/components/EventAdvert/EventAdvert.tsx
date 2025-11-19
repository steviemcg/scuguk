import React from 'react';
import {
  EventAgendaItem as EventAgendaItemData,
  EventAgendaTalk as EventAgendaTalkData,
  EventContent,
  isTalk,
  SpeakerContent,
  SponsorContent,
} from '@/content.types';
import { Col, Row } from 'reactstrap';
import Image from 'next/image';
import styles from './EventAdvert.module.scss';
import Container from '../Container';
import { formatDate } from '@/util/util';
import SitecoreUGLogo from './logo.svg';
import DefaultProfileImage from './default-profile.svg';
import cn from 'classnames';

type EventAdvertTalkProps = Omit<EventAgendaTalkData, 'speaker' | 'speakers'> & { speakers?: SpeakerContent[] };

const EventAdvertTalk = ({ title, speakers }: EventAdvertTalkProps) => (
  <div className={styles.eventAdvert__entry}>
    <div className={styles.eventAdvert__talk}>
      {speakers && speakers.length > 0 && (
        <div className={styles.eventAdvert__speakers}>
          {speakers.map((speaker) => (
            <div key={speaker.name} className={styles.eventAdvert__speaker}>
              {speaker.image ? (
                <Image
                  className={styles.eventAdvert__profileImage}
                  src={`/data/speakers/${speaker.image}`}
                  width='180'
                  height='180'
                  alt={`Profile photo of ${speaker.name}`}
                />
              ) : (
                <DefaultProfileImage className={styles.eventAdvert__profileImage} />
              )}
              <span className={styles.eventAdvert__speakerName}>{speaker && speaker.name}</span>
            </div>
          ))}
        </div>
      )}
      <span className={styles.eventAdvert__speakerTitle}>{title}</span>
    </div>
  </div>
);

type EventAdvertProps = {
  speakers: Record<string, SpeakerContent>;
  sponsors: Omit<SponsorContent, 'lastSponsorDate'>[];
  event: Omit<EventContent, 'date'> & {
    dateTimestamp: number;
  };
};

const EventAdvert = ({ event, speakers, sponsors }: EventAdvertProps) => {
  const date = new Date(event.dateTimestamp);
  const noTalks = event.agenda.filter(isTalk).length === 0;

  return (
    <Container>
      <section className={styles.eventAdvert}>
        <Row>
          <Col md={8}>
            <div className={styles.eventAdvert__imagesBar}>
              <SitecoreUGLogo className={styles.eventAdvert__logo} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {sponsors.map(({ image, title }) => (
                <img
                  key={title}
                  className={styles.eventAdvert__sponsorImage}
                  src={`/data/sponsors/${image}`}
                  alt={title}
                />
              ))}
            </div>
            <section className={cn(styles.eventAdvert__city, { [styles[`eventAdvert__city--no-talks`]]: noTalks })}>
              {event.location}
            </section>
            <section className={styles.eventAdvert__date}>{formatDate(date, 'MMMM do, h:mmaaa')}</section>
            <section className={styles.eventAdvert__address}>{event.venue.address}</section>
            <section className={cn(styles.eventAdvert__talks, { [styles[`eventAdvert__talks--empty`]]: noTalks })}>
              {event.agenda.filter(isTalk).map((agendaItem, i) => (
                <EventAdvertTalk
                  key={i}
                  {...agendaItem}
                  speakers={(agendaItem.speakers ?? [agendaItem.speaker])
                    .filter((speaker) => speaker !== undefined)
                    .map((speaker) => speakers[speaker!])}
                />
              ))}
            </section>
          </Col>
          <Col
            md={4}
            className={styles.eventAdvert__location}
            style={{ backgroundImage: `url(/data/locations/${event.location.toLowerCase()}.jpg)` }}
          ></Col>
        </Row>
      </section>
    </Container>
  );
};

export default EventAdvert;
