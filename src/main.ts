import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {
  MarkdownModule,
  MARKED_OPTIONS,
  MarkedOptions,
  MarkedRenderer,
} from 'ngx-markdown';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { LoggingService } from 'src/app/services/logging.service';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';

function markedOptionsFactory(): MarkedOptions {
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
    const isPlainUrl = href.includes(text);
    const rel = `external noopener noreferrer ${
      isPlainUrl ? `x-plain-url` : ''
    }`;

    return `<a href="${href}"
     ${isExternal ? `target="_blank" rel="${rel}"` : ''}
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
  };
}

export function ngxMarkdownModuleFactory() {
  return MarkdownModule.forRoot({
    markedOptions: {
      provide: MARKED_OPTIONS,
      useFactory: markedOptionsFactory,
    },
  });
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      IonicModule.forRoot({
        mode: 'md',
        animated: false,
      }),
      AppRoutingModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.useServiceWorker && environment.production,
        registrationStrategy: 'registerWhenStable:3000',
      }),
      ngxMarkdownModuleFactory(),
    ),
    LoggingService,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.log(err));
