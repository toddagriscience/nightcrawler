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

4. **Navigate into correct folder**

Unless you're directly working on the CMS (located in `/sanity-studio`), the majority of your work will take place in the `/frontend` folder. Consequently, the rest of this section will assume that you're operating out of the `/frontend` folder.

5. **Setup environment variables**

Copy any and all environment variables from `envexample.md`. Copy:

6. **Start development server**

   ```bash
   bun dev
   ```

7. **Open in browser**

   ```
   http://localhost:3000
   ```

### Storybook

8. **Start Storybook**

   ```
   bun storybook
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
