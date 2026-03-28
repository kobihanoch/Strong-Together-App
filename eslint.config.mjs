import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import tseslint from "typescript-eslint";

const tsRecommended = tseslint.configs.recommended.map((config) => ({
  ...config,
  files: ["**/*.{ts,tsx}"],
}));

export default defineConfig([
  {
    ignores: ["node_modules/**", ".expo/**", "dist/**", "coverage/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ["**/*.{test,spec}.{js,mjs,cjs,jsx,ts,tsx}", "tests/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: { ...globals.jest },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ...js.configs.recommended,
  },
  {
    files: ["**/*.{jsx,tsx}"],
    ...pluginReact.configs.flat.recommended,
  },
  ...tsRecommended,

  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
]);
