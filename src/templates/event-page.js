import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout/layout";
import Hero from "../components/Hero/hero";
import '../components/EventsList/event.scss'

export const EventPageTemplate = ({
  title,
  image,
  sup,
  details,
  venue,
  agenda,
  speakers
}) => {
  return (
    <>
      <Hero heading={title}/>   
      <div role="main">
        <div className="container">
          <article className="theme__box theme__box--small">

            <section className="event__hero">
              <img src="{image}" alt="" />
            </section>

            <div className="container">
              <section>
                <p>{sup}</p>
              </section>
              <section>
                <h2>Event Details</h2>
                <p>{details.sponsors}</p>
              </section>
              >
              <section>
                <h2>Venue</h2>
                <p>{venue.location}</p>
                <p>{venue.deta}</p>
              </section>
              <section>
                <h2>Agenda</h2>
                <p>{agenda}</p>
              </section>
              <section>
                <h2>Speakers</h2>
                <ul>
                  {speakers.map(speaker => (
                    <li key={speaker.who}>
                      <h3>{speaker.who}</h3>
                      <p>{speaker.info}</p>
                      <p>{speaker.description}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

          </article>
        </div>
      </div>
    </>
  );
};

EventPageTemplate.propTypes = {
  title: PropTypes.string,
  image: PropTypes.string,
  sup: PropTypes.string,
  details: PropTypes.object,
  venue: PropTypes.object,
  agenda: PropTypes.string,
  speakers: PropTypes.object
};

const Event = ({ data }) => {
  const { markdownRemark: event } = data;

  return (
    <>
      <Helmet>
        <title>{event.frontmatter.meta.metaTitle}</title>
        <meta
          name="description"
          content={event.frontmatter.meta.metaDescription}
        />
      </Helmet>
      <Layout>
        <EventPageTemplate
          title={event.frontmatter.title}
          image={event.frontmatter.image}
          sup={event.frontmatter.sup}
          details={event.frontmatter.details}
          venue={event.frontmatter.venue}
          agenda={event.frontmatter.agenda}
          speakers={event.frontmatter.speakers}
        />
      </Layout>
    </>
  );
};

Event.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object
  })
};

export default Event;

export const pageQuery = graphql`
  query EventByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      fields {
        slug
      }
      frontmatter {
        title
        sup
        details {
          sponsors
          date
          timings
          food
        }
        venue {
          location
          details
        }
        agenda
        speakers {
          who
          intro
          description
        }

        meta {
          metaTitle
          metaDescription
        }
      }
    }
  }
`;
