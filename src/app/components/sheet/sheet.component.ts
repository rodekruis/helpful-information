import { Component, Input, OnInit } from '@angular/core';
import { toKebabCase } from 'src/app/shared/utils';

@Component({
  selector: 'sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
})
export class SheetComponent implements OnInit {
  @Input()
  sheetName: string;

  public sheetUrl: string;

  constructor() {}

  ngOnInit() {
    this.sheetUrl = toKebabCase(this.sheetName);
  }
}
