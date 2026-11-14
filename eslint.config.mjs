import { fixupPluginRules } from '@eslint/compat';
import eslint from '@eslint/js';
import angularEslint from 'angular-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
// import eslintPluginNoRelativePaths from 'eslint-plugin-no-relative-import-paths';
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
import restrictedGlobals from 'confusing-browser-globals'
import eslintPluginNoUnsanitized from "eslint-plugin-no-unsanitized";


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

export default defineConfig(

  globalIgnores(["**/coverage", "**/www"]),
  {
    name: "typescript",
    files: ["**/*.ts", "**/*.mts"],

    languageOptions: {
        parserOptions: {
            project: ["tsconfig.json"],
            createDefaultProgram: true,
        },
    },

    plugins: {
        // "no-relative-import-paths": eslintPluginNoRelativePaths,
      "simple-import-sort": eslintPluginSimpleSort,
    },

    extends: [
      eslintPluginPromise.configs['flat/recommended'],
      eslintPluginNoUnsanitized.configs['recommended'],
      eslintPluginRegexp.configs['flat/recommended'],
      eslintPluginPrettierRecommended,
      angularEslint.configs.tsRecommended,
    ],
    processor: angularEslint.processInlineTemplates,
    rules: {
        "no-extra-boolean-cast": ["error"],
        "no-var": ["error"],
        "prefer-const": ["error"],

        "@angular-eslint/directive-selector": ["error", {
            type: "attribute",
            prefix: "app",
            style: "camelCase",
        }],

        "@angular-eslint/component-selector": ["error", {
            type: "element",
            prefix: "app",
            style: "kebab-case",
        }],

        // "no-relative-import-paths/no-relative-import-paths": ["error", {
        //     allowSameFolder: true,
        // }],
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "no-restricted-globals": ["error"].concat(restrictedGlobals),
        "no-restricted-syntax": ["error"].concat(restrictedSyntax),
        "promise/no-multiple-resolved": ["error"],

        "regexp/letter-case": ["error", {
            caseInsensitive: "lowercase",
            unicodeEscape: "lowercase",
            hexadecimalEscape: "lowercase",
            controlEscape: "uppercase",
        }],

        "regexp/no-contradiction-with-assertion": ["error"],
        "regexp/no-control-character": ["error"],
        "regexp/no-extra-lookaround-assertions": ["error"],
        "regexp/no-misleading-capturing-group": ["error"],
        "regexp/no-misleading-unicode-character": ["error"],
        "regexp/no-missing-g-flag": ["error"],
        "regexp/prefer-escape-replacement-dollar-char": ["error"],
        "regexp/prefer-named-backreference": ["error"],
        "regexp/prefer-named-capture-group": ["error"],
        "regexp/prefer-named-replacement": ["error"],
        "regexp/prefer-quantifier": ["error"],
        "regexp/sort-alternatives": ["error"],
        "regexp/sort-character-class-elements": ["error"],
        "regexp/use-ignore-case": ["error"],
    },

    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".mts"],
        },

        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
            },
        },
    },
  }, {

    name: "html",
    files: ["**/*.html"],

    extends: [
      ...angularEslint.configs.templateRecommended,
      ...angularEslint.configs.templateAccessibility,
    ],

    // rules: {
    //   'prettier/prettier': [
    //     'error',
    //     {
    //       parser: 'angular',
    //     },
    //   ],
    // },
}, {

    name: "javascript",
    files: ["**/*.js"],

    languageOptions: {
        ecmaVersion: 2024,
        parserOptions: {},
    },

    extends: [eslintPluginPrettierRecommended],

    rules: {
        "sort-imports": ["error"],
    },
}, {

    name: "mjs",
  files: ["**/*.mjs"],

  languageOptions: {
    sourceType: "module",
    ecmaVersion: 2024,
    parserOptions: {},
  },

  plugins: {
    // "no-relative-import-paths": eslintPluginNoRelativePaths,
    "simple-import-sort": eslintPluginSimpleSort,
  },
    extends: [eslintPluginPromise.configs['flat/recommended'],
    eslintPluginNoUnsanitized.configs['recommended'],
      eslintPluginRegexp.configs['flat/recommended'],
      eslintPluginPrettierRecommended,
    ],
  rules: {
    "no-extra-boolean-cast": ["error"],
    "no-var": ["error"],
    "prefer-const": ["error"],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "no-restricted-globals": ["error"].concat(restrictedGlobals),
    "no-restricted-syntax": ["error"].concat(restrictedSyntax),
    "promise/no-multiple-resolved": ["error"],

    "regexp/letter-case": ["error", {
      caseInsensitive: "lowercase",
      unicodeEscape: "lowercase",
      hexadecimalEscape: "lowercase",
      controlEscape: "uppercase",
    }],

    "regexp/no-contradiction-with-assertion": ["error"],
    "regexp/no-control-character": ["error"],
    "regexp/no-extra-lookaround-assertions": ["error"],
    "regexp/no-misleading-capturing-group": ["error"],
    "regexp/no-misleading-unicode-character": ["error"],
    "regexp/no-missing-g-flag": ["error"],
    "regexp/prefer-escape-replacement-dollar-char": ["error"],
    "regexp/prefer-named-backreference": ["error"],
    "regexp/prefer-named-capture-group": ["error"],
    "regexp/prefer-named-replacement": ["error"],
    "regexp/prefer-quantifier": ["error"],
    "regexp/sort-alternatives": ["error"],
    "regexp/sort-character-class-elements": ["error"],
    "regexp/use-ignore-case": ["error"],
  },
});
