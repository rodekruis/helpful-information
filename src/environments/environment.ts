// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Configuration/Feature-switches:
  envName: 'development', // (Optional) Label to show which environment is used
  useServiceWorker: false, // Enable 'offline' support
  useUrlSlugs: true, // Enable URL-slugs-instead-of-IDs for all content types
  useQandAs: true, // Enable 'Q&A'-content type
  useQandASearch: true, // Enable Search-feature for Q&As

  apiDataValidFor: 0.5 * 60, // Time in seconds to reuse API-data before fetching again

  // Configuration of content
  appName: 'Helpful Information',
  appLogoUrl:
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚧</text></svg>",
  mainPageHeader: 'The Red Cross provides helpful information.',
  mainPageIntroduction:
    '... \n\n <b>Test</b>: <img src="/favicon.ico"/> \n\n Link: <a href="https://helpfulinformation.redcross.nl/"  target="_blank" rel="noopener noreferrer">HIA production</a> \n\n Please select your region:',

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
