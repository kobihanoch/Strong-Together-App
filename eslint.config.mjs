import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

const tsRecommended = tseslint.configs.recommended.map((config) => ({
  ...config,
  files: ['**/*.{ts,tsx}'],
}));

export default defineConfig([
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**', 'coverage/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ['**/*.{test,spec}.{js,mjs,cjs,jsx,ts,tsx}', 'tests/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: { ...globals.jest },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...js.configs.recommended,
  },
  {
    files: ['**/*.{jsx,tsx}'],
    ...pluginReact.configs.flat.recommended,
  },
  ...tsRecommended,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
]);
