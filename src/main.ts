import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig,
} from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { Parser } from 'marked';
import type { MarkedOptions } from 'ngx-markdown';
import { MarkdownModule, MARKED_OPTIONS, MarkedRenderer } from 'ngx-markdown';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { LoggingService } from 'src/app/services/logging.service';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app/app.component';
import { routes } from './routes';

function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.heading = ({ text, depth }): string => {
    let level = depth;
    const baseLevel = 3;
    const maxLevel = 6;
    level = level < baseLevel ? baseLevel : level;
    level = level > maxLevel ? maxLevel : level;

    return `<h${level}>${text}</h${level}>`;
  };

  renderer.link = ({ href, title, tokens }): string => {
    const text = Parser.parseInline(tokens);
    const isExternal = !(
      href.startsWith(window.location.origin) || href.startsWith('/')
    );
    const isPlainUrl = href.includes(text);
    const rel = `external noopener noreferrer ${
      isPlainUrl ? 'x-plain-url' : ''
    }`;

    return `<a href="${href}"
     ${isExternal ? `target="_blank" rel="${rel}"` : ''}
     ${title ? ` title="${title}"` : ''}
     >${text}</a>`;
  };

  renderer.html = ({ text }): string => {
    return text.replaceAll(
      /(?<raw_a_href>href=[\s"']*(?:http|\/\/))/gi,
      ' target="_blank" rel="external noopener noreferrer" $<raw_a_href>',
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
    provideRouter(
      routes,
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
        urlUpdateStrategy: 'eager',
      }),
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'top',
      }),
    ),
    importProvidersFrom(
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
    provideIonicAngular({
      mode: 'md',
      animated: false,
    }),
  ],
}).catch((err) => console.error(err));
