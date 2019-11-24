import React from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout/layout'

export const NotFoundPageTemplate = () => (
  <>
      <div className="container notFound" style={{textAlign: "center"}}>
        <img style={{width: "620px"}} alt="Ghost getting abducted by aliens" src="/img/abduction-illustration.svg" />
        <h3>
          Looks like this page is a ghost that got abducted by aliens...
        </h3>
      </div>
  </>
 )

const NotFoundPage = () => {
  return (
    <>   
      <Helmet>
        <title>404: Not found</title>
        <meta name="description" content="Abducted by aliens?" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Layout>
        <NotFoundPageTemplate />
      </Layout>
    </>
  )
}

export default NotFoundPage
