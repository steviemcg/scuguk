import React from 'react'
import Helmet from 'react-helmet'
import Header from '../Header/header'
import Footer from '../Footer/footer'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../theme/index.scss'

import { useStaticQuery, graphql } from "gatsby"

const TemplateWrapper = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      archive: allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "event-page"}}, fields: {isFuture: {eq: false}}}, sort: {order: ASC, fields: frontmatter___date}) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              externalLink
            }
          }
        }
      }
      future: allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "event-page"}}, fields: {isFuture: {eq: true}}}, sort: {order: ASC, fields: frontmatter___date}) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              externalLink
            }
          }
        }
      }
    }
  `)

  return (
    <>
      <Helmet>
        <html lang="en" />

        <link
          rel="icon"
          type="image/png"
          href="/img/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/img/favicon-16x16.png"
          sizes="16x16"
        />

        <meta charSet="utf-8" />
      </Helmet>
      <Header data={ data } />
      {children}
      <Footer />
    </>
  )
}

export default TemplateWrapper
