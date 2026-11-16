import { ErrorHandler, inject, Injectable } from '@angular/core';

import { LoggingService } from './logging.service';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {
  private loggingService = inject(LoggingService);

  override handleError(error: unknown) {
    this.loggingService.logException(error);
    const originalError = this.getOriginalError(error);

    if (originalError !== error) {
      this.loggingService.logException(originalError);
    }
  }

  private getOriginalError(error: unknown): unknown {
    // eslint-disable-next-line no-restricted-syntax -- External example/recommended syntax used as-is
    while (
      error &&
      (typeof error === 'object' || typeof error === 'function') &&
      'originalError' in error &&
      error.originalError
    ) {
      error = error.originalError;
    }
    return error;
  }
}
