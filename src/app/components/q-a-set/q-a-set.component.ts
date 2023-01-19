import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { QASet } from 'src/app/models/qa-set.model';
import { ConvertUrlsPipe } from 'src/app/pipes/convert-urls.pipe';
import { ReferralPageDataService } from 'src/app/services/referral-page-data.service';

@Component({
  selector: 'app-q-a-set',
  templateUrl: './q-a-set.component.html',
  styleUrls: ['./q-a-set.component.scss'],
  standalone: true,
  imports: [CommonModule, ConvertUrlsPipe],
})
export class QASetComponent {
  @Input()
  qaSet: QASet;

  @Input()
  public showParentDateUpdated = true;

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

  public isActive(slug: string): boolean {
    return window.location.hash === `#${slug}`;
  }
}
