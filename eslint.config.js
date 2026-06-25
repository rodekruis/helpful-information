import angular from 'angular-eslint';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import importPlugin from 'eslint-plugin-import';
import noLoops from 'eslint-plugin-no-loops';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import noUnsanitized from 'eslint-plugin-no-unsanitized';
import prettier from 'eslint-plugin-prettier/recommended';
import promise from 'eslint-plugin-promise';
import regexp from 'eslint-plugin-regexp';
import restrictedGlobals from 'confusing-browser-globals';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  {
    ignores: ['coverage/**', 'www/**'],
  },

  // TypeScript files
  {
    files: ['**/*.ts'],
    extends: [...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      'no-loops': noLoops,
      promise,
      'no-unsanitized': noUnsanitized,
      regexp,
    },
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
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
    rules: {
      'no-extra-boolean-cast': ['error'],
      'no-var': ['error'],
      'prefer-const': ['error'],
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
      'no-restricted-globals': ['error'].concat(restrictedGlobals),
      'promise/no-multiple-resolved': ['error'],
      'no-loops/no-loops': ['error'],
      'no-unsanitized/method': 'error',
      'no-unsanitized/property': 'error',
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

  // HTML template files
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },

  // JavaScript files (scripts, config files)
  {
    files: ['**/*.js'],
    extends: [prettier],
    rules: {
      'sort-imports': ['error'],
    },
  },

  // Apply prettier formatting to all files
  prettier,
);
