import { 
  ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException 
} from '@nestjs/common';
import { Response } from 'express';
import { ForeignKeyConstraintViolationException } from 'src/reasons/application/exception/foreing-key-constraint-violation.exception';
import { NoReasonsFoundException } from 'src/reasons/application/exception/no-reasons-found.exception';
import { ReasonAlreadyExistsException } from 'src/reasons/application/exception/reason-already-exists.exception';
import { ReasonInUseException } from 'src/reasons/application/exception/reason-in-use.exception';
import { ReasonNotFoundException } from 'src/reasons/application/exception/reason.not-found.exception';



@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    // 404
    if (
      exception instanceof ReasonNotFoundException ||
      exception instanceof NoReasonsFoundException
    ) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    // 409
    if (
      exception instanceof ReasonAlreadyExistsException ||
      exception instanceof ReasonInUseException ||
      exception instanceof ForeignKeyConstraintViolationException
    ) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }

    // HttpException genérica
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();
      message = typeof responseMessage === 'string' ? responseMessage : (responseMessage as any).message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}