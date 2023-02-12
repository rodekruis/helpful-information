import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppHeaderComponent } from 'src/app/components/header/header.component';
import { CategoryFilterPipe } from 'src/app/pipes/category-filter.pipe';
import { SubCategoryFilterPipe } from 'src/app/pipes/sub-category-filter.pipe';
import { BreadcrumbsComponent } from '../components/breadcrumbs/breadcrumbs.component';
import { QASetListComponent } from '../components/q-a-set-list/q-a-set-list.component';
import { QASetComponent } from '../components/q-a-set/q-a-set.component';
import { ConvertUrlsPipe } from '../pipes/convert-urls.pipe';

@NgModule({
  declarations: [
    AppHeaderComponent,
    CategoryFilterPipe,
    SubCategoryFilterPipe,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule,
    ConvertUrlsPipe,
    BreadcrumbsComponent,
    QASetComponent,
    QASetListComponent,
  ],
  exports: [
    AppHeaderComponent,
    CategoryFilterPipe,
    ConvertUrlsPipe,
    SubCategoryFilterPipe,
  ],
})
export class SharedModule {}
