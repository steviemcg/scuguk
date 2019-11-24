import React from "react";
import { Link } from "gatsby";
import Logo from "../Logo/logo";
import "./footer.scss";

const dt = new Date();

const Footer = () => (
  <footer className="footer">
    <div className="container">

      <Link className="footer__logo" activeClassName="active" to="/">
        <Logo />
      </Link>

      <p>Copyright &copy; {dt.getFullYear()} Sitecore User Group UK</p>
    </div>
  </footer>
);

export default Footer;
