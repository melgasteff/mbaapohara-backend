import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from 'express';
import { BenefitEvaluationAlreadyExistsException } from "src/evaluations/application/exception/benefit-evaluation/benefit-evaluation-already-exists.exception";
import { BenefitEvaluationNotFoundException } from "src/evaluations/application/exception/benefit-evaluation/benefit-evaluation-not-found.exception";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.error(exception)

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    if (exception instanceof BenefitEvaluationNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof BenefitEvaluationAlreadyExistsException) {
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
