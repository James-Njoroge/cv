import js from "@eslint/js";
import next from "eslint-config-next";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

/**
 * Flat config (ESLint 9). `eslint-config-next` already supplies the React,
 * React Hooks, jsx-a11y and import plugins, so they are not re-registered here.
 */
export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      ".vercel/**",
      "next-env.d.ts",
      // Vendored design-system reference assets, not application source.
      "design/**",
      "**/*.jsx",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...next,
  {
    plugins: { "simple-import-sort": simpleImportSort },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "no-console": "error",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "no-tabs": ["error", { allowIndentationTabs: true }],
      quotes: ["warn", "double", { avoidEscape: true }],
      "simple-import-sort/imports": "warn",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-object-type": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_", caughtErrors: "none" },
      ],
      "react-hooks/rules-of-hooks": "error",
      // SSR-safe media-query checks legitimately set state from an effect.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "react/prop-types": "off",
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            // Packages `react` should be listed first.
            ["^react$"],
            // Next.js packages.
            ["^next/"],
            // Packages.
            ["^@?\\w", "^[a-z]"],
            // namespace imports
            ["^[*]"],
            // Internal packages.
            ["^(@)(/.*|$)"],
            // Side effect imports.
            ["^\\u0000"],
            // Parent imports. Put `..` last.
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Other relative imports. Put same-folder imports and `.` last.
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports.
            ["^.+\\.s?css$"],
            ["^.+\\.styled\\.ts$"],
          ],
        },
      ],
    },
  },
  {
    files: ["*.js", "*.mjs", "*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  // Keep prettier last so formatting rules win.
  prettierRecommended,
  {
    rules: {
      "prettier/prettier": ["warn", { endOfLine: "auto" }],
    },
  }
);
