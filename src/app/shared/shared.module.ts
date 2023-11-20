import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BreadcrumbsComponent } from 'src/app/components/breadcrumbs/breadcrumbs.component';
import { AppHeaderComponent } from 'src/app/components/header/header.component';
import { QASetComponent } from 'src/app/components/q-a-set/q-a-set.component';
import { QASetListComponent } from 'src/app/components/q-a-set-list/q-a-set-list.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule,
    BreadcrumbsComponent,
    QASetComponent,
    QASetListComponent,
    AppHeaderComponent,
  ],
  exports: [AppHeaderComponent],
})
export class SharedModule {}
