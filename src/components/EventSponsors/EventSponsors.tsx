import React from 'react';
import { SponsorContent } from '@/content.types';
import styles from './EventSponsors.module.scss';
import Link from 'next/link';
import cn from 'classnames';

type EventSponsorsProps = { sponsors: Omit<SponsorContent, 'lastSponsorDate'>[]; small?: boolean };

const EventSponsors = ({ sponsors, small }: EventSponsorsProps) => {
  // TODO: Currently assumes a single event sponsor, needs a bit of design rework to
  // allow for multiple sponsors;
  const { title, website, image } = sponsors[0];

  return (
    <div
      className={cn(styles.eventSponsors, {
        [styles['eventSponsors--small']]: small,
      })}
    >
      <span>sponsored by</span>
      <div className={styles.eventSponsors__imageWrapper}>
        <Link href={website} target='_blank' rel='noreferrer'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/data/sponsors/${image}`} alt={title} />
        </Link>
      </div>
    </div>
  );
};

export default EventSponsors;
