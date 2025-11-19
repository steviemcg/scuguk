import React from 'react';
import { SponsorContent } from '@/content.types';
import styles from './EventSponsors.module.scss';
import Link from 'next/link';
import cn from 'classnames';

type EventSponsorsProps = { sponsors: Omit<SponsorContent, 'lastSponsorDate'>[]; small?: boolean };

const EventSponsors = ({ sponsors, small }: EventSponsorsProps) => {
  return (
    <div
      className={cn(styles.eventSponsors, {
        [styles['eventSponsors--small']]: small,
      })}
    >
      <span>sponsored by</span>
      {sponsors.map(({ title, website, image }) => (
        <div className={styles.eventSponsors__imageWrapper}>
          <Link href={website} target='_blank' rel='noreferrer'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/data/sponsors/${image}`} alt={title} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default EventSponsors;
