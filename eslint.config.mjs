import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // ignoreRestSiblings keeps `const { lastSponsorDate, ...rest } = sponsor` legal —
      // that destructure is how this codebase omits a field, not an oversight.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: [
      'node_modules',
      '.next',
      'out',
      'public/data',
      'src/payload-types.ts',
      'src/app/(payload)/admin/importMap.js',
      'docs/**',
    ],
  },
];
