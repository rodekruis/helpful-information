# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased](https://github.com/rodekruis/helpful-information/compare/v23.02.0...main)

---

## 2023-02-16: [v23.02](https://github.com/rodekruis/helpful-information/releases/tag/v23.02.0)

### Changed

- Upgrade to Angular v15
- Use URL-slugs in URLs/routing instead of (Sub-)Category/Offer-IDs. See [#200](https://github.com/rodekruis/helpful-information/issues/200)

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
