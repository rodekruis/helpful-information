import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReferralPageComponent } from './referral.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: ':region',
        component: ReferralPageComponent,
      },
      {
        path: '',
        component: ReferralPageComponent,
      },
    ]),
    SharedModule,
  ],
  declarations: [ReferralPageComponent],
  providers: [Title],
})
export class ReferralPageModule {}
