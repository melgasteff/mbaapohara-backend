import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { JobAlreadyExistsException } from "src/jobs/application/exception/job-already-exists.exception";
import { JobInUseException } from "src/jobs/application/exception/job-in-use.exception";
import { JobNotFoundException } from "src/jobs/application/exception/job-not-found.exception";
import { Response } from 'express';

@Catch(JobNotFoundException, JobAlreadyExistsException, JobInUseException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error Office';

    if (exception instanceof JobNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof JobAlreadyExistsException) {

      status = HttpStatus.CONFLICT;
      message = exception.message;
    }

    if (exception instanceof JobInUseException) {
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