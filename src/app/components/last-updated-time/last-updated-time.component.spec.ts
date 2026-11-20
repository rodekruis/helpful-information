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

  it('renders later service updates without forcing change detection', async () => {
    const service = TestBed.inject(LastUpdatedTimeService);

    service.setLastUpdatedTime('2024-02-22T12:00:00Z');
    service.setLastUpdatedLabel('Updated');
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Updated');
    expect(fixture.nativeElement.querySelector('time')).not.toBeNull();
  });
});
