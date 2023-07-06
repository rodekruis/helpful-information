// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Configuration/Feature-switches:
  envName: 'development', // (Optional) Label to show which environment is used
  useServiceWorker: false, // Enable 'offline' support
  useQandAs: true, // Enable 'Q&A'-content type
  useQandASearch: true, // Enable Search-feature for Q&As

  // Configuration of content
  appName: 'Helpful Information',
  appLogoUrl:
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚧</text></svg>",
  mainPageHeader: 'The Red Cross provides helpful information.',
  mainPageIntroduction:
    'Intro test-content: \n\n' +
    '<b>Image:</b> <img src="/favicon.ico" alt=""/> \n\n' +
    ' <b>Link:</b> <a href="https://github.com/rodekruis/helpful-information">helpful-information on GitHub</a> \n\n ' +
    ' <b>Internal:</b> <a href="/test">Test</a> \n\n ' +
    'Markdown content: \n\n' +
    '_inline_ **styles** and [external links](https://example.org) or [internal links](/test) \n\n' +
    '### Level 3 headings down only? \n\n' +
    'Section content... \n\n' +
    '--- \n\n' +
    '- bullet \n' +
    '- lists \n' +
    '\n' +
    '1. numbered \n' +
    '1. lists \n' +
    '\n - - - \n\n' +
    'Please select your region:',
  mainPageNotification: '',

  errorHeader: 'Data unavailable',
  errorMessage: 'Contact us at: ',
  errorContactUrl: 'https://github.com/rodekruis/helpfulinformation',
  errorRetry: 'Try again?',

  // Regions: (A comnma-separated list of URL paths/slugs)
  regions: '',
  // Regions Labels: (A comnma-separated list of human-readable text-strings)
  regionsLabels: '',
  // Regions Google Sheet IDs, corresponding to the above defined regions
  regionsSheetIds: '',

  // Third-party tokens:

  // Google Sheets API:
  google_sheets_api_key: '',
  google_sheets_api_url: '',

  // Application Insights:
  appInsightsConnectionString: '',
};
