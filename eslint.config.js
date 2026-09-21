import {
  coreConfig,
  eslintCommentsPluginConfig,
  jsdocPluginConfig,
  openreachtechPluginConfig,
  stylisticPluginConfig,
} from './kit/eslint/eslint-config/index.js'

export default [
  coreConfig,

  stylisticPluginConfig,

  jsdocPluginConfig,

  eslintCommentsPluginConfig,

  openreachtechPluginConfig,

  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
      },
      sourceType: 'module',
    },
  },

  {
    ignores: [
      '**/node_modules/**',

      // Scratch space. `.gitignore` already excludes it, but flat config does
      // not read `.gitignore`, so without this entry a throwaway script left
      // here fails `npm run lint` locally while CI — which never checks out an
      // ignored directory — stays green, and nothing points at the cause.
      '.scratch/',

      // Implementation repositories. Each one lints itself, under its own
      // config. A repository adopted under its own directory name matches
      // neither pattern below, so /hn-setup appends one literal entry per
      // declared `Directory` right after them.
      '*-backend*/',
      '*-frontend*/',

      // The vendored kit, and the copy postinstall equips from it. The skills and
      // agents came in from @openreachtech/hora and the four
      // @openreachtech/hora-skills-ort-* packages and are held here as source, so
      // they read like a dependency rather than like code written here — some of
      // them ship .js/.mjs/.cjs, held to their authors' conventions, not ours.
      // All three directories are ignored whole, the way .gitignore does it: a
      // denylist written against the names in use today says nothing when it
      // stops matching. kit/scripts/ is authored here and stays linted.
      'kit/skills/',
      'kit/eslint/',
      'kit/ecosystem/',
      '.claude/agents/',
      '.claude/skills/',
    ],
  },
]
