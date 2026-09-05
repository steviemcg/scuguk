import path from 'path';
import { fileURLToPath } from 'url';

import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Pin the file-tracing root to this directory. Without it, running from a worktree
  // under .claude/worktrees/ makes Next walk up to the main checkout, find its lockfile
  // and infer that as the root.
  outputFileTracingRoot: dirname,

  // SVGs are imported as React components across src/components. The rule has to be
  // declared twice: `turbopack` is what `next dev` and `next build` actually use, and
  // `webpack` is the fallback for `next build --webpack`. Next detects a custom .svg rule
  // and drops .svg from next-image-loader itself, so no other change is needed.
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: true });
