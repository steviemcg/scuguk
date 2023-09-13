import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import Box from '@/components/Box';
import Hero from '@/components/Hero';
import { getEvent, getEventKeys } from '@/util/data/events';
import { EventContent, isTalk, SpeakerContent, SponsorContent } from '@/content.types';
import EventDetails from '@/components/EventDetails';
import { Col, Row } from 'reactstrap';
import Container from '@/components/Container';
import EventInfo from '@/components/EventInfo';
import EventAgenda from '@/components/EventAgenda';
import { getSponsor } from '@/util/data/sponsors';
import EventSponsors from '@/components/EventSponsors';
import { getSpeaker } from '@/util/data/speakers';
import EventAttendance from '@/components/EventAttendance';
import { getAbsoluteUrl } from '@/util/util';
import EventTalksTbc from '@/components/EventTalksTbc';

type EventPageProps = {
  sponsors: Omit<SponsorContent, 'lastSponsorDate'>[];
  speakers: Record<string, SpeakerContent>;
  event: Omit<EventContent, 'date'> & {
    dateTimestamp: number;
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const eventKeys = await getEventKeys();
  return {
    paths: eventKeys.map((key) => ({ params: { key } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<EventPageProps> = async ({ params }) => {
  // TODO: Consider moving this out to data layer
  const { date, ...eventContent } = await getEvent(params!.key as string);
  const sponsors = await Promise.all(eventContent.sponsors.map((s) => getSponsor(s)));

  // TODO: This can surely be simplified
  const speakerMap = await Promise.all(
    eventContent.agenda
      .filter(isTalk)
      .map(async (i) => [i.speaker, await getSpeaker(i.speaker)] as [string, SpeakerContent])
  );
  const speakers = speakerMap.reduce(
    (obj, item) => ((obj[item[0]] = item[1]), obj),
    {} as Record<string, SpeakerContent>
  );

  return {
    props: {
      event: { ...eventContent, dateTimestamp: date.getTime() },
      speakers,
      sponsors: sponsors.map(({ lastSponsorDate, ...sponsor }) => sponsor),
    },
  };
};

const EventPage = ({ event, sponsors, speakers }: EventPageProps) => {
  const date = new Date(event.dateTimestamp);
  const futureEvent = date > new Date();

  return (
    <>
      <Head>
        <title>{`${event.title} | Sitecore User Group UK`}</title>
        <meta name='description' content={event.meta.description} />
        <meta property='og:image' content={getAbsoluteUrl(`events/${event.eventKey}-image.jpg`)} />
      </Head>
      <Hero heading={event.title} />
      <main>
        <Container>
          <Row>
            <Col xs={12} lg={8}>
              <Box theme='green'>
                <EventDetails {...event} />
              </Box>
            </Col>
            <Col xs={12} lg={4}>
              <Row>
                <Col sm={6} lg={12}>
                  <Box theme='white'>
                    <EventInfo {...event} />
                  </Box>
                </Col>
                <Col sm={6} lg={12}>
                  <Box theme='white' small>
                    <EventSponsors sponsors={sponsors} />
                  </Box>
                </Col>
              </Row>
            </Col>
            <Col xs={12}>
              {event.agenda.some((a) => a.type === 'tbd') && (
                <Box theme='white' heading='Interested in speaking?'>
                  <EventTalksTbc />
                </Box>
              )}
              <Box theme='green' heading='Agenda'>
                <EventAgenda event={event} speakers={speakers} />
              </Box>
            </Col>
            {futureEvent && (
              <Col xs={12}>
                <Box theme='green' heading='Attendance'>
                  <EventAttendance eventId={event.eventId} />
                </Box>
              </Col>
            )}
          </Row>
        </Container>
      </main>
    </>
  );
};

export default EventPage;
