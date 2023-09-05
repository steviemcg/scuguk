import Head from 'next/head';
import Hero from '@/components/Hero';
import Box from '@/components/Box';
import Container from '@/components/Container';
import ContactForm from '@/components/ContactForm';

export default function Home() {
  return (
    <>
      <Head>
        <title>Contact | Sitecore User Group UK</title>
        <meta
          name='description'
          content='The official website for the Sitecore User Group UK. We meet for networking and sharing our learnings about Sitecore. Programmers, marketers, authors, or just interested in Sitecore? Swing by during our next event.'
        />
      </Head>
      <Hero heading='Contact Us' />
      <main>
        <Container>
          <Box theme='white'>
            <ContactForm />
          </Box>
        </Container>
      </main>
    </>
  );
}
