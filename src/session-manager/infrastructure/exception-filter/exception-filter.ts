import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, HttpException, UnauthorizedException } from "@nestjs/common";
import { Response } from 'express';
import { PasswordNotFoundException } from "src/session-manager/application/exception/password-not-found.exception";
import { UserNotFoundException } from "src/users/application/exception/user-not-found.exception";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    if (exception instanceof UserNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof PasswordNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof UnauthorizedException) {
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
