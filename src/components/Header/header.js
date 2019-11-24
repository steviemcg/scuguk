import React, { useState } from "react";
import { Link } from 'gatsby'
import Logo from '../Logo/logo';
import './header.scss';

function Header() {
  const [mobileNavActive, toggleMobileNav] = useState(false);
  const handleClick = () => {toggleMobileNav(!mobileNavActive)}

  return (
    <header className={`header ${mobileNavActive ? "header--mobileNavActive" : ""}`}>
      <div className="container">
        
        <Link className="header__logo" activeClassName="active" to="/"> 
          <Logo />
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
              <Link activeClassName="active" to="/contact" > 
                <span>Contact</span>
              </Link>
            </li>
          </ul>   
        </nav> 
      </div>       
    </header>
  )
}

export default Header


  
