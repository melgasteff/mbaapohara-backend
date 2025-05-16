import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { CompanyAlreadyExistsException } from "src/companies/application/exception/company-already-exists.exception";
import { CompanyInUseException } from "src/companies/application/exception/company-in-use.exception";
import { CompanyNotFoundException } from "src/companies/application/exception/company-not-found.exception";
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'holaaaaaa Internal server error';

    if (exception instanceof CompanyNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof CompanyAlreadyExistsException) {
      console.log("ya existee")
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }

    if (exception instanceof CompanyInUseException) {
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
