import React from 'react';
import Container from '../Container';
import styles from './FullScreenHero.module.scss';

type FullscreenHeroProps = {
  heroImage: string;
  heading: string;
};

const FullScreenHero = ({ heroImage, heading }: FullscreenHeroProps) => (
  <section className={styles.fullScreenHero}>
    <span style={{ backgroundImage: `url(${heroImage})` }}></span>
    <Container>
      <div className={styles.fullScreenHero__panel}>
        <div className={styles.fullScreenHero__content}>
          <h1>{heading}</h1>
        </div>
      </div>
    </Container>
  </section>
);

export default FullScreenHero;
