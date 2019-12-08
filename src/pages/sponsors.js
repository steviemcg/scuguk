import React from 'react'
import { Helmet } from "react-helmet"
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout/layout'
import Hero from '../components/Hero/hero'

const SponsorsPage = ({ data }) => {
    const sponsors = data.allMarkdownRemark.nodes
    return (
        <>
            <Helmet>
                <title>Sponsors</title>
                <meta name="description" content="Sponsors of the UK Sitecore User Group" />
            </Helmet>
            <Layout>
                <Hero heading="Sponsors" />
                <div role="main">
                    <div className="container">

                        <div className="theme__box theme__box--small theme__box--white">
                            <div className="row">
                                {sponsors.map(sponsor => (
                                    <div key={sponsor.id} className="col-xs-12 col-md-3">
                                        <div className="bg-gray-200 rounded shadow-lg">
                                            <div className="px-6 pt-4 mx-auto">
                                                <a href={sponsor.frontmatter.website} target="_blank">
                                                    <img src={sponsor.frontmatter.image.publicURL} alt={sponsor.frontmatter.title}
                                                        className="h-12 mx-auto" />
                                                </a>
                                            </div>
                                            <div className="px-6 py-4">
                                                <div className="font-bold text-xl mb-2">{sponsor.frontmatter.title}</div>
                                                <p className="text-gray-700 text-base">
                                                    {sponsor.excerpt}
                                                </p>
                                            </div>
                                            <div className="px-6 py-4">
                                                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
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
  allMarkdownRemark(sort: {order: ASC, fields: [frontmatter___title]}, filter: {frontmatter: {templateKey: {eq: "sponsor"}}}) {
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