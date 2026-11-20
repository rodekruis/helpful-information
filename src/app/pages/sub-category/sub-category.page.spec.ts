import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoggingService } from 'src/app/services/logging.service';
import { ngxMarkdownModuleFactory } from 'src/app/shared/ngx-markdown.factory';

import SubCategoryPageComponent from './sub-category.page';

describe('SubCategoryPageComponent', () => {
  let component: SubCategoryPageComponent;
  let fixture: ComponentFixture<SubCategoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ngxMarkdownModuleFactory()],
      providers: [
        provideRouter([]),
        {
          provide: LoggingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubCategoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
