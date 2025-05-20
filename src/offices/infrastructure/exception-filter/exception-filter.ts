import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { OfficeAlreadyExistsException } from "src/offices/application/exception/office-already-exists.exception";
import { OfficeInUseException } from "src/offices/application/exception/office-in-use.exception";
import { OfficeNotFoundException } from "src/offices/application/exception/office-not-found.exception";
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error Office';

    if (exception instanceof OfficeNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof OfficeAlreadyExistsException) {

      status = HttpStatus.CONFLICT;
      message = exception.message;
    }

    if (exception instanceof OfficeInUseException) {
      status = HttpStatus.CONFLICT;
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
