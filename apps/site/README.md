# Todd Agriscience

A Next.js site for the Todd Agriscience's marketing site and customer platform. Please follow the base [README.md](/README.md) in the root directory for general information.

Repo-wide conventions live in [`AGENTS.md`](/AGENTS.md). Development context for this workspace lives in [`CLAUDE.md`](./CLAUDE.md).

## Notes

A few important things to mention:

- "the marketing site" refers to anything under the `[locale]` route; i.e. anything that is internationalized.
- Please use the logging function from `./src/lib/logger`

## Development Scripts

### Core Commands

- `bun dev` - Start development server with Turbopack
- `bun run build` - Build for production
- `bun start` - Start production server

### Quality Assurance

- `bun ci` - type-check → lint → unit tests → build
- `bun validate` - format:check → ci
- `bun type-check` - TypeScript type checking via tsc
- `bun lint` - ESLint code quality check
- `bun lint:fix` - Auto-fix ESLint issues
- `bun prelint:fix` - Adds the appropriate license header to all files

#### A note on linting

We use a plugin that helps catch/find strings that might be secrets or credentials in plaintext, called [`eslint-plugin-no-secrets`](https://github.com/nickdeis/eslint-plugin-no-secrets). This normally works without any trouble, but it'll occasionally go off incorrectly. If this happens, paste the following comment above the chunk of code that's giving you an ESLint error:

```ts
// eslint-disable-next-line no-secrets/no-secrets
```

### Testing

- `bun run test` - Run Vitest unit tests
- `bun run test:watch` - Run tests in watch mode
- `bun run test:coverage` - Generate test coverage report

### Code Formatting

- `bun format` - Format code with Prettier
- `bun format:check` - Check code formatting

### Component Development

- `bun storybook` - Start Storybook component explorer
- `bun build-storybook` - Build Storybook for production

### Miscellaneous

- `bun run --filter @nightcrawler/db db:local:up` - Start local Postgres 18 via Docker Compose
- `bun run --filter @nightcrawler/db db:local:migrate` - Apply Drizzle migrations to local Postgres
- `bun run --filter @nightcrawler/db db:local:seed` - Seed local Postgres with starter data
- `bun run --filter @nightcrawler/db db:local:init` - Start local Postgres, migrate, then seed
- `bun run --filter @nightcrawler/db db:local:down` - Stop and remove local Docker Compose services

### Local Database (Postgres 18)

This project uses the shared database workspace in [`packages/db`](../../packages/db), including the Docker Compose file at [`packages/db/docker-compose.yml`](../../packages/db/docker-compose.yml).

1. Copy env vars from `env.example` in this workspace and ensure `LOCAL_DATABASE_*` values match your desired local DB.
2. Run `bun run --filter @nightcrawler/db db:local:init` to start Postgres, apply migrations, and seed starter rows.
3. Run `bun run --filter @nightcrawler/db db:local:down` when done.

## Tech Stack & Dependencies

As mentioned, Nightcrawler is a Next.js project. Here are a few noteworthy (and non-exhaustive) list of packages/tools that we use:

- Next.js with App Router & Turbopack
- TypeScript
- Tailwind
- ShadCN - UI library/design system
- Lucide - Icon library
- React Icons - Icon library, used specifically for brand logos
- next-intl - Internationalization for Next.js. Used only on the marketing site.
- Vitest + React Testing Library (RTL) - Testing
- Storybook - Not frequently used at the moment, but still

And a few miscellaneous packages:

- Various other UI packages: Framer Motion, Lenis, Embla Carousel, etc.
- Developer Experience (DE)/Code Quality - ESLint, Prettier, Husky, & GitHub Actions

In the same vein as UI tools, nightcrawler uses the `Neue Hass Unica` font for the majority of the site as well as `Utah WGL Condensed` for any wordmarks.

## Project Structure

Folders, what they do, and why they exist.

- `./public` - Static files. See [Next.js's documentation](https://nextjs.org/docs/pages/api-reference/file-conventions/public-folder).
- `./coverage` - Coverage reports from Vitest. Included in `.gitignore`
- `./scripts` - Arbitrary scripts
- `./src` - Source code! Under `./src` is:
  - `/app` - Next.js's app folder
  - `/components `- Sitewide shared components
  - `/context` - Theme context logic
  - `/data` - Static data that shouldn't be publicly accessible. Rarely used
  - `/i18n` - Logic/configuration for `next-intl`
  - `/instrumentation` - New Relic agent wiring, loaded via `src/instrumentation.ts`
  - `/lib` - Non-UI related sitewide logic (ex. hooks)
  - `/messages` - Internationalized message files, one directory per namespace
  - `/proxy` - Proxy configuration and tests, loaded via `src/proxy.ts` (Next.js 16's replacement for `middleware.ts`)
  - `/test` - Extra utility for testing

### Architecture (Or where do I put components?)

This ASCII chart should give you a brief overview of the architecture of nightcrawler. If possible, prefer making logic as generic as possible and placing that logic in `./src/lib`, `.src/components`, or a similar folder. Co-located components, such as `login-modal.tsx` in the diagram below, should be reserved for components that are not generic enough to be used site-wide.

Logic that isn't generic enough to be placed in one of the "generic" folders (`./src/lib`) tends to be very common -- don't panic if you feel like you're not abstracting enough.

```
.
└── src/
    ├── app/
    │   └── login/
    │       ├── page.test.tsx
    │       ├── page.tsx
    │       └── components/
    │           ├── login-modal.test.tsx
    │           └── login-modal.tsx
    ├── components/
    │   ├── ui/
    │   │   └── ...
    │   └── common/
    │       ├── button.test.tsx
    │       └── button.tsx
    ├── lib/
    │   ├── types/
    │   │   └── auth.ts
    │   ├── utils/
    │   │   └── ...
    │   └── actions/
    │       └── auth.ts
    └── ...
```

The database schema is not in this workspace — it lives in [`packages/db`](../../packages/db) and is consumed via `@nightcrawler/db`.

Note that there are some older pieces of logic (namely the components for the landing page) that do not abide by this. We ask you to politely ignore this for now -- it'll be refactored in the future at some point.

## Testing Strategy

We're a startup trying to ship as fast as possible. For better or for worse, tests are not the most important thing in the world. Thus, at the bare minimum, a test should be written to ensure a certain functionality accomplishes the minimum required functionality of a page. Ex. a page file should have a test that ensures that it renders.

However, if possible, aim for 100% test coverage. The above is, again, the bare minimum requirement.

## Deployment

We're currently deploying the site on Vercel, and thus, you don't need to worry about deploying anything manually. Vercel's bot will handle preview deployments as well as production deployments. These are private by default but can have access requested.

## Configuration

### Environment Variables

You can copy environment variables from `env.example` into your own `.env.local` file.

### Internationalization

All internationalization is handled via `next-intl`.

If you'd like to:

- Add a new language: refer to `./src/lib/locales.ts` and `./src/i18n/config.ts`, then update any necessary `next-intl` message files accordingly (see next)
- Add a new translation: refer to the `./src/messages/` folder. Each namespace is its own directory containing one JSON file per locale, and a new namespace must be registered in `./src/i18n/message-files.ts` before it loads.

### Styling & Branding

We utilize multiple different UI libraries as well as Tailwind v4. Global styles are contained in `./src/app/globals.css`

#### Background Colors

The site reads its background from two separate CSS variables, both currently `#ffffff`:

- **Marketing Site Background**: Used for all unauthenticated routes (marketing site pages under `[locale]` routes). Defined as the `--background` CSS variable in `globals.css`.
- **Platform Background**: Used for all authenticated routes (platform pages like `/`, `/account`, etc.). Defined as the `--background-platform` CSS variable in `globals.css` and can be used with the `bg-background-platform` Tailwind class.

Both colors can be modified in `./src/app/globals.css` in the `:root` CSS variables section, which also records the historical values each variable used to hold.

## 📝 Contributing

Refer to `CONTRIBUTING.md`

## License

Private - Todd Agriscience, Inc.
