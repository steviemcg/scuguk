import React from "react";

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
      <a
        className={`button ${props.linkPath ? "" : "hide"}`}
        href={props.linkPath}
        target="_self"
      >
        {props.linkText}
      </a>
      <div>{props.children}</div>
    </section>
  </div>
);

export default Box;
