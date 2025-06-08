import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { SalaryEvaluationAlreadyExistsException } from "src/evaluations/application/exception/salary-evaluation/salary-evaluation-already-exists.exception";
import { SalaryEvaluationNotFoundException } from "src/evaluations/application/exception/salary-evaluation/salary-evaluation-not-found.exception";
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.error(exception)

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error Salary';

    if (exception instanceof SalaryEvaluationNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof SalaryEvaluationAlreadyExistsException) {

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
