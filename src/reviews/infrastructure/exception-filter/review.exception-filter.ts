import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import {
    InvalidReviewException, ReviewAlreadyExistsException, ReviewInReviewException, ReviewNotFoundException,
    VersionAlreadyDecidedException, VersionNotFoundException,
} from '../../application/exception/review.exceptions';

const STATUS = new Map<Function, HttpStatus>([
    [ReviewNotFoundException, HttpStatus.NOT_FOUND],
    [ReviewAlreadyExistsException, HttpStatus.CONFLICT],
    [ReviewInReviewException, HttpStatus.CONFLICT],
    [InvalidReviewException, HttpStatus.BAD_REQUEST],
    [VersionNotFoundException, HttpStatus.NOT_FOUND],
    [VersionAlreadyDecidedException, HttpStatus.CONFLICT],
]);

@Catch(ReviewNotFoundException, ReviewAlreadyExistsException, ReviewInReviewException, InvalidReviewException,
    VersionNotFoundException, VersionAlreadyDecidedException)
export class ReviewExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const status = STATUS.get(exception.constructor) ?? HttpStatus.INTERNAL_SERVER_ERROR;
        ctx.getResponse<Response>().status(status).json({
            statusCode: status,
            message: exception.message,
            // La lista de problemas permite marcar cada campo en el asistente.
            ...(exception instanceof InvalidReviewException ? { problemas: exception.problems } : {}),
            path: ctx.getRequest<Request>().path,
            timestamp: new Date().toISOString(),
        });
    }
}
