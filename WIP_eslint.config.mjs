import { fixupPluginRules } from '@eslint/compat';
import eslint from '@eslint/js';
import angularEslint from 'angular-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginNoRelativePaths from 'eslint-plugin-no-relative-import-paths';
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import eslintPluginRegexp from 'eslint-plugin-regexp';
import eslintSortClassMembers from 'eslint-plugin-sort-class-members';
import tsEslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginComments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import globals from 'globals';
import eslintPluginPromise from 'eslint-plugin-promise';
import eslintPluginSimpleSort from 'eslint-plugin-simple-import-sort';
import eslintPluginN from 'eslint-plugin-n';


const restrictedSyntax = [{
    selector: "ForStatement",
    message: "Consider using array iteration methods or for..of loops instead.",
}, {
    selector: "ForInStatement",
    message: "Consider using array iteration methods or for..of loops instead.",
}, {
    selector: "WhileStatement",
    message: "Consider using array iteration methods or for..of loops instead.",
}, {
    selector: "DoWhileStatement",
    message: "Consider using array iteration methods or for..of loops instead.",
}];

/* eslint-disable perfectionist/sort-objects -- Keep the config readable, by NOT sorting alphabetically automatically. */
export default defineConfig(
  globalIgnores(['dist/**', 'www/**', '.angular/**', 'coverage/**']),
  {
      name: 'base',
      languageOptions: {
        parserOptions: {
          projectService: true,
        },
      },
      linterOptions: {
        reportUnusedInlineConfigs: 'error',
        reportUnusedDisableDirectives: 'error',
      },
      extends: [eslint.configs.recommended, eslintPluginComments.recommended],
      rules: {
        '@eslint-community/eslint-comments/require-description': 'error',
      },
    },
  {
      name: 'recommended',
      files: ['**/*.mjs', '**/*.ts'],
      languageOptions: {
        ecmaVersion: 2022, // NOTE: Align with Node.js version from: `.node-version`-file
        sourceType: 'module',
        globals: globals.nodeBuiltin,
      },
      plugins: {
        'simple-import-sort': eslintPluginSimpleSort,
      },
      extends: [eslintPluginPromise.configs['flat/recommended']],
      rules: {
        'object-shorthand': 'error',
        'prefer-arrow-callback': 'error',
        'no-inner-declarations': 'error',
        'promise/no-callback-in-promise': 'error',
        'promise/no-multiple-resolved': 'error',
        'promise/no-nesting': 'error',
        'promise/no-promise-in-callback': 'error',
        'promise/no-return-in-finally': 'error',
        'promise/valid-params': 'error',
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': 'error',
        'arrow-body-style': 'error',
        'func-style': 'error',
        'promise/prefer-await-to-callbacks': 'error',
        'promise/prefer-await-to-then': 'error',
      },
    },
    {
    name: 'TypeScript files',
    files: ['**/*.ts', '**/*.mts'],
    languageOptions: {
      globals: globals.browser,
    },
    extends: [
      tsEslint.configs.strictTypeChecked,
      tsEslint.configs.stylisticTypeChecked,
      angularEslint.configs.tsRecommended,
      eslintPluginRegexp.configs['flat/recommended'],
      eslintSortClassMembers.configs['flat/recommended'],
    ],
    plugins: {
      'no-relative-import-paths': fixupPluginRules(eslintPluginNoRelativePaths),
      perfectionist: eslintPluginPerfectionist,
      regexp: eslintPluginRegexp,
    },
    processor: angularEslint.processInlineTemplates,
    rules: {
      '@angular-eslint/component-max-inline-declarations': [
        'error',
        { template: 20 },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          prefix: 'app',
          style: 'kebab-case',
          type: 'element',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          prefix: 'app',
          style: 'camelCase',
          type: 'attribute',
        },
      ],
      '@angular-eslint/no-async-lifecycle-method': ['error'],
      '@angular-eslint/prefer-on-push-component-change-detection': ['error'],
      '@angular-eslint/prefer-output-readonly': ['error'],
      '@angular-eslint/prefer-signals': ['error'],
      '@angular-eslint/prefer-standalone': ['error'],
      '@angular-eslint/sort-lifecycle-methods': ['error'],
      '@angular-eslint/use-component-selector': ['error'],
      '@angular-eslint/use-lifecycle-interface': ['error'],
      '@typescript-eslint/no-extraneous-class': [
        'error',
        {
          allowWithDecorator: true,
        },
      ],
      '@typescript-eslint/method-signature-style': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            caughtErrors: 'none',
            varsIgnorePattern: '^_',
          },
        ],
      'n/no-unsupported-features/node-builtins': ['off'], // These files are for browsers, we don't want false-positives on not-yet-supported-in-Node.js features already covered by `configs.browser`.
      'max-params': ['error', 2],
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        {
          prefix: '~',
          rootDir: './src/app',
        },
      ],
      'perfectionist/sort-array-includes': ['error'],
      'perfectionist/sort-enums': ['error'],
      'perfectionist/sort-intersection-types': ['error'],
      'perfectionist/sort-union-types': ['error'],
    },
  },
  {
    name: 'Build- or Config JavaScript files',
    files: ['**/*.mjs'],
    extends: [
      eslintPluginRegexp.configs['flat/recommended'],
      eslintPluginPerfectionist.configs['recommended-natural'],
    ],
    plugins: {
      regexp: eslintPluginRegexp,
      n: eslintPluginN,
    },
    rules: {
      'perfectionist/sort-imports': ['off'], // Handled by `eslint-plugin-simple-import-sort` in the shared config
      'n/no-extraneous-import': 'off', // Managed by TypeScript
      'n/no-missing-import': 'off', // Disabled to allow for path-aliases via tsconfig.json
    },
  },

  {
    name: '(Unit-)test files',
    files: ['**/*.spec.ts'],
    rules: {
      // This rule triggers for spy objects where the spied-upon method uses
      // `this`. In that case the underlying method is just not called so the
      // rule is irrelevant.
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    name: 'Component templates (HTML)',
    files: ['src/app/**/*.html'],
    extends: [
      ...angularEslint.configs.templateRecommended,
      ...angularEslint.configs.templateAccessibility,
    ],
    rules: {

      'prettier/prettier': [
        'error',
        {
          parser: 'angular',
        },
      ],
    },
  },
  {
    name: 'Browser-only JavaScript files',
    files: ['src/**/*.js', 'src/**/*.mjs'],
    languageOptions: {
      globals: globals.browser,
    },
    extends: [
      eslint.configs.recommended,
    ],
  },

  {
      name: 'final',
      files: ['**/*.js', '**/*.mjs', '**/*.ts', 'src/app/**/*.html'],
      extends: [eslintPluginPrettierRecommended],
    }, // NOTE: This needs to be last! It configures Prettier, to make sure auto-formatting works.
);
/* eslint-enable perfectionist/sort-objects -- Only the configs-collection needs manual sorting. */
