# Sanity Studio

Good news for you -- you probably don't need to touch this workspace. This is purely for handling and managing Sanity CMS.

Repo-wide conventions live in [`AGENTS.md`](/AGENTS.md).

## Working with Sanity

Sanity requires itself to be placed in its own folder (or technically speaking, "package"). This means that Sanity comes with its own set of commands & own development server. Sanity's documentation isn't the best, so a few relevant commands are documented here:

- `bun run dev` - Runs Sanity's development server
- `bun run build` - Builds the current Sanity configuration to a static bundle
- `bun run preview` - Previews the production build
- `bun run type-check` - TypeScript type checking via `tsc --noEmit`
- `bun run deploy` - Push Sanity changes to the cloud
- `bun run deploy-graphql` - Push GraphQL API changes to the cloud

You really only need to worry about `bun run dev` and `bun run deploy`.

You can find more detail [here](https://www.sanity.io/docs/cli-reference).

## Tooling caveats

- This workspace defines no `lint`, `test`, or `format:check` script. Turbo skips workspaces that lack the script being run, so `bun run lint` and `bun run test` at the root do **not** cover this workspace.
- `package.json` carries its own `prettier` key (`semi: false`, `printWidth: 100`, `bracketSpacing: false`), which overrides the root `.prettierrc` for every file here. That is why the code in this workspace looks different from the rest of the repo.

## Variables

Some variables have overlapping names. The differences should be extremely clear given documentation and context, but for the sake of context, they are documented here:

- article = news article = Sanity Document
- excerpt = summary

## Published article languages

`news` and `career` documents have a `language` (`en` or `es`) and an optional
`translationGroup`. The website treats existing documents without `language`
as English. This change does not modify production content or require a bulk
backfill.

To publish a Spanish translation:

1. Use the English document's published `_id` as the translation group, or set
   the same stable group identifier on both documents.
2. Create a separate Spanish document with `language: es`, that group, its own
   content, and its desired slug. Slugs are unique within a language, so the
   two documents may use the same slug.
3. Review and publish the Spanish document. A draft does not create a Spanish
   public route, hreflang alternate, or sitemap entry.

English-only articles remain visible on Spanish lists with an availability
notice and a final English link. Missing Spanish article URLs deliberately
redirect to the English publication. Existing legacy documents can receive
`language: en` when next edited; review any proposed bulk backfill before
writing to production.
