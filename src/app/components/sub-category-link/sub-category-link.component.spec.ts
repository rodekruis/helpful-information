import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoggingService } from 'src/app/services/logging.service';

import { SubCategoryLinkComponent } from './sub-category-link.component';

describe('SubCategoryLinkComponent', () => {
  let component: SubCategoryLinkComponent;
  let fixture: ComponentFixture<SubCategoryLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCategoryLinkComponent],
      providers: [
        provideRouter([]),
        {
          provide: LoggingService,
          useValue: null,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubCategoryLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
