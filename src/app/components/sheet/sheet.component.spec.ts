import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SheetComponent } from './sheet.component';

describe('SheetComponent', () => {
  let component: SheetComponent;
  let fixture: ComponentFixture<SheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SheetComponent],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetComponent);
    component = fixture.componentInstance;
    component.sheetName = 'Mock Sheet';
    component.sheetUrl = 'mock-sheet';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
