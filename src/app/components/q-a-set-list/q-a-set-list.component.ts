import { DatePipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BreadcrumbsComponent } from 'src/app/components/breadcrumbs/breadcrumbs.component';
import { QASetComponent } from 'src/app/components/q-a-set/q-a-set.component';
import type { QASet } from 'src/app/models/qa-set.model';
import { RegionDataService } from 'src/app/services/region-data.service';

@Component({
  selector: 'app-q-a-set-list',
  templateUrl: './q-a-set-list.component.html',
  styleUrls: ['./q-a-set-list.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    NgTemplateOutlet,
    BreadcrumbsComponent,
    QASetComponent,
  ],
})
export class QASetListComponent {
  @Input()
  list: QASet[];

  @Input()
  public baseUrl: string = '';

  @Input()
  public showDateUpdatedOutsideQuestion = true;

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
}
