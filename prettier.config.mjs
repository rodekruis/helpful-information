// See: https://prettier.io/docs/en/options.html

/** @type {import("prettier").Config} */
export default {
  semi: true,
  singleAttributePerLine: true,
  singleQuote: true,
  objectWrap: 'preserve',
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'angular',
      },
    },
  ],
};
