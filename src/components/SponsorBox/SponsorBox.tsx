import React from 'react';
import styles from './SponsorBox.module.scss';
import Link from 'next/link';

type SponsorBoxProps = {
  title: string;
  description: string;
  image: string;
  website: string;
};

const SponsorBox = ({ title, description, image, website }: SponsorBoxProps) => (
  <div className={styles.sponsorBox}>
    <div className={styles.sponsorBox__imageWrapper}>
      <Link href={website} target='_blank' rel='noreferrer'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/data/sponsors/${image}`} alt='' />
      </Link>
    </div>
    <h3 className={styles.sponsorBox__title}>{title}</h3>
    <p>{description}</p>
    <span className={styles.sponsorBox__badge}>
      <Link href={website} target='_blank' rel='noreferrer'>
        #website
      </Link>
    </span>
  </div>
);

export default SponsorBox;
