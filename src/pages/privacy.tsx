import Head from 'next/head';
import Link from 'next/link';
import Box from '@/components/Box';
import Container from '@/components/Container';
import Hero from '@/components/Hero';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy policy | Sitecore User Group UK</title>
        <meta name='description' content='How Sitecore User Group UK uses information you share with us.' />
      </Head>
      <Hero heading='Privacy policy' />
      <main>
        <Container>
          <Box theme='white'>
            <p>
              Sitecore User Group UK uses the information you give us to run events, answer enquiries and send the
              updates you request. This page explains what happens when you use those parts of the site.
            </p>

            <h2>Event RSVPs</h2>
            <p>
              To respond to an event, you sign in through Auth0. Your account provides your name, email address and
              profile picture. Our RSVP service, hosted on Azure, uses those details and your answer for each event
              (attending, not attending or on the waiting list) to manage attendance. The names and profile pictures of
              people attending are shown on the event page to other signed-in visitors.
            </p>

            <h2>Contact form</h2>
            <p>
              When you <Link href='/contact'>contact us</Link>, we collect your name, email address, enquiry type and
              message so we can respond. If you ask about sponsorship or giving a talk, we also collect the company,
              sponsorship or talk details you provide. Netlify Forms receives the submission for us.
            </p>

            <h2>Newsletter</h2>
            <p>
              When you <Link href='/newsletter'>sign up for updates</Link>, we collect your email address, first and last
              name, company, job title and the regions you choose. We send these details to Mailchimp to deliver the
              updates you requested.
            </p>

            <h2>Content from other services</h2>
            <p>
              This site loads its Lato font from Google Fonts, so your browser contacts Google to fetch it. Some event
              pages can include a YouTube video; when they do, your browser contacts YouTube to load the video. Event
              location and calendar links open external services only when you follow them.
            </p>

            <h2>How long we keep your information</h2>
            <ul>
              <li>Contact-form messages submitted through Netlify Forms are kept for 12 months.</li>
              <li>
                RSVP details (name, email address, profile picture and attendance answers), handled through Auth0 and our
                RSVP API, are kept until you ask us to delete them.
              </li>
              <li>Newsletter details submitted to Mailchimp are kept until you unsubscribe.</li>
            </ul>

            <h2>Your choices and requests</h2>
            <p>
              You can ask us for a copy of the information we hold about you, ask us to correct it, or ask us to delete
              it. To make a privacy request, contact us at{' '}
              <a href='mailto:newsletter@scug.co.uk'>newsletter@scug.co.uk</a>. You can also raise a concern with the UK
              Information Commissioner&apos;s Office.
            </p>
          </Box>
        </Container>
      </main>
    </>
  );
}
