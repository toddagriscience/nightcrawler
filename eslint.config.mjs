// Copyright © Todd Agriscience, Inc. All rights reserved.

import licenseHeader from "eslint-plugin-license-header";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// Normalize plugin exports
const licenseHeaderPlugin = licenseHeader?.default ?? licenseHeader;

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    "**/node_modules/**",
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/next-env.d.ts",
    "**/.storybook/**",
    "**/storybook-static/**",
    "**/playwright.config.ts",
    "**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)", // Ignore all story files
    "**/studio/**",
    "**/vitest.config.js",
    "**/vitest.shims.d.ts",
    "!.storybook",
  ]),
  {
    plugins: {
      "license-header": licenseHeaderPlugin,
    },
    rules: {
      "license-header/header": [2, "./license-header.txt"],
    },
  },
]);

export default eslintConfig;
