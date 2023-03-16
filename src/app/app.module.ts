import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorHandlerService } from './services/error-handler.service';
import { LoggingService } from './services/logging.service';

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.heading = (text: string, level: number): string => {
    const baseLevel = 3;
    const maxLevel = 6;
    level = level < baseLevel ? baseLevel : level;
    level = level > maxLevel ? maxLevel : level;

    return `<h${level}>${text}</h${level}>`;
  };

  renderer.link = (href: string, title: string, text: string): string => {
    const isExternal = !href.startsWith('/');
    return `<a href="${href}"
     ${isExternal ? `target="_blank" rel="external noopener noreferrer"` : ''}
     ${title ? ` title="${title}"` : ''}
     >${text}</a>`;
  };

  renderer.html = (html: string): string => {
    return html.replaceAll(
      /(?<raw_a_href>href=[\s"']*(?:http|\/\/))/gi,
      ` target="_blank" rel="external noopener noreferrer" $<raw_a_href>`,
    );
  };

  return {
    renderer: renderer,
    gfm: true,
    breaks: true,
    pedantic: false,
    smartLists: true,
    smartypants: false,
  };
}

export function ngxMarkdownModuleFactory() {
  return MarkdownModule.forRoot({
    markedOptions: {
      provide: MarkedOptions,
      useFactory: markedOptionsFactory,
    },
  });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md',
      animated: false,
    }),
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.useServiceWorker && environment.production,
      registrationStrategy: 'registerWhenStable:3000',
    }),
    ngxMarkdownModuleFactory(),
  ],
  providers: [
    LoggingService,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
