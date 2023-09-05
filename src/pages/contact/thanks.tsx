import Head from 'next/head';
import Hero from '@/components/Hero';
import Box from '@/components/Box';
import Container from '@/components/Container';
import ContactForm from '@/components/ContactForm';

export default function Home() {
  return (
    <>
      <Head>
        <title>Thanks | Contact | Sitecore User Group UK</title>
        <meta name='description' content='Thanks for getting in touch with the Sitecore User Group UK.' />
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <Hero heading='Contact Us' />
      <main>
        <Container>
          <Box theme='white' heading='Thanks!' link={{ text: 'Return to homepage', href: '/' }}>
            <p>Thanks for submitting the Contact Form, we&apos;ve got your details and will be in touch soon!</p>
          </Box>
        </Container>
      </main>
    </>
  );
}
