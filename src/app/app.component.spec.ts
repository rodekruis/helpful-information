import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { AppComponent } from 'src/app/app.component';
import { LoggingService } from 'src/app/services/logging.service';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
        AppComponent,
      ],
      providers: [LoggingService, SwUpdate],
    }).compileComponents();
  }));

  it('should create the app', () => {
    // Arrange
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    // Act
    fixture.detectChanges();

    // Assert
    expect(app).toBeTruthy();
  });
});
