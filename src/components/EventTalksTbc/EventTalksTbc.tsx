import React from 'react';
import { EventContent } from '@/content.types';
import Link from 'next/link';

const EventTalksTbc = () => (
  <section>
    Not all talks for this event have been scheduled. Please{' '}
    <Link href='/contact'>
      <span>contact us</span>
    </Link>{' '}
    if you are interested in presenting. We welcome speakers of all levels of experience and would like to particulary
    encourage first-time speakers.
  </section>
);

export default EventTalksTbc;
