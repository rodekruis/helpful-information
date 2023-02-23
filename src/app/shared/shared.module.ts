import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppHeaderComponent } from 'src/app/components/header/header.component';
import { BreadcrumbsComponent } from '../components/breadcrumbs/breadcrumbs.component';
import { QASetListComponent } from '../components/q-a-set-list/q-a-set-list.component';
import { QASetComponent } from '../components/q-a-set/q-a-set.component';

@NgModule({
  declarations: [AppHeaderComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule,
    BreadcrumbsComponent,
    QASetComponent,
    QASetListComponent,
  ],
  exports: [AppHeaderComponent],
})
export class SharedModule {}
