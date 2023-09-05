import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cn from 'classnames';
import SitecoreUGLogo from './logo.svg';
import styles from './Header.module.scss';
import Container from '../Container';
import { useAuth0 } from '@auth0/auth0-react';

const Header = () => {
  const { isAuthenticated, loginWithPopup, logout, user } = useAuth0();
  const [mobileNavActive, toggleMobileNav] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const links = [
    { text: 'Events', href: '/events' },
    { text: 'Newsletter', href: '/newsletter' },
    { text: 'Sponsors', href: '/sponsors' },
    { text: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    if (mobileNavActive) {
      document.body.classList.add('body--scroll-locked');
    } else {
      document.body.classList.remove('body--scroll-locked');
    }
  }, [mobileNavActive]);

  const logoutWithRedirect = () =>
    logout({
      logoutParams: { returnTo: window.location.origin },
    });

  const closeMobileNav = useCallback(
    () =>
      setTimeout(() => {
        // If the current active element is not in <nav> or is the toggle button, menu should be close
        if (!navRef.current?.contains(document.activeElement)) {
          toggleMobileNav(false);
        }
      }, 150),
    [toggleMobileNav]
  );

  return (
    <header
      ref={navRef}
      onBlur={(e) => {
        closeMobileNav();
      }}
      className={cn(styles.header, { [styles['header--mobileNavActive']]: mobileNavActive })}
    >
      <Container className={styles['header-container']}>
        <Link className={styles.header__logo} href='/'>
          <SitecoreUGLogo />
        </Link>

        <button
          className={styles.header__mobileNavButton}
          onClick={() => {
            toggleMobileNav(!mobileNavActive);
          }}
        >
          <span></span>
        </button>

        <nav className={styles.header__nav}>
          <ul role='navigation' aria-label='main-navigation'>
            {links.map(({ text, href }, i) => (
              <li key={i}>
                <Link
                  className={cn(styles['header__link'], {
                    [styles['header__link--active']]: router.pathname === href,
                  })}
                  href={href}
                >
                  {text}
                </Link>
              </li>
            ))}
            <li>
              {isAuthenticated && (
                <a href='#' className={styles.header__link} onClick={() => logoutWithRedirect()}>
                  Log out {user && user.name}
                </a>
              )}
              {!isAuthenticated && (
                <a href='#' className={styles.header__link} onClick={() => loginWithPopup()}>
                  Log in
                </a>
              )}
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
