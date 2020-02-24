import React, { useState } from "react";
import { Link } from 'gatsby'
import Logo from '../../img/logo.svg';
import './header.scss';
import { useAuth0 } from "../../react-auth0-spa";
import PropTypes from "prop-types";

function Header({ data }) {
  const [mobileNavActive, toggleMobileNav] = useState(false);
  const handleClick = () => { toggleMobileNav(!mobileNavActive) }
  const { user, isAuthenticated, loginWithPopup, logout } = useAuth0();
  const { edges: archiveLinks } = data.archive;
  const { edges: upComingLinks } = data.future;

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
            <li className="dropdown">
              <Link activeClassName="active" to="/events" >
                <span>Events</span>
              </Link>
              <div className="dropdown-content">
                <div className="two-column">
                  <div><h3>Upcoming</h3></div>
                  {upComingLinks.map(({node: upComingLink })=> (
                    <div
                      key={upComingLink.frontmatter.title}
                      style={{
                        listStyleType: `none`,
                      }}
                    >
                      {
                      upComingLink.frontmatter.externalLink ? 
                      <a href={upComingLink.frontmatter.externalLink}>{upComingLink.frontmatter.title}</a> 
                      :
                      <Link to={upComingLink.fields.slug}>
                      {upComingLink.frontmatter.title}
                    </Link>
                    }
                    </div>
                  ))}
                </div>
                <div className="two-column">
                  <div>
                      <h3>Archive</h3>
                  </div>
                  {archiveLinks.map(({node: archiveLink })=> (
                    <div
                      key={archiveLink.frontmatter.title}
                      style={{
                        listStyleType: `none`,
                      }}
                    >
                      {
                      archiveLink.frontmatter.externalLink ? 
                      <a href={archiveLink.frontmatter.externalLink}>{archiveLink.frontmatter.title}</a> 
                      :
                      <Link to={archiveLink.fields.slug}>
                      {archiveLink.frontmatter.title}
                    </Link>
                    }
                    </div>
                  ))}
                </div>
              </div>
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

Header.propTypes = {
  data: PropTypes.shape({
    archive: PropTypes.shape({
      edges: PropTypes.array
    }),
    future: PropTypes.shape({
      edges: PropTypes.array
    })
  })
};

export default Header