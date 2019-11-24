import React from 'react'
import Helmet from 'react-helmet'
import Header from '../Header/header'
import Footer from '../Footer/footer'

import '../../theme/index.scss'

const TemplateWrapper = ({ children }) => {
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
        <meta name="robots" content="noindex, nofollow" />
        
      </Helmet>
      <Header />   
      {children}
      <Footer />
    </>
  )
}

export default TemplateWrapper
