import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { ReferralPageComponent } from './referral.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
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
