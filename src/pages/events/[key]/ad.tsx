import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getEvent, getEventKeys } from '@/util/data/events';
import { EventContent, isTalk, SpeakerContent, SponsorContent } from '@/content.types';
import { getSponsor } from '@/util/data/sponsors';
import { getSpeaker } from '@/util/data/speakers';
import Image from 'next/image';
import Container from '@/components/Container';
import { Col, Row } from 'reactstrap';
import EventAdvert from '@/components/EventAdvert';

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
  const sponsors = eventContent.sponsors ? await Promise.all(eventContent.sponsors.map((s) => getSponsor(s))) : [];

  // TODO: This can surely be simplified
  const speakerMap = await Promise.all(
    eventContent.agenda
      .filter(isTalk)
      .filter((t) => t.speaker != undefined)
      .map(async (i) => [i.speaker, await getSpeaker(i.speaker!)] as [string, SpeakerContent])
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
  return (
    <>
      <Head>
        <title>{event.meta.title}</title>
        <meta name='description' content={event.meta.description} />
      </Head>
      <EventAdvert event={event} speakers={speakers} sponsors={sponsors} />
    </>
  );
};

export default EventPage;
