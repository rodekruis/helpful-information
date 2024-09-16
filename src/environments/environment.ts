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
  useFeedbackPrompt: true, // Enable Feedback-prompt on Sub-Category and Offer pages

  // Configuration of content
  localeLanguage: 'en', // Default language
  localeDir: 'ltr', // Default language direction: 'ltr' or 'rtl'
  localeAlternatives: '', // Other language-options
  localeAlternativesExplanation: '', // Auto-translation explanation: i.e. "* Using Google Translate"
  appName: 'Helpful \n Information',
  appLogoUrl:
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚧</text></svg>",
  mainPageHeader: 'The Red Cross provides helpful information.',
  mainPageIntroduction: `
Intro test-content:
Emoji in text: 🚩 📱 🪪 📍 ♿️ ℹ️ ☑️ 🔴🟠🟢 ⚠️  &#x26A0;

HTML Image: <img src="/favicon.ico" alt=""/>
HTML Link:  <a href="https://github.com/rodekruis/helpful-information">helpful-information on GitHub</a>
HTML Link (Internal): <a href="/test-local-1">Test Local 1</a>

Markdown content:
- Text with _inline_ **styles**.
- Links to [external urls](https://example.org), [internal urls](/about) or [links-to-self](http://localhost:4200/about)
  Or plain URLs: <https://example.org>
  Or email-addresses: <info@example.org>

### Level 3 headings

Section content...

---

- bullet
- lists

1. numbered
1. lists

Please select your region:

  `,
  mainPageNotification: '',
  mainFooter: '',
  pageAbout: `
## About

This is an example of a [Helpful Information App](https://github.com/rodekruis/helpful-information#readme).

  `,
  pagePrivacy: `
\n
  `,

  errorHeader: 'Data unavailable',
  errorMessage: 'Contact us at: ',
  errorContactUrl: 'https://github.com/rodekruis/helpfulinformation',
  errorRetry: 'Try again?',

  // RegionConfig: A JSON-string with configuration for all region(-set)(s)
  regionConfig: '',

  // Regions: (A comnma-separated list of URL paths/slugs)
  regions:
    // Local standalone sheet:
    'test-local-1' +
    // Local language-specific (content-equivalent) sheets:
    ',en' +
    ',nl' +
    ',ar' +
    '', // end-of-list

  // Regions Labels: (A comnma-separated list of human-readable text-strings)
  regionsLabels:
    'Test Local 1' +
    ',Test Local 🌐 EN' +
    ',Test Local 🌐 NL' +
    ',Test Local 🌐 AR' +
    '', // end-of-list

  // Regions Google Sheet IDs, corresponding to the above defined regions
  regionsSheetIds:
    'test-sheet-id-1' + // Local Test  🔴
    ',test-sheet-id-1' + // Local Test EN  🔴
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
