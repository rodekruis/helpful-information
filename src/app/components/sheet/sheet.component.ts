import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { toKebabCase } from 'src/app/shared/utils';

@Component({
  selector: 'sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
})
export class SheetComponent {
  @Input()
  sheetName: string;

  constructor(private router: Router) {}

  public onSheetClick = () => {
    this.router.navigate([toKebabCase(this.sheetName)]);
  };
}
