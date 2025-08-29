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

/**
 * ESLint flat configuration for helpful-information project
 * Structured in staggered overrides from largest to smallest file sets
 * Using ESLint Stylistic instead of Prettier for consistent code formatting
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default [
  // Global ignores
  {
    ignores: ['coverage/**', 'www/**'],
  },

  // 1. All JS/MJS/TS files with shared rules (largest set)
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts'],
    plugins: {
      '@stylistic': stylisticPlugin,
    },
    rules: {
      // Basic shared rules for all JavaScript-like files
      'no-extra-boolean-cast': ['error'],
      'no-var': ['error'],
      'prefer-const': ['error'],
      'no-restricted-globals': ['error', ...confusingBrowserGlobals],
      
      // ESLint Stylistic rules equivalent to Prettier config
      '@stylistic/semi': ['error', 'always'], // semi: true
      '@stylistic/quotes': ['error', 'single'], // singleQuote: true
      '@stylistic/indent': ['error', 2], // Standard 2-space indentation
      '@stylistic/comma-dangle': ['error', 'only-multiline'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/space-before-function-paren': ['error', 'never'],
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/max-len': ['error', { 
        code: 100,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      }],
    },
  },

  // 2. Rules specific to JS/MJS files
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      'sort-imports': ['error'],
    },
  },

  // 3. Rules for modern syntax in MJS files only
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2024, // Use latest ECMAScript features
      sourceType: 'module',
    },
    rules: {
      // Modern ES features can be enforced here
      'prefer-arrow-callback': ['error'],
      'prefer-template': ['error'],
      'object-shorthand': ['error'],
    },
  },

  // 4. Specific rules for all TypeScript files
  {
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
      import: importPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      promise: promisePlugin,
      regexp: regexpPlugin,
      'no-unsanitized': noUnsanitizedPlugin,
      'no-relative-import-paths': noRelativeImportPathsPlugin,
    },
    rules: {
      // Import recommended rules from plugins
      ...angular.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      ...promisePlugin.configs.recommended.rules,
      ...noUnsanitizedPlugin.configs['recommended-legacy'].rules,
      ...regexpPlugin.configs.recommended.rules,
      
      // Angular-specific rules
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
      
      // Promise rules
      'promise/no-multiple-resolved': ['error'],
      
      // Regexp rules
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
      
      // No loops restriction using core ESLint rule
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
        {
          selector: 'ForOfStatement',
          message: 'for-of loops are not allowed. Use array methods instead.',
        },
      ],
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

  // 5. Smaller sub-set of spec.ts files with test-related rules only
  {
    files: ['**/*.spec.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
      },
    },
    plugins: {
      jasmine: jasminePlugin,
    },
    rules: {
      // Only test-specific rules here
      ...jasminePlugin.configs.recommended.rules,
    },
  },

  // 6. Lastly, rules for HTML files
  {
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