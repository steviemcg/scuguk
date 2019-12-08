import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Img from "gatsby-image"
import Layout from "../components/Layout/layout";
import Hero from "../components/Hero/hero";
import '../components/EventsList/event.scss'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

export const Agenda = ({ time, value }) => (
  <div>
    <h3>{time} - {value}</h3>
  </div>
)

export const Talk = ({ time, who, intro, description }) => (
  <div>
    <h3>{time} - {intro}</h3>
    <h4 className="talk-who">{who}</h4>
    <div className="talk-description">{description}</div>
  </div>
)

export const Venue = ({ venue }) => {
  const mapContainerStyle = {
    height: "400px",
    width: "100%",
    marginBottom: "20px"
  }

  const positionArr = venue.position.split(",")
  const position = {
    lat: parseFloat(positionArr[0]),
    lng: parseFloat(positionArr[1])
  }

  return (
    <section>
      <h2>Venue</h2>

      <dl>
        <dt>Name</dt>
        <dd>{venue.name}</dd>
        <dt>Address</dt>
        <dd>{venue.address}</dd>
        <dt>Details</dt>
        <dd>{venue.details}</dd>
      </dl>

      <LoadScript id="script-loader" googleMapsApiKey="AIzaSyBr85EicbttnsTYoDQbZ64QOomCXbGMx_M">
        <GoogleMap id='venue-map' center={position} zoom={15} mapContainerStyle={mapContainerStyle}>
          <Marker position={position} title={venue.name + ' - ' + venue.address} />
        </GoogleMap>
      </LoadScript>
    </section>
  )
}

Venue.propTypes = {
  venue: PropTypes.object
}

export const EventPageTemplate = ({
  title,
  image,
  sup,
  date,
  sponsors,
  venue,
  agenda
}) => {
  return (
    <>
      <Hero heading={title} />
      <div role="main">
        <div className="container">
          <article className="theme__box theme__box--small">
            <section className="event__hero">
              <Img fluid={image.childImageSharp.fluid} />
            </section>

            <div className="container">
              <section>
                <p>{sup}</p>
              </section>
              <section>
                <h2>Event Details</h2>

                <dl>
                  <dt>Sponsors</dt>
                  <dd>{sponsors}</dd>
                  <dt>Date</dt>
                  <dd>{date}</dd>
                </dl>
              </section>

              <Venue venue={venue} />

              <section>
                <h2>Agenda</h2>
                {agenda.map(speaker => {
                  return speaker.value
                    ? <Agenda time={speaker.time} value={speaker.value} key={speaker.time} />
                    : <Talk time={speaker.time} who={speaker.who} intro={speaker.intro} description={speaker.description} key={speaker.time} />
                })}
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
  image: PropTypes.object,
  sup: PropTypes.string,
  date: PropTypes.string,
  sponsors: PropTypes.string,
  venue: PropTypes.object,
  agenda: PropTypes.array
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
          date={event.frontmatter.date}
          sponsors={event.frontmatter.sponsors}
          venue={event.frontmatter.venue}
          agenda={event.frontmatter.agenda}
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
        image {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }        
        title
        date(formatString: "MMMM D, YYYY - HH:mm")
        sponsors
        sup
        venue {
          name
          address
          position
          details
        }
        agenda {
          time
          value
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
