// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Configuration/Feature-switches:
  envName: 'development', // (Optional) Label to show which environment is used
  useServiceWorker: false, // Enable 'offline' support

  // Configuration of content
  appName: 'Helpful Information',
  mainPageHeader: 'The Red Cross provides helpful information.',
  mainPageIntroduction: 'Please choose a language/region.',

  // Regions: (A comnma-separated list of URL paths/slugs)
  regions: '',
  // Regions Labels: (A comnma-separated list of human-readable text-strings)
  regionsLabels: '',

  // Third-party tokens:

  // Google Sheets API:
  google_sheets_api_key: '',
  google_sheets_api_url: '',
  google_sheets_sheet_ids: '',

  // Application Insights:
  appInsightsConnectionString: '',
};
