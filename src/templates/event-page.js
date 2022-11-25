import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import Img from "gatsby-image"
import Layout from "../components/Layout/layout";
import Hero from "../components/Hero/hero";
import EventAttendance from "../components/Event/eventAttendance";
import '../components/EventsList/event.scss'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import Markdown from 'markdown-to-jsx';

export const Agenda = ({ time, value }) => (
  <div className="mb-4">
    <h3 className="agenda-title">{time} - {value}</h3>
  </div>
)

export const Talk = ({ time, who, intro, description }) => (
  <div className="mb-4">
    <h3 className="mb-0 agenda-title">{time} - {intro}</h3>
    <h4 className="talk-who mb-3">{who}</h4>
    <div className="talk-description">{description}</div>
  </div>
)

export const Venue = ({ venue }) => {
  if (venue == null || !venue.name) {
    return null;
  }

  const mapContainerStyle = {
    height: "400px",
    width: "100%",
    marginBottom: "20px"
  }

  let position = null;

  if (venue.position) {
    const positionArr = venue.position.split(",")
    position = {
      lat: parseFloat(positionArr[0]),
      lng: parseFloat(positionArr[1])
    }
  }

  return (
    <section>
      <h2>Venue</h2>

      <dl>
        <dt>Name</dt>
        <dd>{venue.name}</dd>
        {venue.address &&
          <>
            <dt>Address</dt>
            <dd>{venue.address}</dd>
          </>
        }
        {venue.details &&
          <>
            <dt>Details</dt>
            <dd>{venue.details}</dd>
          </>
        }
      </dl>

      {position !== null &&
        <LoadScript id="script-loader" googleMapsApiKey="AIzaSyBr85EicbttnsTYoDQbZ64QOomCXbGMx_M">
          <GoogleMap id='venue-map' center={position} zoom={15} mapContainerStyle={mapContainerStyle}>
            <Marker position={position} title={venue.name + ' - ' + venue.address} />
          </GoogleMap>
        </LoadScript>
      }
    </section>
  )
}

Venue.propTypes = {
  venue: PropTypes.object
}

export const EventPageTemplate = ({
  eventId,
  title,
  image,
  sup,
  intro,
  date,
  sponsors,
  venue,
  agenda,
  showOnlineRsvp
}) => {
  return (
    <>
      <Hero heading={title} />
      <div role="main">
        <div className="container">
          <article className="theme__box theme__box--small">
            <ul className="breadcrumbs">
              <li><Link activeClassName="active" to="/" >Home</Link></li>
              <li><Link activeClassName="active" to="/events" >Events</Link></li>
              <li>{title}</li>
            </ul>
            {image &&
              <>
                <section className="event__hero">
                  <Img fluid={image.childImageSharp.fluid} />
                </section>
              </>
            }

            <div className="container">
              <section>
                { intro ? <Markdown options={{ forceBlock: true }}>{intro}</Markdown> : <p>{sup}</p> }
              </section>
              <section>
                <h2>Event Details</h2>

                <dl>
                  {sponsors &&
                    <>
                      <dt>Sponsors</dt>
                      <dd>{sponsors}</dd>
                    </>
                  }

                  <dt>Date</dt>
                  <dd>{date}</dd>
                </dl>
              </section>

              <Venue venue={venue} />

              <section>
                <h2 className="mb-4">Agenda</h2>
                {agenda.map(speaker => {
                  return speaker.value
                    ? <Agenda time={speaker.time} value={speaker.value} key={speaker.time} />
                    : <Talk time={speaker.time} who={speaker.who} intro={speaker.intro} description={speaker.description} key={speaker.time} />
                })}
              </section>

              <EventAttendance eventId={eventId} showOnlineRsvp={showOnlineRsvp}/>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

EventPageTemplate.propTypes = {
  eventId: PropTypes.string,
  title: PropTypes.string,
  image: PropTypes.object,
  sup: PropTypes.string,
  details: PropTypes.string,
  date: PropTypes.string,
  sponsors: PropTypes.string,
  venue: PropTypes.object,
  agenda: PropTypes.array,
  showOnlineRsvp: PropTypes.bool
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
          eventId={event.frontmatter.eventId}
          title={event.frontmatter.title}
          image={event.frontmatter.image}
          sup={event.frontmatter.sup}
          intro={event.frontmatter.intro}
          date={event.frontmatter.dateConfirmed ? event.frontmatter.date : event.frontmatter.dateVague}
          sponsors={event.frontmatter.sponsors}
          venue={event.frontmatter.venue}
          agenda={event.frontmatter.agenda}
          showOnlineRsvp={event.frontmatter.showOnlineRsvp ? event.frontmatter.showOnlineRsvp : false}
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
        eventId
        image {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }        
        title
        dateConfirmed
        date(formatString: "MMMM D, YYYY - HH:mm")
        dateVague: date(formatString: "MMMM YYYY")
        sponsors
        sup
        intro
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
