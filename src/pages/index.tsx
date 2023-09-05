import { GetStaticProps } from 'next';
import Head from 'next/head';
import FullScreenHero from '@/components/FullScreenHero';
import Box from '@/components/Box';
import Container from '@/components/Container';
import { Col, Row } from 'reactstrap';
import { getEvents } from '@/util/data/events';
import { getSponsorContent } from '@/util/data/sponsors';
import { EventAbstract, SponsorContent } from '@/content.types';
import EventNext from '@/components/EventNext';

type HomepageProps = {
  nextEvent:
    | (Omit<EventAbstract, 'date'> & {
        dateTimestamp: number;
      })
    | null;
  sponsors: Omit<SponsorContent, 'lastSponsorDate'>[];
};

const mapEvent = ({ date, ...eventAbstract }: EventAbstract) => ({
  ...eventAbstract,
  dateTimestamp: date.getTime(),
});

export const getStaticProps: GetStaticProps<HomepageProps> = async () => {
  const today = new Date();
  const allEvents = await getEvents();
  const futureEvents = allEvents.filter((e) => e.date >= today).map(mapEvent);

  const sponsors = await getSponsorContent();

  return {
    props: {
      nextEvent: futureEvents.length > 0 ? futureEvents[0] : null,
      sponsors: sponsors.map(({ lastSponsorDate, ...fields }) => fields),
    },
  };
};

const Homepage = ({ nextEvent, sponsors }: HomepageProps) => {
  return (
    <>
      <Head>
        <title>Sitecore User Group UK</title>
        <meta
          name='description'
          content='The official website for the Sitecore User Group UK. We meet for networking and sharing our learnings about Sitecore. Programmers, marketers, authors, or just interested in Sitecore? Swing by during our next event.'
        />
      </Head>
      <FullScreenHero heroImage='img/home_hero_2.jpg' heading='Welcome to the Sitecore User Group UK' />
      <main>
        <Container>
          <Box theme='green' heading='About us'>
            <p>
              Sitecore User Group UK is a community-driven Sitecore meet-up, bringing you talks from experts and peers
              involved in the world of Sitecore. It presents a perfect opportunity to watch presentations on varying
              subjects and network with fellow Sitecore enthusiasts over food and drinks.
            </p>
            <p>
              The User Group is open to anyone using or considering the Sitecore Experience Platform, or who has an
              interest in .NET CMS platforms, regardless of technical proficiency. Programmers, marketers, content
              authors, CMS users and others are all welcome.
            </p>
          </Box>
          <Row>
            {nextEvent && (
              <Col lg='6'>
                <Box theme='white' heading='Next Event'>
                  <EventNext {...nextEvent} sponsors={sponsors.filter((s) => nextEvent.sponsors.includes(s.key))} />
                </Box>
              </Col>
            )}
            <Col lg={nextEvent ? 6 : 12}>
              <Box theme='white' heading='Contact Us' link={{ text: 'Contact us', href: '/contact' }}>
                <p>
                  Do you have any questions or feedback? Are you interested in sponsoring or hosting an event? Do you
                  have a great idea for a presentation? Leave us a message and we&apos;ll get back to you as soon as
                  possible.
                </p>
              </Box>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
};

export default Homepage;
