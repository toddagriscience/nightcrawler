# nightcrawler

This is the main repository for both the marketing site and dashboard for [toddagriscience.com](https://toddagriscience.com).

## Documentation

Due to this repository being a monorepo, documentation for each workspace is contained in the respective `README.md` file. Additionally, you can refer to [Colossus](https://github.com/toddagriscience/colossus), our repository specifically for documentation, or the `.github` folder for more information.

## Quick Start

### Prerequisites

- **Node.js**: 18.0.0 or higher
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
- `apps/sanity` contains the Sanity Studio.
- `packages/db` contains the shared database schema, queries, migrations, and local DB tooling.

5. **Setup environment variables**

Copy any required environment variables from `apps/site/env.example` to `apps/site/.env.local` and update any empty values as necessary.

**If you need to use a database**: refer to `CONTRIBUTING.md`'s `First-Time Setup`.

6. **Start development server**

   ```bash
   bun run dev:site
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
bun validate
```
