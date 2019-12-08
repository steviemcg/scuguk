import React from "react";
import { Link } from 'gatsby'

const Box = props => (
  <div className="container">
    <section
      className={`theme__box theme__box--${props.theme} ${
        props.small ? "theme__box--small" : ""
        }`}
      style={{ backgroundImage: `url(${props.background})` }}
    >
      <h2>{props.heading}</h2>
      <p>{props.description}</p>
      <div className="theme__box-button">
        <Link
          className={`button ${props.linkText ? "" : "hide"}`}
          to={props.linkPath}
        >{props.linkText}
        </Link>
      </div>
      <div>{props.children}</div>
    </section>
  </div>
);

export default Box;
