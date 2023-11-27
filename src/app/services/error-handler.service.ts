import { ErrorHandler, Injectable } from '@angular/core';

import { LoggingService } from './logging.service';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {
  constructor(private loggingService: LoggingService) {
    super();
  }

  override handleError(error: Error) {
    this.loggingService.logException(error);
    const originalError = this.getOriginalError(error);

    if (originalError !== error) {
      this.loggingService.logException(originalError);
    }
  }

  private getOriginalError(error: any) {
    // eslint-disable-next-line no-loops/no-loops
    while (error && error.originalError) {
      error = error.originalError;
    }
    return error;
  }
}
