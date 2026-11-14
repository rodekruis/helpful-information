// See: https://eslint.org/docs/latest/use/configure/configuration-files
import eslint from '@eslint/js';
import angular from 'angular-eslint';
import restrictedGlobals from 'confusing-browser-globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import jasmine from 'eslint-plugin-jasmine';
import noUnsanitized from 'eslint-plugin-no-unsanitized';
import promise from 'eslint-plugin-promise';
import regexp from 'eslint-plugin-regexp';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const FILES_TS = ['**/*.ts', '**/*.mts'];
const FILES_JS = ['**/*.js', '**/*.mjs'];
const FILES_ALL = [...FILES_TS, ...FILES_JS];
const FILES_APP_TS = ['src/**/*.ts'];
const FILES_APP_HTML = ['src/**/*.html'];
const FILES_UNIT_TESTS = ['src/**/*.spec.ts'];
const FILES_NODE = [
  'scripts/**/*.mjs',
  'scripts/**/*.mts',
  'e2e/**/*.mjs',
  'src/environments/*.mjs',
  '*.mjs',
];
const FILES_COMMONJS = ['src/karma.conf.js'];

const unusedVarsOptions = {
  argsIgnorePattern: '^_',
  caughtErrorsIgnorePattern: '^_',
  varsIgnorePattern: '^_',
};

const restrictedSyntax = [
  'ForStatement',
  'ForInStatement',
  'WhileStatement',
  'DoWhileStatement',
].map((selector) => ({
  selector,
  message: 'Consider using array iteration methods or for..of loops instead.',
}));

export default defineConfig([
  globalIgnores(
    [
      'www/',
      'coverage/',
      '.angular/',
      'test-results/',
      'playwright-report/',
      'docs/legacy/',
    ],
    'global/ignores',
  ),

  // Generic rules, for all code (browser + Node.js)
  {
    name: 'shared/base',
    files: FILES_ALL,
    extends: [
      eslint.configs.recommended,
      noUnsanitized.configs.recommended,
      promise.configs['flat/recommended'],
      regexp.configs['flat/recommended'],
    ],
    rules: {
      'no-extra-boolean-cast': ['error'],
      'no-unused-vars': ['error', unusedVarsOptions],
      'no-var': ['error'],
      'no-restricted-syntax': ['error', ...restrictedSyntax],
      'prefer-const': ['error'],
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
    },
  },

  // TypeScript (browser + Node.js)
  {
    name: 'typescript/base',
    files: FILES_TS,
    extends: [tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', unusedVarsOptions],
      // TODO: Resolve existing violations, then change to 'error'
      '@typescript-eslint/no-array-constructor': ['warn'],
      '@typescript-eslint/no-duplicate-enum-values': ['warn'],
      '@typescript-eslint/no-explicit-any': ['warn'],
    },
  },

  // Browser-only: the Angular app
  {
    name: 'browser/app',
    files: FILES_APP_TS,
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-restricted-globals': ['error', ...restrictedGlobals],
    },
  },
  {
    name: 'angular/components',
    files: FILES_APP_TS,
    extends: [angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
    },
  },
  {
    name: 'angular/templates',
    files: FILES_APP_HTML,
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
  },

  // Node.js-only: scripts, tooling, configuration
  {
    name: 'node/tooling',
    files: FILES_NODE,
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    name: 'node/commonjs',
    files: FILES_COMMONJS,
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },

  // Test-only
  {
    name: 'test/unit',
    files: FILES_UNIT_TESTS,
    plugins: { jasmine },
    languageOptions: {
      globals: globals.jasmine,
    },
    rules: {
      ...jasmine.configs.recommended.rules,
    },
  },

  // Formatting is handled by Prettier, so turn off conflicting rules
  {
    name: 'formatting',
    ...prettier,
  },
]);
