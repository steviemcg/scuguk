import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout/layout";
import Hero from "../components/Hero/hero";
import ContactForm from "../components/ContactForm/contactForm";

export const ContactPageTemplate = ({ heading, description }) => (
  <>
    <Hero heading={heading} theme={"green"} small={true} />
    <main>
      <div className="container">
        <div className="theme__box theme__box--small theme__box--white">
          <div className="form">
            <p>{description}</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  </>
);

ContactPageTemplate.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string
};

const NewsletterPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;
  return (
    <>
      <Helmet>
        <title>{frontmatter.meta.metaTitle}</title>
        <meta name="description" content={frontmatter.meta.metaDescription} />
      </Helmet>
      <Layout>
        <ContactPageTemplate
          heading={frontmatter.heading}
          description={frontmatter.description}
        />
      </Layout>
    </>
  );
};

NewsletterPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object
    })
  })
};

export default NewsletterPage;

export const pageQuery = graphql`
  query ContactPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "contact-page" } }) {
      frontmatter {
        heading
        description
        meta {
          metaTitle
          metaDescription
        }
      }
    }
  }
`;
