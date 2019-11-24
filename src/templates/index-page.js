import React from 'react'
import { Helmet } from "react-helmet"
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout/layout'
import Box from '../components/Box/box'
import FullScreenHero from '../components/FullScreenHero/fullScreenHero'

export const IndexPageTemplate = ({
  heroImage,
  heading,
  box1,
  box2,
  box3
}) => (
  <>
    <FullScreenHero heroImage={heroImage} heading={heading} />
    <main> 
      <Box theme={"green"} heading={box1.heading} description={box1.description} linkPath={box1.linkPath} linkText={box1.linkText} />
      <Box theme={"red"} heading={box2.heading} description={box2.description} linkPath={box2.linkPath} linkText={box2.linkText} />
      <Box theme={"white"} heading={box3.heading} description={box3.description} linkPath={box3.linkPath} linkText={box3.linkText} />
    </main>
  </>
)

const IndexPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark
  return (
    <>
      <Helmet>
        <title>{frontmatter.meta.metaTitle}</title>
        <meta name="description" content={frontmatter.meta.metaDescription} />
      </Helmet>
      <Layout>
        <IndexPageTemplate
          heading={frontmatter.heading}
          heroImage={frontmatter.heroImage}
          box1={frontmatter.box1}
          box2={frontmatter.box2}
          box3={frontmatter.box3}
        />
      </Layout>
    </>
  )
}

IndexPageTemplate.propTypes = {
  heading: PropTypes.string,  
  heroImage: PropTypes.string,
  box1: PropTypes.object,
  box2: PropTypes.object,
  box3: PropTypes.object
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default IndexPage

export const pageQuery = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        meta{
          metaTitle
          metaDescription
        }
        heroImage
        heading
        box1{
          heading
          description
          background
          linkPath
          linkText  
        }
        box2{
          heading
          description
          background
          linkPath
          linkText  
        }
        box3{
          heading
          description
          background
          linkPath
          linkText  
        }
      }
    }
  }
`
