import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppHeaderComponent } from 'src/app/components/header/header.component';
import { LastUpdatedTimeComponent } from 'src/app/components/last-updated-time/last-updated-time.component';
import { OfferComponent } from 'src/app/components/offer/offer.component';
import { SubCategoryComponent } from 'src/app/components/sub-category/sub-category.component';
import { CategoryFilterPipe } from 'src/app/pipes/category-filter.pipe';
import { SubCategoryFilterPipe } from 'src/app/pipes/sub-category-filter.pipe';
import { LinkTileComponent } from '../components/link-tile/link-tile.component';
import { QASetListComponent } from '../components/q-a-set-list/q-a-set-list.component';
import { QASetComponent } from '../components/q-a-set/q-a-set.component';
import { SearchInputComponent } from '../components/search-input/search-input.component';
import { ConvertUrlsPipe } from '../pipes/convert-urls.pipe';

@NgModule({
  declarations: [
    AppHeaderComponent,
    CategoryFilterPipe,
    ConvertUrlsPipe,
    LastUpdatedTimeComponent,
    LinkTileComponent,
    OfferComponent,
    QASetComponent,
    QASetListComponent,
    SearchInputComponent,
    SubCategoryComponent,
    SubCategoryFilterPipe,
  ],
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  exports: [
    AppHeaderComponent,
    CategoryFilterPipe,
    ConvertUrlsPipe,
    LastUpdatedTimeComponent,
    LinkTileComponent,
    OfferComponent,
    QASetComponent,
    QASetListComponent,
    SearchInputComponent,
    SubCategoryComponent,
    SubCategoryFilterPipe,
  ],
})
export class SharedModule {}
