import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { CountryNotFoundException } from "src/cities/application/exception/country-not-found.exception";
import { CountryAlreadyExistsException } from "src/countries/application/exception/country-already-exists.exception";
import { CountryInUseException } from "src/countries/application/exception/country-in-use.exception";
import { Response } from 'express';

@Catch(CountryNotFoundException, CountryAlreadyExistsException, CountryInUseException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    if (exception instanceof CountryNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof CountryAlreadyExistsException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }

    if (exception instanceof CountryInUseException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      ...message,
      timestamp: new Date().toISOString(),
    });
  }
}