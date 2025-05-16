import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { CityAlreadyExistsException } from 'src/cities/application/exception/city-already-exists.exception';
import { CityInUseException } from 'src/cities/application/exception/city-in-use.exception';
import { CityNotFoundException } from 'src/cities/application/exception/city-not-found.exception';
import { CountryNotFoundException } from 'src/cities/application/exception/country-not-found.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'holaaaaaa Internal server error';

    if (exception instanceof CityNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof CityAlreadyExistsException) {
      console.log("ya existee")
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }

    if (exception instanceof CityInUseException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }

    if (exception instanceof CountryNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
