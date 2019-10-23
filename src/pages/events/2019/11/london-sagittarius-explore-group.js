import React from "react";

import Layout from "../../../../components/layout";
import SEO from "../../../../components/seo";
import location from "./london-sagittarius-explore-group/images/huckletree.jpg";

export default function EventPage() {
  return (
    <Layout>
      <SEO
        keywords={[`sitecore`, `user group`, `london`, `sagittarius`, `explore group`]}
        title="November 14, 2019 - Sponsored by Sagittarius and Explore Group"
      />

      <section>
        <img
          alt="Huckletree location"
          className="block mx-auto w-1/2"
          src={location}
        />


<p className="p-3">

        London’s Technical User Group is back with post-symposium goodness! 🙌🏼

</p>

<p className="p-3">
  Sponsors: Sagittarius<br/>
  Date: Thursday 14th November 2019<br/>
  Time: Arrival from 6 pm<br/>
  Presentations from 6:30pm<br/>
  Food: Beer &amp; pizzas provide by our friends at Explore 🍺🍕<br/>
</p>

<p className="p-3">
  Venue: Huckletree Shoreditch, enter via the main Alphabeta Building reception (14-18 Finsbury square). 
  You will be shown down the central staircase, which goes straight into our event space. ✨
</p>

<p className="p-3">

Speakers:<br/><br/>

*Paul Stephen, CEO @ Sagittarius - Highlights from Symposium 2019<br/><br/>

*Pieter Brinkman, Senior Director of Technical Marketing @ Sitecore - What's New in Sitecore Land?<br/>
Description: Join us for a ride through the land of Sitecore, and Pieter will show you all the new bits and pieces of the latest releases fit into the bigger picture. You’ll get a full overview of the Sitecore landscape and how our products work together. Highlighting what’s new since last Symposium and what’s coming in the upcoming release, all within the context of the full landscape and added value.

<br/><br/>
*Alex Washtell, Director @ Kasaku - Sitecore PowerShell Extensions: Sitecore's Swiss Army knife<br/>
Description: Sitecore PowerShell Extensions is now considered an essential Sitecore module, but it's still underused. Find out how you can make giant productivity improvements in your Sitecore solutions with simple steps, and quickly deliver new functionality to your clients in minutes, not hours. Includes features from the just-released version 6.0.

<br/><br/>
* Rob Earlam, Technical Evangelist of Sitecore Experience Commerce @ Sitecore - So you've installed XC, now what?<br/>
Description: This session covers the gap we currently have with existing XC enablement. We have lots of documentation covering how to install XC locally and also how to develop plug-ins, but there are some steps that need to be performed between these two actions. In this session, we will cover how to set up an XC solution to follow Helix guidelines. This solution structure will contain code that needs to be published to each of the required publishing targets (XP & XC). See how to use Azure DevOps to create a simple CI pipeline to deploy this solution out to an Azure PaaS environment.
</p>

<p className="p-3">
Agenda<br/>
6:00 - arrival<br/>
6:30 - first speaker<br/>
7:00 - second speaker<br/>
7:30 - BREAK<br/>
8:00 - third speaker<br/>
8:30 - fourth speaker<br/>
Networking

</p>
      </section>
    </Layout>
  );
}