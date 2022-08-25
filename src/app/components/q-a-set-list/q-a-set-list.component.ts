import { Component, Input } from '@angular/core';
import { QASet } from 'src/app/models/qa-set.model';
import { ReferralPageDataService } from 'src/app/services/referral-page-data.service';

@Component({
  selector: 'app-q-a-set-list',
  templateUrl: './q-a-set-list.component.html',
  styleUrls: ['./q-a-set-list.component.scss'],
})
export class QASetListComponent {
  @Input()
  list: QASet[];

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
