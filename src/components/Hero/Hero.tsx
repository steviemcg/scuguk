import React from 'react';
import LogoCircle from './logoCircle.svg';
import styles from './Hero.module.scss';
import Container from '../Container';

type HeroProps = {
  heading: string;
};

const Hero = ({ heading }: HeroProps) => (
  <section className={styles.hero}>
    <LogoCircle />
    <Container>
      <h1>{heading}</h1>
    </Container>
  </section>
);

export default Hero;
