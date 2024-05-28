import type { Routes } from '@angular/router';
import { ReferralPageComponent } from 'src/app/referral/referral.page';
import { environment } from 'src/environments/environment';

export enum AppPath {
  highlights = 'highlights',
  search = 'search',
}

export const routes: Routes = [
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
