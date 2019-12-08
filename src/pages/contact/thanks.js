import React from 'react'
import { Helmet } from "react-helmet"
import { Link } from 'gatsby'
import Layout from '../../components/Layout/layout'
import Hero from '../../components/Hero/hero'

export const ThanksPageTemplate = () => (
  <>
    <Hero heading="Thanks!" theme={"green"} small={true} />
    <div role="main">
      <div className="container">
        <div className="theme__box theme__box--small theme__box--white">
          <div className="container">
            <div className="content">
              <h2>Success!</h2>
              <p>Thanks for submitting the Contact Form, we've got your details and will be in touch soon!</p>
              <div className="theme__box-button">
                <Link className="button" to="/">
                  Go Back
              </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
)

const ThanksPage = () => {
  return (
    <>
      <Helmet>
        <title>Thanks!</title>
        <meta name="description" content="Thanks for getting in touch" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Layout>
        <ThanksPageTemplate />
      </Layout>
    </>
  )
}

export default ThanksPage