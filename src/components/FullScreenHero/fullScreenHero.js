import React from "react";
import "./fullScreenHero.scss";

const FullScreenHero = props => (
  <section className="fullScreenhero">
    <span style={{ backgroundImage: `url(${props.heroImage})`}}></span>
    <div className="container">
      <div className="fullScreenhero__panel">
        <div className="fullScreenhero__content">
          <h1>{props.heading}</h1>
        </div>
      </div>
    </div>
  </section>
);

export default FullScreenHero;
