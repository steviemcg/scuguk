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

type EventAdvertTalkProps = Omit<EventAgendaTalkData, 'speaker'> & { speaker?: SpeakerContent };

const EventAdvertTalk = ({ title, speaker }: EventAdvertTalkProps) => (
  <div className={styles.eventAdvert__entry}>
    <div className={styles.eventAdvert__speaker}>
      {speaker && speaker.image ? (
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
  const [sponsor] = sponsors;

  return (
    <Container>
      <section className={styles.eventAdvert}>
        <Row>
          <Col md={8}>
            <div className={styles.eventAdvert__imagesBar}>
              <SitecoreUGLogo className={styles.eventAdvert__logo} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {sponsor && (
                <img
                  className={styles.eventAdvert__sponsorImage}
                  src={`/data/sponsors/${sponsor.image}`}
                  alt={sponsor.title}
                />
              )}
            </div>
            <section className={styles.eventAdvert__city}>{event.location}</section>
            <section className={styles.eventAdvert__date}>{formatDate(date, 'MMMM do, h:mmaaa')}</section>
            <section className={styles.eventAdvert__address}>{event.venue.address}</section>
            <section className={styles.eventAdvert__talks}>
              {event.agenda.filter(isTalk).map((agendaItem, i) => (
                <EventAdvertTalk
                  key={i}
                  {...agendaItem}
                  speaker={agendaItem.speaker ? speakers[agendaItem.speaker] : undefined}
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
