import React from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout/layout'

export const PrivacyPolicyPageTemplate = () => (
  <>
    <div className="container">
    <h1>Welcome to our Privacy Policy</h1>

<p>Last updated: February 13, 2020</p>

<p>It is Sitecore User Group UK's policy to respect your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to <a href="https://scug.co.uk/">https://scug.co.uk/</a> (hereinafter, "us", "we", or "https://scug.co.uk/"). We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website. We have adopted this privacy policy ("Privacy Policy") to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties. This Privacy Policy applies only to information we collect through the Website and does not apply to our collection of information from other sources.</p>

<h2>Website Visitors</h2>
<p>Like most website operators, Sitecore User Group UK collects non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request. Sitecore User Group UK's purpose in collecting non-personally identifying information is to better understand how Sitecore User Group UK's visitors use its website. From time to time, Sitecore User Group UK may release non-personally-identifying information in the aggregate, e.g., by publishing a report on trends in the usage of its website.</p>
<p>Sitecore User Group UK also collects potentially personally-identifying information like Internet Protocol (IP) addresses for logged in users and for users leaving comments on https://scug.co.uk/ event pages. Sitecore User Group UK only discloses logged in user and commenter IP addresses under the same circumstances that it uses and discloses personally-identifying information as described below.</p>
			
<h2>Gathering of Personally-Identifying Information</h2>
<p>Certain visitors to Sitecore User Group UK's websites choose to interact with Sitecore User Group UK in ways that require Sitecore User Group UK to gather personally-identifying information. The amount and type of information that Sitecore User Group UK gathers depends on the nature of the interaction. For example, we ask visitors who sign up at https://scug.co.uk/ to provide a username and email address.</p>
			
<h2>Security</h2>
<p>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>
			
<h2>Links To External Sites</h2>
<p>Our Service may contain links to external sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy and terms and conditions of every site you visit.</p>
<p>We have no control over, and assume no responsibility for the content, privacy policies or practices of any third party sites, products or services.</p>
			
			
<h2>Protection of Certain Personally-Identifying Information</h2>
<p>Under certain circumstances, the Sitecore User Group UK may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</p>
<p>If you are a registered user of https://scug.co.uk/ and have supplied your email address, Sitecore User Group UK may occasionally send you an email to keep you up to date with what's going on with Sitecore User Group UK and the events. If you send us a request (for example via a email or form), we reserve the right to publish it in order to help us clarify or respond to your request. Sitecore User Group UK takes all measures reasonably necessary to protect against the unauthorized access, use, alteration or destruction of potentially personally-identifying and personally-identifying information.</p>
			
<h2>Aggregated Statistics</h2>
<p>Sitecore User Group UK may collect statistics about the behavior of visitors to its website. Sitecore User Group UK may display this information publicly or provide it to others. However, Sitecore User Group UK does not disclose your personally-identifying information.</p>
			
<h2>Cookies</h2>
<p>To enrich and perfect your online experience, Sitecore User Group UK uses "Cookies", similar technologies and services provided by others to display personalized content, appropriate advertising and store your preferences on your computer.</p>
<p>A cookie is a string of information that a website stores on a visitor's computer, and that the visitor's browser provides to the website each time the visitor returns. Sitecore User Group UK uses cookies to help Sitecore User Group UK identify and track visitors, their usage of https://scug.co.uk/, and their website access preferences. Sitecore User Group UK visitors who do not wish to have cookies placed on their computers should set their browsers to refuse cookies before using Sitecore User Group UK's websites, with the drawback that certain features of Sitecore User Group UK's websites may not function properly without the aid of cookies.</p>
<p>By continuing to navigate our website without changing your cookie settings, you hereby acknowledge and agree to Sitecore User Group UK's use of cookies.</p>
			
<h2>Privacy Policy Changes</h2>
<p>We may update our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>
<p>We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.</p>
<p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
			
<h2>Contact Information</h2>
<p>If you have any questions about this Privacy Policy, please contact us via <a href="mailto:info@scug.co.uk">email</a>.</p>
    </div>
  </>
)

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Sitecore User Group UK</title>
        <meta name="description" content="Sitecore User Group UK Privacy Policy" />
      </Helmet>
      <Layout>
        <PrivacyPolicyPageTemplate />
      </Layout>
    </>
  )
}

export default PrivacyPolicyPage