import React from "react";
import LogoCircle from "../../img/logoCircle.svg";
import "./hero.scss";

const Hero = props => (
  <section className="hero">
    <img src={LogoCircle} />
    <div className="container">
      <h1>{props.heading}</h1>
    </div>
  </section>
);

export default Hero;
