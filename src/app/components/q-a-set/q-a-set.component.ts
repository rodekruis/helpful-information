import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { QASet } from 'src/app/models/qa-set.model';
import { RegionDataService } from 'src/app/services/region-data.service';

@Component({
  selector: 'app-q-a-set',
  templateUrl: './q-a-set.component.html',
  styleUrls: ['./q-a-set.component.scss'],
  standalone: true,
  imports: [CommonModule, MarkdownModule],
})
export class QASetComponent {
  @Input()
  qaSet: QASet;

  @Input()
  public showParentDateUpdated = true;

  public labelLastUpdated: string;

  constructor(regionDataService: RegionDataService) {
    if (
      !!regionDataService &&
      !!regionDataService.data &&
      !!regionDataService.data.labelLastUpdated
    ) {
      this.labelLastUpdated = regionDataService.data.labelLastUpdated;
    }
  }

  public isActive(slug: string): boolean {
    return window.location.hash === `#${slug}`;
  }
}
