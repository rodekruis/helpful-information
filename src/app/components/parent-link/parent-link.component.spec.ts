import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoggingService } from 'src/app/services/logging.service';

import { ParentLinkComponent } from './parent-link.component';

describe('ParentLinkComponent', () => {
  let component: ParentLinkComponent;
  let fixture: ComponentFixture<ParentLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentLinkComponent],
      providers: [
        provideRouter([]),
        {
          provide: LoggingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
