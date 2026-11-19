import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { EvaluationAlreadyExistsException } from "src/evaluations/application/exception/evaluation/evaluation-already-exists.exception";
import { EvaluationInUseException } from "src/evaluations/application/exception/evaluation/evaluation-in-use.exception";
import { EvaluationNotFoundException } from "src/evaluations/application/exception/evaluation/evaluation-not-found.exception";
import { Response } from 'express';
import { EvaluationDetailNotFoundException } from "src/evaluations/application/exception/evaluation-detail/evaluation-detail-not-found.exception";
import { EvaluationDetailAlreadyExistsException } from "src/evaluations/application/exception/evaluation-detail/evaluation-detail-already-exists.exception";

@Catch(EvaluationNotFoundException, EvaluationAlreadyExistsException, EvaluationInUseException, EvaluationDetailNotFoundException, EvaluationDetailAlreadyExistsException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

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

    if (exception instanceof EvaluationDetailNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof EvaluationDetailAlreadyExistsException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
