import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { LoggingService } from './services/logging.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  public envName: string = environment.envName;

  constructor(
    private platform: Platform,
    private loggingService: LoggingService,
  ) {
    this.initializeApp();

    this.loggingService.logPageView('app');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (!!this.envName) {
        document.title += ` [ ${this.envName} ]`;
      }
    });
  }
}
