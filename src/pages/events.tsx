import { GetStaticProps } from 'next';
import Head from 'next/head';
import Hero from '@/components/Hero';
import Box from '@/components/Box';
import { EventAbstract, SponsorContent } from '@/content.types';
import { getEvents } from '@/util/data/events';
import EventListingItem from '@/components/EventListingItem';
import EventListingPreviousItem from '@/components/EventListingPreviousItem';
import Container from '@/components/Container';
import { getSponsorContent } from '@/util/data/sponsors';

type EventListingProps = {
  pastEvents: (Omit<EventAbstract, 'date'> & {
    dateTimestamp: number;
  })[];
  upcomingEvents: (Omit<EventAbstract, 'date'> & {
    dateTimestamp: number;
  })[];
  sponsors: Omit<SponsorContent, 'lastSponsorDate'>[];
};

const mapEvent = ({ date, ...eventAbstract }: EventAbstract) => ({
  ...eventAbstract,
  dateTimestamp: date.getTime(),
});

export const getStaticProps: GetStaticProps<EventListingProps> = async () => {
  const today = new Date();
  const allEvents = await getEvents();
  const sponsors = await getSponsorContent();

  return {
    props: {
      pastEvents: allEvents
        .filter((e) => e.date < today)
        .map(mapEvent)
        .sort((a, b) => a.dateTimestamp - b.dateTimestamp),
      upcomingEvents: allEvents.filter((e) => e.date >= today).map(mapEvent),
      sponsors: sponsors.map(({ lastSponsorDate, ...fields }) => fields),
    },
  };
};

const Events = ({ pastEvents, upcomingEvents, sponsors }: EventListingProps) => {
  return (
    <>
      <Head>
        <title>Events | Sitecore User Group UK</title>
        <meta name='description' content='Events of the UK Sitecore User Group' />
      </Head>
      <Hero heading='Events' />
      <main>
        <Container>
          {upcomingEvents.length > 0 && (
            <Box theme='white'>
              {upcomingEvents.map((event, i) => (
                <EventListingItem
                  key={i}
                  {...event}
                  sponsors={sponsors.filter((s) => event.sponsors.includes(s.key))}
                />
              ))}
            </Box>
          )}
          {pastEvents.length > 0 && (
            <Box theme='white' heading='Past Events'>
              {pastEvents.map((event, i) => (
                <EventListingPreviousItem key={i} {...event} />
              ))}
            </Box>
          )}
        </Container>
      </main>
    </>
  );
};

export default Events;
