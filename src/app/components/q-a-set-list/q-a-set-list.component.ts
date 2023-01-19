import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { QASet } from 'src/app/models/qa-set.model';
import { ReferralPageDataService } from 'src/app/services/referral-page-data.service';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { QASetComponent } from '../q-a-set/q-a-set.component';

@Component({
  selector: 'app-q-a-set-list',
  templateUrl: './q-a-set-list.component.html',
  styleUrls: ['./q-a-set-list.component.scss'],
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, QASetComponent],
})
export class QASetListComponent {
  @Input()
  list: QASet[];

  @Input()
  public baseUrl: string = '';

  @Input()
  public showDateUpdatedOutsideQuestion = true;

  public labelLastUpdated: string;

  constructor(pageDataService: ReferralPageDataService) {
    if (
      !!pageDataService &&
      !!pageDataService.data &&
      !!pageDataService.data.labelLastUpdated
    ) {
      this.labelLastUpdated = pageDataService.data.labelLastUpdated;
    }
  }
}
