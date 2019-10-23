import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
// https://cobwwweb.com/how-to-use-netlify-forms-with-gatsby

function ContactPage() {
  return (
    <Layout>
      <SEO
        keywords={[`sitecore`, `user group`, `london`, `bristol`, `cardiff`, `manchester`, `leeds`, `uk`, `united kingdom`, `england`, `wales`]}
        title="Contact"
      />
      <section>
        <form name="Contact Form" className="mx-auto md:w-1/2" method="POST"
          data-netlify="true" netlify-honeypot="company"
          action="/contact-thank-you">
          <input type="hidden" name="form-name" value="Contact Form" />
          <p className="mb-8">
            Do you have any questions or feedback? Are you interested in sponsoring or hosting an event?
            Do you have a great idea for a presentation?
          </p>

          <p className="mb-8">
            Leave us a message and we'll get back to you as soon as possible.
          </p>

          <label
            className="block font-bold mb-2 text-xs uppercase"
            htmlFor="first-name"
          >
            First Name
          </label>

          <input
            className="appearance-none block bg-gray-200 mb-6 px-3 py-2 rounded-md text-gray-700 w-full"
            id="first-name"
            name="first-name"
            placeholder="Stephen"
            type="text"
          />

          <label
            className="block font-bold mb-2 text-xs uppercase"
            htmlFor="last-name"
          >
            Last Name
          </label>

          <input
            className="appearance-none block bg-gray-200 mb-6 px-3 py-2 rounded-md text-gray-700 w-full"
            id="last-name"
            name="last-name"
            placeholder="Pope"
            type="text"
          />

          <label
            className="block font-bold mb-2 text-xs uppercase"
            htmlFor="email"
          >
            Email
          </label>

          <input
            className="appearance-none block bg-gray-200 mb-6 px-3 py-2 rounded-md text-gray-700 w-full"
            id="email"
            name="email"
            placeholder="email@address.com"
            type="email"
          />

          <input
            className="appearance-none hidden block bg-gray-200 mb-6 px-3 py-2 rounded-md text-gray-700 w-full"
            id="company"
            name="company"
            placeholder="Company"
            type="text"
          />

          <label
            className="block font-bold mb-2 text-xs uppercase"
            htmlFor="message"
          >
            Message
          </label>

          <textarea
            className="appearance-none bg-gray-200 mb-6 px-3 py-2 rounded-md text-gray-700 w-full"
            id="message"
            name="message"
            placeholder="Your message..."
            rows="8"
          />

          <button className="border-b-4 border-gray-800 hover:border-gray-700 bg-gray-700 hover:bg-gray-600 font-bold px-4 py-2 rounded text-sm text-white">
            Submit
          </button>
        </form>
      </section>
    </Layout>
  );
}

export default ContactPage;
