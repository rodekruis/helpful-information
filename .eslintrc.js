const restrictedGlobals = require('confusing-browser-globals');

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
      plugins: ['no-loops', 'promise', 'jasmine'],
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:promise/recommended',
        'plugin:no-unsanitized/DOM',
        'plugin:regexp/recommended',
        'plugin:jasmine/recommended',
        'prettier',
      ],
      rules: {
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
      rules: {},
    },
  ],
};