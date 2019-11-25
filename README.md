
# Sitecore User Group UK

<a href="https://scug.co.uk/">www.scug.co.uk</a>

[![Netlify Status](https://api.netlify.com/api/v1/badges/b654c94e-08a6-4b79-b443-7837581b1d8d/deploy-status)](https://app.netlify.com/sites/gatsby-starter-netlify-cms-ci/deploys)

## Technology
Built with [Gatsby v2](https://www.gatsbyjs.org/blog/2018-09-17-gatsby-v2/), and [Netlify CMS](https://www.netlifycms.org): **[Demo Link](https://gatsby-netlify-cms.netlify.com/)**.

It follows the [JAMstack architecture](https://jamstack.org) by using Git as a single source of truth, and [Netlify](https://www.netlify.com) for continuous deployment, and CDN distribution.

## Prerequisites

- Node v10.16.0 or higher
- [Gatsby CLI](https://www.gatsbyjs.org/docs/)

### Access Locally
```
Fork from https://github.com/steviemcg/scuguk 

$ cd [REPO_NAME]  
$ npm i  
$ npm run start
```
To test the CMS locally, you'll need run a production build of the site:
```
$ npm run build
$ npm run serve
```

## Debugging
Windows users might encounter ```node-gyp``` errors when trying to npm install.
To resolve, make sure that you have both Python 2.7 and the Visual C++ build environment installed.
```
npm config set python python2.7
npm install --global --production windows-build-tools
```

[Full details here](https://www.npmjs.com/package/node-gyp 'NPM node-gyp page')


## Contributing

Hey, there! 👋 Any and all contributions are welcome.

To lend a helping hand:

- [Fork the repository](https://help.github.com/articles/fork-a-repo/)
- Make your desired changes
- [Create a pull request](https://help.github.com/articles/creating-a-pull-request/)

