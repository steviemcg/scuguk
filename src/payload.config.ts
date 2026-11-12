import path from 'path';
import { fileURLToPath } from 'url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { Events } from './collections/Events';
import { Locations } from './collections/Locations';
import { Media } from './collections/Media';
import { Speakers } from './collections/Speakers';
import { Sponsors } from './collections/Sponsors';
import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Media storage is opt-in on the presence of the token so that a fresh clone can run
// `yarn dev` against a local database with no Vercel account at all — uploads then land
// on local disk under `media/`. Deployed environments always have the token, because
// the Vercel Blob integration injects it. Do not "simplify" this to an unconditional
// plugin without giving local dev another way to boot.
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — Sitecore User Group UK',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor({}),
  collections: [Events, Speakers, Sponsors, Locations, Media, Users],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  plugins: blobToken
    ? [
        vercelBlobStorage({
          collections: { media: true },
          token: blobToken,
        }),
      ]
    : [],
  sharp,
});
