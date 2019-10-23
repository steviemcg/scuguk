import React from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import image from "../images/received-message.svg";

export default function NewsletterPage() {
  return (
    <Layout>
      <SEO
        keywords={[`sitecore`, `user group`, `london`, `bristol`, `cardiff`, `manchester`, `leeds`, `uk`, `united kingdom`, `england`, `wales`]}
        title="Newsletter"
      />

      <section className="flex flex-col md:flex-row items-center">
        <div className="md:w-2/3 md:mr-8">
          <h1 className="text-xl mb-2">Sign up to our newsletter</h1>

          <div className="mb-4 text-gray-600">
            Fill in your details below and we'll notify you when there's a User Group coming up in your area.
          </div>

          <div id="mc_embed_signup">
            <div dangerouslySetInnerHTML={{
              __html: `
              <link href="//cdn-images.mailchimp.com/embedcode/classic-10_7.css" rel="stylesheet" type="text/css" />
              <form action="https://scug.us15.list-manage.com/subscribe/post?u=2f953a15d3e2810c056751401&amp;id=8542525dce" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>

              <div id="mc_embed_signup_scroll">

                <div class="mc-field-group">
                  <label for="mce-EMAIL">Email Address </label>
                  <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL" />
                </div>
                <div class="mc-field-group">
                  <label for="mce-FNAME">First Name </label>
                  <input type="text" value="" name="FNAME" class="required" id="mce-FNAME" />
                </div>
                <div class="mc-field-group">
                  <label for="mce-LNAME">Last Name </label>
                  <input type="text" value="" name="LNAME" class="required" id="mce-LNAME" />
                </div>
                <div class="mc-field-group">
                  <label for="mce-COMPANY">Company </label>
                  <input type="text" value="" name="COMPANY" class="required" id="mce-COMPANY" />
                </div>
                <div class="mc-field-group">
                  <label for="mce-JOBTITLE">Job Title </label>
                  <input type="text" value="" name="JOBTITLE" class="required" id="mce-JOBTITLE" />
                </div>
                <div class="mc-field-group input-group">
                  <strong>Which regions would you like updates for? </strong>
                  <ul><li><input type="checkbox" value="1" name="group[6563][1]" id="mce-group[6563]-6563-0" /><label for="mce-group[6563]-6563-0">London</label></li>
                    <li><input type="checkbox" value="2" name="group[6563][2]" id="mce-group[6563]-6563-1" /><label for="mce-group[6563]-6563-1">Bristol</label></li>
                    <li><input type="checkbox" value="4" name="group[6563][4]" id="mce-group[6563]-6563-2" /><label for="mce-group[6563]-6563-2">Cardiff</label></li>
                    <li><input type="checkbox" value="8" name="group[6563][8]" id="mce-group[6563]-6563-3" /><label for="mce-group[6563]-6563-3">Manchester</label></li>
                    <li><input type="checkbox" value="16" name="group[6563][16]" id="mce-group[6563]-6563-4" /><label for="mce-group[6563]-6563-4">Leeds</label></li>
                  </ul>
                </div>
                <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_2f953a15d3e2810c056751401_8542525dce" tabindex="-1" value="" /></div>
                <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button" /></div>
              </div>
            </form>
            `}} />
          </div>
        </div>
        <figure className="w-2/3 md:w-1/3">
          <img alt="Sign up for our newsletter" src={image} />
        </figure>
      </section>
    </Layout>
  );
}