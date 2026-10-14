# nightcrawler

This is the main repository for both the marketing site and dashboard for [toddagriscience.com](https://toddagriscience.com).

## Documentation

Repo-wide conventions — naming, architecture, logging, commit and PR workflow — live in [`AGENTS.md`](AGENTS.md), which is the single source of truth. Workspace `README.md` files cover setup and commands for that workspace only.

Additionally, you can refer to [Colossus](https://github.com/toddagriscience/colossus), our repository specifically for documentation, or the `.github` folder for more information.

## Quick Start

### Prerequisites

- **Node.js**: 20.20.1 (see `.nvmrc`)
- **Bun**: Latest stable version

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/toddagriscience/Nightcrawler.git
   cd Nightcrawler
   ```

2. **Use correct Node.js version** (if using nvm)

   ```bash
   nvm use
   ```

3. **Install dependencies**

   ```bash
   bun install
   ```

4. **Choose the workspace you need**

- `apps/site` contains the Next.js marketing site and customer platform.
- `apps/internal` contains the Next.js internal dashboard for client advisors.
- `apps/sanity` contains the Sanity Studio.
- `packages/db` contains the shared database schema, queries, migrations, and local DB tooling.

5. **Setup environment variables**

Copy any required environment variables from `apps/site/env.example` to `apps/site/.env.local` and update any empty values as necessary.

**If you need to use a database**: refer to `CONTRIBUTING.md`'s `First-Time Setup`.

6. **Start development server**

   ```bash
   bun run dev:site      # marketing site + platform, port 3000
   bun run dev:internal  # internal dashboard, port 3100
   bun run dev:sanity    # Sanity Studio
   ```

7. **Open in browser**

   ```
   http://localhost:3000
   ```

### Storybook

8. **Start Storybook**

   ```bash
   bun run storybook
   ```

9. **Open Storybook in browser**
   ```
   http://localhost:6006
   ```

### First-Time Setup Verification

Run the full validation pipeline to ensure everything works:

```bash
bun run validate
```

This runs `format:check` → `type-check` → `lint` → `test` → `build` across every workspace.

To check for dead code and unused dependencies:

```bash
bun run knip
```
