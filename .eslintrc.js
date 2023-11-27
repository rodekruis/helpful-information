const restrictedGlobals = require('confusing-browser-globals');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*', 'coverage', 'www'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
      },
      plugins: [
        'no-relative-import-paths',
        'import',
        'simple-import-sort',
        'no-loops',
        'promise',
        'jasmine',
      ],
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:promise/recommended',
        'plugin:no-unsanitized/DOM',
        'plugin:regexp/recommended',
        'plugin:jasmine/recommended',
        'prettier',
      ],
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
        'no-loops/no-loops': ['error'],
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
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended', 'prettier'],
      rules: {},
    },
    {
      files: ['*.js'],
      parserOptions: {
        ecmaVersion: 2021,
      },
      extends: ['prettier'],
      rules: {
        'sort-imports': ['error'],
      },
    },
  ],
};
