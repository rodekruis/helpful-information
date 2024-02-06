import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggingService } from 'src/app/services/logging.service';

import { ParentLinkComponent } from './parent-link.component';

describe('ParentLinkComponent', () => {
  let component: ParentLinkComponent;
  let fixture: ComponentFixture<ParentLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ParentLinkComponent, RouterTestingModule],
      providers: [
        {
          provide: LoggingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
