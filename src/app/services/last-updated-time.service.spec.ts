import { TestBed } from '@angular/core/testing';
import { LastUpdatedTimeService } from './last-updated-time.service';

describe('LastUpdatedTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LastUpdatedTimeService = TestBed.inject(
      LastUpdatedTimeService,
    );

    expect(service).toBeTruthy();
  });
});
