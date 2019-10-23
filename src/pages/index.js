import React from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import meetupImage from "../images/meetup.jpg";

export default function IndexPage() {
  return (
    <Layout>
      <SEO
        keywords={[`sitecore`, `user group`, `london`, `bristol`, `cardiff`, `manchester`, `leeds`, `uk`, `united kingdom`, `england`, `wales`]}
        title="Home"
      />

      <section>
        <img
          alt="Meetup at Valtech"
          className="block mx-auto w-1/2 mb-4"
          src={meetupImage}
        />

        <h2 className="text-2xl font-bold inline-block p-3 mx-auto">
          Welcome to the Sitecore User Group UK
        </h2>

        <p className="p-3 leading-loose">
          We meet each quarter for networking, learning - and did we mention free snacks and drinks?
        </p>

        <p className="p-3 leading-loose">
          The user group is open to anyone using or considering the Sitecore Experience Platform,
          or who has an interest in .NET CMS platforms, regardless of technical proficiency.
          Programmers, marketers, content authors, CMS users and others are all welcome.
          </p>

        <p className="p-3 leading-loose">
          Our events wouldn't be possible without the kind support of our <Link key="Sponsors" to="/sponsors">Sponsors</Link>
        </p>
      </section>
    </Layout>
  );
}