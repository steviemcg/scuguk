# Sitecore User Group UK

Now with NextJS!

## Wishlist

- Add support for dietary requirements when booking attendance

## Getting Started

### Local Install 

1. cd to the project folder, e.g: `C:\Projects\scuguk\src`
2. run: `npm install --global yarn`
3. run: `yarn install`

### Local Development

1. run: `yarn prebuild` to copy over all the images 
2. run one of the following to start the development server:

```bash
yarn dev
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the Site.

**_Notes:_**
* Before you commit a new or updated event, run `yarn build` to generate all the files and then `yarn events` to generate the socials image. If you're updating an event with new speakers, you will need to delete the old generated event image _before_ rebuilding.
* You can use `<p className="alert alert-warning"></p>` in the `intro` field for a callout block, such as highlighting a change of venue.