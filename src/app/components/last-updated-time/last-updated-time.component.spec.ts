import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LastUpdatedTimeService } from 'src/app/services/last-updated-time.service';

import { LastUpdatedTimeComponent } from './last-updated-time.component';

describe('LastUpdatedTimeComponent', () => {
  let component: LastUpdatedTimeComponent;
  let fixture: ComponentFixture<LastUpdatedTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: LastUpdatedTimeService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LastUpdatedTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
