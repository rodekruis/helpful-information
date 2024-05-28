import type { Routes } from '@angular/router';
import { ReferralPageComponent } from 'src/app/referral/referral.page';
import { environment } from 'src/environments/environment';

export enum AppPath {
  about = 'about',
  highlights = 'highlights',
  privacy = 'privacy',
  search = 'search',
}

export const routes: Routes = [
  {
    path: AppPath.about,
    pathMatch: 'full',
    canActivate: [() => !!environment.pageAbout],
    component: ReferralPageComponent,
    data: {
      path: AppPath.about,
      isAboutPage: true,
    },
  },
  {
    path: AppPath.privacy,
    pathMatch: 'full',
    canActivate: [() => !!environment.pagePrivacy],
    component: ReferralPageComponent,
    data: {
      path: AppPath.privacy,
      isPrivacyPage: true,
    },
  },
  {
    path: ':region',
    pathMatch: 'prefix',
    component: ReferralPageComponent,
    children: [
      {
        path: AppPath.highlights,
        pathMatch: 'prefix',
        canActivate: [() => environment.useQandAs],
        loadComponent: () => import('./app/pages/highlights/highlights.page'),
      },
      {
        path: AppPath.search,
        pathMatch: 'prefix',
        canActivate: [
          () => environment.useQandAs && environment.useQandASearch,
        ],
        loadComponent: () => import('./app/pages/search/search.page'),
      },
      {
        path: ':categorySlug/:subCategorySlug/:offerSlug',
        canActivate: [() => environment.useOffers],
        loadComponent: () => import('./app/pages/offer/offer.page'),
      },
      {
        path: ':categorySlug/:subCategorySlug',
        loadComponent: () =>
          import('./app/pages/sub-category/sub-category.page'),
      },
      {
        path: ':categorySlug',
        loadComponent: () => import('./app/pages/category/category.page'),
      },
      {
        path: '',
        pathMatch: 'prefix',
        loadComponent: () => import('./app/pages/region/region.page'),
      },
    ],
  },
  {
    path: '**',
    component: ReferralPageComponent,
  },
];
