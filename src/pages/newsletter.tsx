import Head from 'next/head';
import Box from '@/components/Box';
import Container from '@/components/Container';
import Hero from '@/components/Hero';
import NewsletterForm from '@/components/NewsletterForm';

export default function Newsletter() {
  return (
    <>
      <Head>
        <title>Newsletter | Sitecore User Group UK</title>
        <meta
          name='description'
          content='The official website for the Sitecore User Group UK. We meet for networking and sharing our learnings about Sitecore. Programmers, marketers, authors, or just interested in Sitecore? Swing by during our next event.'
        />
      </Head>
      <Hero heading='Sign up to our newsletter' />
      <main>
        <Container>
          <Box theme='white'>
            <NewsletterForm />
          </Box>
        </Container>
      </main>
    </>
  );
}
