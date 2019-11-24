import React from 'react'
import { Helmet } from "react-helmet"
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout/layout'
import Hero from '../components/Hero/hero'
import EventsList from '../components/EventsList/eventsList'

export const EventsListPageTemplate = ({
  heading
}) => (
  <>
    <Hero heading={heading}/>   
    <main>
        <div class="container">
            <EventsList />
        </div>
    </main>
  </>
)

EventsListPageTemplate.propTypes = {
    heroImage: PropTypes.string,
    heading: PropTypes.string
}


const EventsListPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark
  return (
    <>    
      <Helmet>
        <title>{frontmatter.meta.metaTitle}</title>
        <meta name="description" content={frontmatter.meta.metaDescription} />
      </Helmet>
      <Layout>
        <EventsListPageTemplate
          heroImage={frontmatter.heroImage}
          heading={frontmatter.heading}
        />
      </Layout>
    </>
  )
}

EventsListPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default EventsListPage

export const pageQuery = graphql`
  query EventsListPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "events-list-page" } }) {
      frontmatter {
        heroImage
        heading
        meta{
          metaTitle
          metaDescription
        }
      }
    }
  }
`