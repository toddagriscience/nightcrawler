// Copyright © Todd Agriscience, Inc. All rights reserved.

import licenseHeader from "eslint-plugin-license-header";
import drizzle from "eslint-plugin-drizzle";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import noSecrets from "eslint-plugin-no-secrets";
import vitest from "@vitest/eslint-plugin";
import * as espree from "espree";

// Normalize plugin exports
const licenseHeaderPlugin = licenseHeader?.default ?? licenseHeader;

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      parser: espree,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      parser: espree,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "script",
      },
    },
  },
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
      "no-secrets": noSecrets,
      vitest,
      drizzle,
    },
    settings: {
      react: {
        version: "19.2",
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      ...drizzle.configs.recommended.rules,
      "license-header/header": [2, "./license-header.txt"],
      "no-secrets/no-secrets": "error",
    },
  },
]);

export default eslintConfig;
