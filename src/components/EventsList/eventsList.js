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
                    {
                      event.frontmatter.externalLink ? 
                      <a href={event.frontmatter.externalLink}>{event.frontmatter.title}</a> 
                      :
                      <Link to={event.fields.slug}>
                      {event.frontmatter.title}
                    </Link>
                    }
                  </h2>
                  <p>{event.frontmatter.sup}</p>
                </section>
                <section>
                  <dl>
                    <dt>Date</dt>
                    <dd>{event.frontmatter.dateConfirmed ? event.frontmatter.date : event.frontmatter.dateVague}</dd>

                    {event.frontmatter.venue &&
                      <>
                        <dt>Venue</dt>
                        <dd>{event.frontmatter.venue.name}

                          {event.frontmatter.venue.address &&
                            <>
                              , {event.frontmatter.venue.address}
                            </>
                          }
                        </dd>
                      </>
                    }

                    {event.frontmatter.sponsors &&
                      <>
                        <dt>Sponsors</dt>
                        <dd>{event.frontmatter.sponsors}</dd>
                      </>
                    }
                  </dl>
                </section>
                <div className="theme__box-button">
                  {event.frontmatter.externalLink ? <a href={event.frontmatter.externalLink} className="button">Read more...</a> : <Link className="button" to={event.fields.slug}>Read more...</Link>}
                </div>
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
        allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "event-page"}}, fields: {isFuture: {eq: true}}}, sort: {order: ASC, fields: frontmatter___date}) {
          edges {
            node {
              id
              fields {
                slug
              }
              frontmatter {
                title
                sup
                dateConfirmed
                date(formatString: "MMMM D, YYYY - HH:mm")
                dateVague: date(formatString: "MMMM YYYY")
                externalLink
                sponsors
                venue {
                  name
                  address
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
