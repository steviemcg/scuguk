import React from "react";
import LogoCircle from "../Logo/logoCircle";
import "./hero.scss";

const Hero = props => (
  <section className="hero">
    <LogoCircle />
    <div className="container">
      <h1>{props.heading}</h1>
    </div>
  </section>
);

export default Hero;
