import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { CategoryLinkComponent } from '../components/category-link/category-link.component';
import { CategoryPageComponent } from '../pages/category/category.page';
import { OfferPageComponent } from '../pages/offer/offer.page';
import { SubCategoryPageComponent } from '../pages/sub-category/sub-category.page';
import { ReferralPageComponent } from './referral.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CategoryLinkComponent,
    CategoryPageComponent,
    SubCategoryPageComponent,
    OfferPageComponent,
    RouterModule.forChild([
      {
        path: ':region/highlights',
        canActivate: [() => environment.useQandAs],
        component: ReferralPageComponent,
        data: {
          showHighlights: true,
        },
      },
      {
        path: ':region/search',
        canActivate: [
          () => environment.useQandAs && environment.useQandASearch,
        ],
        component: ReferralPageComponent,
        data: {
          showSearch: true,
        },
      },
      {
        path: ':region',
        pathMatch: 'prefix',
        component: ReferralPageComponent,
        data: {
          showSearch: false,
          showHighlights: false,
        },
        children: [
          {
            path: ':categorySlug/:subCategorySlug/:offerSlug',
            canActivate: [() => environment.useUrlSlugs],
            loadComponent: () =>
              import('../pages/offer/offer.page').then(
                (mod) => mod.OfferPageComponent,
              ),
          },
          {
            path: ':categorySlug/:subCategorySlug',
            canActivate: [() => environment.useUrlSlugs],
            loadComponent: () =>
              import('../pages/sub-category/sub-category.page').then(
                (mod) => mod.SubCategoryPageComponent,
              ),
          },
          {
            path: ':categorySlug',
            canActivate: [() => environment.useUrlSlugs],
            loadComponent: () =>
              import('../pages/category/category.page').then(
                (mod) => mod.CategoryPageComponent,
              ),
          },
        ],
      },
      {
        path: '',
        pathMatch: 'full',
        component: ReferralPageComponent,
      },
    ]),
    SharedModule,
  ],
  declarations: [ReferralPageComponent],
  providers: [Title],
})
export class ReferralPageModule {}
