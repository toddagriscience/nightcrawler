# Sanity Studio

Sanity requires itself to be placed in its own folder (or technically speaking, "package"). This means that Sanity comes with its own set of commands & own development server. Sanity's documentation isn't the best, so a few relevant commands are documented here:

- `bun run dev` - Runs Sanity's development server
- `bun run start` - Previews the production build
- `bun run build` - Builds the current Sanity configuration to a static bundle
- `bun run deploy` - Push Sanity changes to the cloud
- `bun run deploy-graphql` - Push GraphQL API changes to the cloud

You really only need to worry about `bun run dev` and `bun run deploy`.

You can find more detail [here](https://www.sanity.io/docs/cli-reference).

## Variables

Some variables have overlapping names. The differences should be extremely clear given documentation and context, but for the sake of context, they are documented here:

- article = news article = Sanity Document
- excerpt = summary
