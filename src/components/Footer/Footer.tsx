import React from 'react';
import Link from 'next/link';
import SitecoreUGLogo from './logo.svg';
import styles from './Footer.module.scss';
import Container from '../Container';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <Container>
        <Link className={styles.footer__logo} aria-label='Sitecore UG Homepage' href='/'>
          <SitecoreUGLogo />
        </Link>

        <p>Copyright &copy; {year} Sitecore User Group UK</p>
      </Container>
    </footer>
  );
};

export default Footer;
