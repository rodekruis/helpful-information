# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project uses the [`CalVer`](https://calver.org/#scheme)-format: `YY.0M.MICRO`.

---

## [Unreleased](https://github.com/rodekruis/helpful-information/compare/v24.07.2...main)

### Added

- Regions can be grouped on the main-page (with optional sub-headings) via the `REGION_CONFIG`-ENV-variable(experimental!). See: [`ENV`](.env.example)

---

## 2024-07-25: [v24.07.2](https://github.com/rodekruis/helpful-information/releases/tag/v24.07.2)

### Fixed

- Auto-translations using (third-party) Google Translate require less strict security-settings.

---

## 2024-07-18: [v24.07.1](https://github.com/rodekruis/helpful-information/releases/tag/v24.07.1)

### Added

- Offers can be grouped on Sub-Category-pages by setting an (optional!) "Chapter Name" for each Offer.

---

## 2024-07-10: [v24.07.0](https://github.com/rodekruis/helpful-information/releases/tag/v24.07.0)

### Fixed

- Duplicate page-views and/or unique-users tracking/logging prevented. (Mostly)

---

## 2024-06-28: [v24.06.1](https://github.com/rodekruis/helpful-information/releases/tag/v24.06.1)

### Added

- Language-switcher now also available on the Main-page. (when configured via [`ENV`](.env.example)-variables)

### Fixed

- Links to Main-page(the Logo, "Try Again"-link) now takes into account if deployed in a sub-folder or on (sub-)domain.

### Changed

- Upgrade to Angular v18 + Ionic v7

### Removed

- No more URL-rewriting/redirecting for 'old-style' URLs using query-parameters only.

---

## 2024-06-03: [v24.06](https://github.com/rodekruis/helpful-information/releases/tag/v24.06.0)

### Removed

- Back-button and related logging/logic; `#nav.back`-row can be removed from Sheets.
- Feedback-widget has changed; `#label.feedback.cta`-row can be removed from Sheets.

### Added

- 'Fixed' logo with text (still translatable via sheet)
- Language-Switcher - Using Google Translate with language-options defined per-region/sheet
- Language-Switcher - Using separate sheets-as-languages defined at build-time, per-instance
- Configurable color variables
- Configurable Footer-text, see the ENV-variable: [`TXT_MAIN_FOOTER`](.env.example)
- Configurable About-page, see the ENV-variable: [`TXT_PAGE_ABOUT`](.env.example)
- Configurable Privacy-page, see the ENV-variable: [`TXT_PAGE_PRIVACY`](.env.example)
- Improved Feedback-Widget;  
  New rows `#feedback.*` can be used to configure the feedback-widget. See: [`Referral Page.json`](./data/test-sheet-id-1/values/Referral%20Page.json)

### Changed

- Upgrade to use Node.js v22 by default
- Upgrade to Ionic v8
- Color-scheme to match new design

---

## 2023-11-30: [v23.11](https://github.com/rodekruis/helpful-information/releases/tag/v23.11.0)

### Added

- Print-friendly styles - ability to use full-width of pages + print multiple pages
- Small text-sizing fixes - Visitors should be able to use their preferred size

### Changed

- Upgrade to Angular v17 + Ionic v7

---

## 2023-07-13: [v23.07](https://github.com/rodekruis/helpful-information/releases/tag/v23.07.0)

### Added

- Ability to show a sticky "Notification" on every/the main-page. See [#650](https://github.com/rodekruis/helpful-information/pull/650)
- Support for / using Node.js v18/v20
- RTL-support for Arabic. See [#639](https://github.com/rodekruis/helpful-information/issues/639)
- A Guide: "[How to set up an instance (quickly)](./docs/Guide-How_to_set_up_an_instance.md)"

### Removed

- Support for Node.js v16
- Support for URLs using `categoryID`, `subCategoryID`, `offerID`, `search=show`, `highlights=show`, etc.

### Changed

- Sheet-level configuration/text-labels as rows in "Referral Page"-sheet can be reordered, when properly labeled with `#tag`s. See [#158](https://github.com/rodekruis/helpful-information/issues/158)

---

## 2023-03-07: [v23.03](https://github.com/rodekruis/helpful-information/releases/tag/v23.03.0)

### Changed

- Use Markdown-syntax for multiple field/properties. See [#318](https://github.com/rodekruis/helpful-information/issues/318)

### Removed

- COVID-related fields/properties. See [#623](https://github.com/rodekruis/helpful-information/issues/623)

---

## 2023-02-16: [v23.02](https://github.com/rodekruis/helpful-information/releases/tag/v23.02.0)

### Changed

- Upgrade to Angular v15
- Use URL-slugs in URLs/routing instead of (Sub-)Category/Offer-IDs. See [#200](https://github.com/rodekruis/helpful-information/issues/200)

---

## 2022-10-24: [v22.11](https://github.com/rodekruis/helpful-information/releases/tag/v22.11.0)

### Changed

- Connection between Google Sheets based on column-order replaced by `#tag`s in column-headers.
  Any sheets without these `#tag`s will not work anymore.

  See the specific required/available `#tag`s in:

  - [`models/category.model.ts`](./src/app/models/category.model.ts)
  - [`models/sub-category.model.ts`](./src/app/models/sub-category.model.ts)
  - [`models/offer.model.ts`](./src/app/models/offer.model.ts)
  - [`models/qa-set.model.ts`](./src/app/models/qa-set.model.ts)

  See [#204](https://github.com/rodekruis/helpful-information/issues/204)

---

## Start - 2021-03-10
