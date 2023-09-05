import React from 'react';
import Link from 'next/link';
import SitecoreUGLogo from './logo.svg';
import styles from './Footer.module.scss';
import Container from '../Container';

const Footer = () => (
  <footer className={styles.footer}>
    <Container>
      <Link className={styles.footer__logo} href='/'>
        <SitecoreUGLogo />
      </Link>

      <p>Copyright &copy; 2023 Sitecore User Group UK</p>
    </Container>
  </footer>
);

export default Footer;
