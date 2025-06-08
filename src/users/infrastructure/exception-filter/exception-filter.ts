import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";
import { Response } from 'express';
import { EmailAlreadyUsedException } from "src/users/application/exception/email-already-used.exception";
import { UserAlreadyExistsException } from "src/users/application/exception/user-already-exists.exception";
import { UserInUseException } from "src/users/application/exception/user-in-use.exception";
import { UserNotFoundException } from "src/users/application/exception/user-not-found.exception";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log('exception filterrrrrr', exception instanceof UserAlreadyExistsException)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Hola Internal server error';

    if (exception instanceof UserNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof UserAlreadyExistsException) {
      console.log("ya existee")
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }

    if (exception instanceof UserInUseException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }

    if (exception instanceof EmailAlreadyUsedException) {
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
