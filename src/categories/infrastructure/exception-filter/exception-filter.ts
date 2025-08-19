import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";
import { CategoryAlreadyExistsException } from "src/categories/application/exception/category-already-exists.exception";
import { CategoryInUseException } from "src/categories/application/exception/category-in-use.exception";
import { CategoryNotFoundException } from "src/categories/application/exception/category-not-found.exception";
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log("Exception filter")
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Category Internal server error';

    if (exception instanceof CategoryNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof CategoryAlreadyExistsException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }

    if (exception instanceof CategoryInUseException) {
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
