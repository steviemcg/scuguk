import React from 'react'
import { Helmet } from "react-helmet"
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../../components/Layout/layout'
import Hero from '../../components/Hero/hero'
import './sponsors.scss';

const SponsorsPage = ({ data }) => {
    const sponsors = data.allMarkdownRemark.nodes
    return (
        <>
            <Helmet>
                <title>Sponsors | Sitecore User Group UK</title>
                <meta name="description" content="Sponsors of the UK Sitecore User Group" />
            </Helmet>
            <Layout>
                <Hero heading="Sponsors" />
                <div role="main">
                    <div className="container">
                        <div className="theme__box theme__box--small theme__box--white">
                            <p className="mt-0">Our events rely completely on our sponsors, so we'd like to give our huge thanks to the following:</p>

                            <div className="row">
                                {sponsors.map(sponsor => (
                                    <div key={sponsor.id} className="col-sm-6 sponsor">
                                        <div className="shadow-lg">
                                            <div className="px-4 pt-4 mx-auto">
                                                <a href={sponsor.frontmatter.website} target="_blank">
                                                    <img src={sponsor.frontmatter.image.publicURL} alt={sponsor.frontmatter.title} className="sponsor-image" />
                                                </a>
                                            </div>
                                            <div className="px-4 py-4">
                                                <div className="font-weight-bold mb-2 lead">{sponsor.frontmatter.title}</div>
                                                <p className="my-0">
                                                    {sponsor.excerpt}
                                                </p>
                                            </div>
                                            <div className="pl-2 pb-4">
                                                <span className="inline-block rounded-full px-3 py-1 mr-2 sponsor-badge">
                                                    <a href={sponsor.frontmatter.website} target="_blank">#website</a>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

SponsorsPage.propTypes = {
    data: PropTypes.shape({
        markdownRemark: PropTypes.shape({
            frontmatter: PropTypes.object,
        }),
    }),
}

export default SponsorsPage

export const pageQuery = graphql`
query SponsorsPageQuery {
  allMarkdownRemark(sort: {order: ASC, fields: [frontmatter___title]}, filter: {frontmatter: {contentType: {eq: "sponsor"}}}) {
    nodes {
      id
      excerpt(pruneLength: 400)
      frontmatter {
        title
        image {
          publicURL
        }
        website
      }
    }
  }
}
`