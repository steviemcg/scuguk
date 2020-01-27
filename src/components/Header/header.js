import React, { useState } from "react";
import { Link } from 'gatsby'
import Logo from '../../img/logo.svg';
import './header.scss';
import { useAuth0 } from "../../react-auth0-spa";

function Header() {
  const [mobileNavActive, toggleMobileNav] = useState(false);
  const handleClick = () => { toggleMobileNav(!mobileNavActive) }
  const { user, isAuthenticated, loginWithPopup, logout } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin
    });

  return (
    <header className={`header ${mobileNavActive ? "header--mobileNavActive" : ""}`}>
      <div className="container">

        <Link className="header__logo" activeClassName="active" to="/">
          <img src={Logo} />
        </Link>

        <button className="header__mobileNav" onClick={handleClick}>
          <span></span>
        </button>

        <nav className="header__nav" >
          <ul role="navigation" aria-label="main-navigation">
            <li>
              <Link activeClassName="active" to="/events" >
                <span>Events</span>
              </Link>
            </li>
            <li>
              <Link activeClassName="active" to="/newsletter" >
                <span>Newsletter</span>
              </Link>
            </li>
            <li>
              <Link activeClassName="active" to="/sponsors" >
                <span>Sponsors</span>
              </Link>
            </li>
            <li>
              <Link activeClassName="active" to="/contact" >
                <span>Contact</span>
              </Link>
            </li>
            <li>
              {isAuthenticated &&
                <a onClick={() => logoutWithRedirect()}>
                  Log out {user && user.name}
                </a>
              }
              {!isAuthenticated &&
                <a onClick={() => loginWithPopup()}>
                  Log in
                </a>
              }
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header