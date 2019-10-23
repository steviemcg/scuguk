import React from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import image from "../images/received-message.svg";

export default function ContactThankYouPage() {
  return (
    <Layout>
      <SEO
        keywords={[`sitecore`, `user group`, `london`, `bristol`, `cardiff`, `manchester`, `leeds`, `uk`, `united kingdom`, `england`, `wales`]}
        title="Contact submission received"
      />

      <section className="flex flex-col md:flex-row items-center">
        <div className="md:w-2/3 md:mr-8">
          <h1 className="text-xl mb-2">Thank you!</h1>

          <p>
            We'll be in touch as soon as possible.
          </p>
        </div>

        <figure className="w-2/3 md:w-1/3">
          <img alt="Message received, thank you!" src={image} />
        </figure>
      </section>
    </Layout>
  );
}