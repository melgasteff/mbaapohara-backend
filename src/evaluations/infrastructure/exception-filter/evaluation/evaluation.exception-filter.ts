import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { EvaluationAlreadyExistsException } from "src/evaluations/application/exception/evaluation/evaluation-already-exists.exception";
import { EvaluationNotFoundException } from "src/evaluations/application/exception/evaluation/evaluation-not-found.exception";
import { Response } from 'express';
import { EvaluationInUseException } from "src/evaluations/application/exception/evaluation/evaluation-in-use.exception";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.error(exception)

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    if (exception instanceof EvaluationNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof EvaluationAlreadyExistsException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }

    if (exception instanceof EvaluationInUseException) {
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
