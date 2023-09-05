import { GetStaticProps } from 'next';
import Head from 'next/head';
import Hero from '@/components/Hero';
import Box from '@/components/Box';
import SponsorBox from '@/components/SponsorBox';
import { getSponsorContent } from '@/util/data/sponsors';
import { SponsorContent } from '@/content.types';
import { Row, Col } from 'reactstrap';
import Container from '@/components/Container';

type SponsorsProps = {
  sponsors: Omit<SponsorContent, 'lastSponsorDate'>[];
};

export const getStaticProps: GetStaticProps<SponsorsProps> = async () => {
  const orderedSponsors = (await getSponsorContent()).sort(
    (a, b) => b.lastSponsorDate.getTime() - a.lastSponsorDate.getTime()
  );

  return {
    props: {
      sponsors: orderedSponsors.map(({ lastSponsorDate, ...fields }) => fields),
    },
  };
};

const Sponsors = ({ sponsors }: SponsorsProps) => {
  return (
    <>
      <Head>
        <title>Sponsors | Sitecore User Group UK</title>
        <meta name='description' content='Sponsors of the UK Sitecore User Group' />
      </Head>
      <Hero heading='Sponsors' />
      <main>
        <Container>
          <Box theme='white'>
            <p>
              Our events rely completely on our sponsors, so we&apos;d like to give our huge thanks to the following:
            </p>
            <Row>
              {sponsors.map((sponsor, i) => (
                <Col key={i} sm='6'>
                  <SponsorBox {...sponsor} />
                </Col>
              ))}
            </Row>
          </Box>
        </Container>
      </main>
    </>
  );
};

export default Sponsors;
