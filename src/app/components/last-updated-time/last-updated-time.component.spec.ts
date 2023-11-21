import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LastUpdatedTimeComponent } from './last-updated-time.component';

describe('LastUpdatedTimeComponent', () => {
  let component: LastUpdatedTimeComponent;
  let fixture: ComponentFixture<LastUpdatedTimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastUpdatedTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
