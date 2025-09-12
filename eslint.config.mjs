// @ts-check
import confusingBrowserGlobals from 'confusing-browser-globals';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import promisePlugin from 'eslint-plugin-promise';
import regexpPlugin from 'eslint-plugin-regexp';
import noUnsanitizedPlugin from 'eslint-plugin-no-unsanitized';
import jasminePlugin from 'eslint-plugin-jasmine';
import noRelativeImportPathsPlugin from 'eslint-plugin-no-relative-import-paths';
import stylisticPlugin from '@stylistic/eslint-plugin';
import jsonPlugin from '@eslint/json';
import markdownPlugin from '@eslint/markdown';

export default [
  {
    name: 'Global Config/Settings',
    ignores: ['coverage/**', 'www/**', 'node_modules/**', 'dist/**', '.angular/**', 'package-lock.json'],
  },

  {
    name: 'All JSON',
    files: ['**/*.json'],
    plugins: {
      json: jsonPlugin,
    },
    rules: {
      ...jsonPlugin.configs.recommended.rules,
      'json/top-level-interop': ['error', 'always'],
    },
  },
  {
    name: 'Only JSON-Data',
    files: ['data/**/*.json'],
  },

  {
    name: 'All Markdown',
    files: ['**/*.md'],
    plugins: {
      markdown: markdownPlugin,
    },
    rules: {
      ...markdownPlugin.configs.recommended.rules,
    },
  },

  {
    name: 'All JavaScript/TypeScript',
    files: ['**/*.js', '**/*.mjs', '**/*.ts'],
    plugins: {
      '@stylistic': stylisticPlugin,
      import: importPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      promise: promisePlugin,
      regexp: regexpPlugin,
      'no-unsanitized': noUnsanitizedPlugin,
      'no-relative-import-paths': noRelativeImportPathsPlugin,
    },
    rules: {
      // Basic shared rules for all JavaScript-like files
      'no-extra-boolean-cast': ['error'],
      'no-var': ['error'],
      'prefer-const': ['error'],
      'no-restricted-globals': ['error', ...confusingBrowserGlobals],

      // ESLint Stylistic rules equivalent to Prettier config
      '@stylistic/semi': ['error', 'always'], // semi: true
      '@stylistic/quotes': ['error', 'single', {
        avoidEscape: true,
        allowTemplateLiterals: 'always',
      }], // singleQuote: true, allow template literals to avoid escapes
      '@stylistic/indent': ['error', 2], // Standard 2-space indentation
      '@stylistic/comma-dangle': ['error', 'only-multiline'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      }],
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/template-curly-spacing': ['error', 'never'], // No spaces inside template literal expressions
      '@stylistic/max-len': ['error', {
        code: 100,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      }],
      '@stylistic/keyword-spacing': ['error', {
        after: true,
        overrides: {
          'async': { after: true },
          'await': { after: true },
        },
      }],

      // Import recommended rules from plugins
      ...importPlugin.configs.recommended.rules,
      ...promisePlugin.configs.recommended.rules,
      ...noUnsanitizedPlugin.configs['recommended-legacy'].rules,
      ...regexpPlugin.configs.recommended.rules,

      // Import rules
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        { allowSameFolder: true },
      ],
      'import/first': 'error',
      'import/consistent-type-specifier-style': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-absolute-path': 'error',
      'import/no-relative-packages': 'error',
      'import/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: true,
        },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'promise/no-multiple-resolved': ['error'],
      'regexp/letter-case': [
        'error',
        {
          caseInsensitive: 'lowercase',
          unicodeEscape: 'lowercase',
          hexadecimalEscape: 'lowercase',
          controlEscape: 'uppercase',
        },
      ],
      'regexp/no-contradiction-with-assertion': ['error'],
      'regexp/no-control-character': ['error'],
      'regexp/no-extra-lookaround-assertions': ['error'],
      'regexp/no-misleading-capturing-group': ['error'],
      'regexp/no-misleading-unicode-character': ['error'],
      'regexp/no-missing-g-flag': ['error'],
      'regexp/prefer-escape-replacement-dollar-char': ['error'],
      'regexp/prefer-named-backreference': ['error'],
      'regexp/prefer-named-capture-group': ['error'],
      'regexp/prefer-named-replacement': ['error'],
      'regexp/prefer-quantifier': ['error'],
      'regexp/sort-alternatives': ['error'],
      'regexp/sort-character-class-elements': ['error'],
      'regexp/use-ignore-case': ['error'],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForStatement',
          message: 'for loops are not allowed. Use array methods like map, filter, reduce instead.',
        },
        {
          selector: 'WhileStatement',
          message: 'while loops are not allowed. Use array methods or recursion instead.',
        },
        {
          selector: 'DoWhileStatement',
          message: 'do-while loops are not allowed. Use array methods or recursion instead.',
        },
        {
          selector: 'ForInStatement',
          message: 'for-in loops are not allowed. Use Object.keys() with array methods instead.',
        },
      ],
      'prefer-template': ['error'],
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },

  {
    name: 'Only JavaScript',
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      'sort-imports': ['error'],
    },
  },

  {
    name: 'JavaScript Module/Modern',
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
    },
    rules: {
      'prefer-arrow-callback': ['error'],
      'object-shorthand': ['error'],
    },
  },

  {
    name: 'Only TypeScript',
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
      },
    },
    plugins: {
      '@angular-eslint': angular,
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      ...angular.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,

      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },

  {
    name: 'Only TypeScript Tests',
    files: ['**/*.spec.ts'],
    plugins: {
      jasmine: jasminePlugin,
    },
    rules: {
      ...jasminePlugin.configs.recommended.rules,
    },
  },

  {
    name: 'Only Angular HTML Templates',
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    rules: {
      ...angularTemplate.configs.accessibility.rules,
      ...angularTemplate.configs.recommended.rules,
    },
  },
];
