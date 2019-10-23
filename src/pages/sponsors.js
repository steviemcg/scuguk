import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { graphql } from 'gatsby'

export default function SponsorsPage({ data }) {
  return (
    <Layout>
      <SEO
        keywords={[`sitecore`, `user group`, `sponsors`]}
        title="Sponsors"
      />

      <h1 className="text-xl mb-2">Sponsors</h1>

      <div className="mb-4 text-gray-600">
        Our events rely completely on our sponsors, so we'd like to give our huge thanks to the following:
      </div>

      <div className="flex flex-wrap -mx-2">
        {data.allMarkdownRemark.nodes.map(sponsor => (
          <div key={sponsor.id} className="w-full sm:w-1/2 mb-4 overflow-hidden px-2">
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
    </Layout>
  );
}

export const pageQuery = graphql`
query SponsorsQuery {
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