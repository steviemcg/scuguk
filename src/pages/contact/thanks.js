import React from 'react'
import { Helmet } from "react-helmet"
import { Link } from 'gatsby'
import Layout from '../../components/Layout/layout'
import Hero from '../../components/Hero/hero'

export const ThanksPageTemplate = () => (
  <>
    <Hero Heading="Thanks!" />
    <div className="pageContent pageContent__noAnimate contact">
      <div className="pageContent__inner">
        <div className="theme__box theme__box--small">
          <div className="container">
            <div className="content">
              <h2>Success!</h2>
              <p>Thanks for submitting the Contact Form, we've got your details and will be in touch soon!</p>
              <Link className="btn" to="/">
                Go Back
              </Link>
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