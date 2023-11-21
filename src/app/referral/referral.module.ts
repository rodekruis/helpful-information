import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MarkdownModule } from 'ngx-markdown';
import { CategoryLinkComponent } from 'src/app/components/category-link/category-link.component';
import { QASetListComponent } from 'src/app/components/q-a-set-list/q-a-set-list.component';
import CategoryPageComponent from 'src/app/pages/category/category.page';
import HighlightsPageComponent from 'src/app/pages/highlights/highlights.page';
import OfferPageComponent from 'src/app/pages/offer/offer.page';
import RegionPageComponent from 'src/app/pages/region/region.page';
import SubCategoryPageComponent from 'src/app/pages/sub-category/sub-category.page';
import { environment } from 'src/environments/environment';

import { ReferralPageComponent } from './referral.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RegionPageComponent,
    CategoryLinkComponent,
    CategoryPageComponent,
    SubCategoryPageComponent,
    OfferPageComponent,
    QASetListComponent,
    HighlightsPageComponent,
    RouterModule.forChild([
      {
        path: ':region',
        pathMatch: 'prefix',
        component: ReferralPageComponent,
        children: [
          {
            path: 'highlights',
            pathMatch: 'prefix',
            canActivate: [() => environment.useQandAs],
            loadComponent: () => import('../pages/highlights/highlights.page'),
          },
          {
            path: 'search',
            pathMatch: 'prefix',
            canActivate: [
              () => environment.useQandAs && environment.useQandASearch,
            ],
            loadComponent: () => import('../pages/search/search.page'),
          },
          {
            path: ':categorySlug/:subCategorySlug/:offerSlug',
            canActivate: [() => environment.useOffers],
            loadComponent: () => import('../pages/offer/offer.page'),
          },
          {
            path: ':categorySlug/:subCategorySlug',
            loadComponent: () =>
              import('../pages/sub-category/sub-category.page'),
          },
          {
            path: ':categorySlug',
            loadComponent: () => import('../pages/category/category.page'),
          },
          {
            path: '',
            pathMatch: 'prefix',
            loadComponent: () => import('../pages/region/region.page'),
          },
        ],
      },
      {
        path: '**',
        component: ReferralPageComponent,
      },
    ]),
    MarkdownModule.forChild(),
    ReferralPageComponent,
  ],
  providers: [Title],
})
export class ReferralPageModule {}
