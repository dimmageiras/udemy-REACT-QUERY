import js from "@eslint/js";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import testingLibrary from "eslint-plugin-testing-library";
import vitest from "eslint-plugin-vitest";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", ".eslintrc.cjs"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...vitest.environments?.env?.globals,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          paths: ["src"],
        },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
      "simple-import-sort": simpleImportSort,
      "testing-library": testingLibrary,
      vitest,
      "@tanstack/query": tanstackQuery,
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...jsxA11y.configs.recommended.rules,
      ...vitest.configs.recommended.rules,
      ...testingLibrary.configs.react.rules,
      ...tanstackQuery.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,

      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // we're using TypeScript here, not propTypes!
      "react/prop-types": "off",

      // obscure error that we don't need
      "react/display-name": "off",

      // to avoid "no-unused-vars" warnings in function type declarations
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",

      // imports
      "import/prefer-default-export": 0,
      "import/no-anonymous-default-export": 0,

      // sort alias imports that start with `@` separately from modules that start with `@`
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [["^\\u0000"], ["^@?\\w"], ["^@src", "^@shared"], ["^\\."]],
        },
      ],
      "simple-import-sort/exports": "warn",
      "sort-imports": "off",
      "import/order": "off",

      // eliminate distracting red squiggles while writing tests
      "vitest/expect-expect": "off",
    },
  },
];
