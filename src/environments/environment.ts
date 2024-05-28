// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Configuration/Feature-switches:
  envName: 'development', // (Optional) Label to show which environment is used
  useServiceWorker: false, // Enable 'offline' support
  useOffers: true, // Enable 'Offers'-content type
  useQandAs: true, // Enable 'Q&A'-content type
  useQandASearch: true, // Enable Search-feature for Q&As
  useRegionPerLocale: true, // Enable language-switcher to switch between Regions

  // Configuration of content
  appName: 'Helpful \n Information',
  appLogoUrl:
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚧</text></svg>",
  mainPageHeader: 'The Red Cross provides helpful information.',
  mainPageIntroduction:
    'Intro test-content: \n\n' +
    'Image: <img src="/favicon.ico" alt=""/> \n\n' +
    'Link: <a href="https://github.com/rodekruis/helpful-information">helpful-information on GitHub</a> \n\n ' +
    'Internal: <a href="/test-local-1">Test Local 1</a> \n\n ' +
    'Emoji in text: 🚩 📱 🪪 📍 ♿️ ℹ️ ☑️ 🔴🟠🟢 ⚠️  &#x26A0;\n\n' +
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
    '\n \n' +
    'Please select your region:',
  mainPageNotification: '',
  mainFooter: '',
  pageAbout: '## About \n\n ... \n\n',
  pagePrivacy:
    '## Privacy \n\n' +
    'On this website, Helpful Information, your privacy is our priority.\n' +
    '\n' +
    '- **No Data Collection**  \n' +
    'We do not collect any personal information or location data from our users. Feel free to explore our site anonymously.\n' +
    '- **Contacting Us**  \n' +
    'If you choose to contact us, rest assured that any details you share, including your email address, will remain protected. We do not share this information with third parties unless required by law.\n' +
    '\n' +
    'The Helpful Information Team',

  errorHeader: 'Data unavailable',
  errorMessage: 'Contact us at: ',
  errorContactUrl: 'https://github.com/rodekruis/helpfulinformation',
  errorRetry: 'Try again?',

  // Regions: (A comnma-separated list of URL paths/slugs)
  regions:
    // Local standalone sheet:
    'test-local-1' +
    ',' + // Add extra space to a row
    // Local language-specific (content-equivalent) sheets:
    ',nl' +
    ',ar' +
    '', // end-of-list

  // Regions Labels: (A comnma-separated list of human-readable text-strings)
  regionsLabels:
    'Test Local 1' +
    ',' + // Add extra space to a row
    ',Test Local 🌐 NL' +
    ',Test Local 🌐 AR' +
    '', // end-of-list

  // Regions Google Sheet IDs, corresponding to the above defined regions
  regionsSheetIds:
    'test-sheet-id-1' + // Local Test  🔴
    ',' + // Add extra space to a row
    ',test-sheet-id-2-language-nl' + // Local Test NL  🔴
    ',test-sheet-id-3-language-ar' + // Local Test AR  🔴
    '', // end-of-list

  //
  // Third-party tokens:
  //

  // Google Sheets API:
  google_sheets_api_key: '',
  google_sheets_api_url: 'http://localhost:3001',

  // Application Insights:
  appInsightsConnectionString: '',
};
