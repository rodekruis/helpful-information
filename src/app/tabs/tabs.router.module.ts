import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: ':region',
    component: TabsPage,
    loadChildren: () =>
      import('../referral/referral.module').then((m) => m.ReferralPageModule),
  },
  {
    path: '',
    component: TabsPage,
    loadChildren: () =>
      import('../referral/referral.module').then((m) => m.ReferralPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
