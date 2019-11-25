import React from "react";
import PropTypes from "prop-types";
import { Link, graphql, StaticQuery } from "gatsby";

class EventsList extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: events } = data.allMarkdownRemark;

    return (
      <>
        {events &&
          events.map(({ node: event }) => (
            <article
              className="theme__box theme__box--small event"
              key={event.id}
            >
              <div className="container">
                <section>
                  <h2>
                    <Link to={event.fields.slug}>
                      {event.frontmatter.title}
                    </Link>
                  </h2>
                  <p>{event.frontmatter.sup}</p>
                </section>

                {/* <section>
                        <h2>Event Details</h2>
                        <p>{event.frontmatter.details.sponsors}</p>
                    </section>> */}

                {/* <section>
                        <h2>Venue</h2>
                        <p>{event.frontmatter.venue.location}</p>
                        <p>{event.frontmatter.venue.deta}</p>
                    </section> */}

                {/* <section>
                        <h2>Agenda</h2>
                        <p>{event.frontmatter.agenda}</p>
                    </section> */}

                {/* <section>
                        <h2>Speakers</h2>
                        <ul>
                            {event.frontmatter.speakers.map((speaker) => (
                                <li key={speaker.who}>
                                    <h3>{speaker.who}</h3>
                                    <p>{speaker.info}</p>
                                    <p>{speaker.description}</p>
                                </li>                    
                            ))}
                        </ul>
                    </section>                     */}
              </div>
            </article>
          ))}
      </>
    );
  }
}

EventsList.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array
    })
  })
};

export default () => (
  <StaticQuery
    query={graphql`
      query EventsListQuery {
        allMarkdownRemark(
          filter: { frontmatter: { templateKey: { eq: "event-page" } } }
        ) {
          edges {
            node {
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
              }
            }
          }
        }
      }
    `}
    render={data => <EventsList data={data} />}
  />
);
