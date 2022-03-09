import { Component, Input } from '@angular/core';

@Component({
  selector: 'sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
})
export class SheetComponent {
  @Input()
  public sheetName: string;

  @Input()
  public sheetUrl: string;

  constructor() {}
}
