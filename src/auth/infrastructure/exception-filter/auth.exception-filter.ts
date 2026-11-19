import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import {
    AccountBlockedException, AccountNotFoundException, ConsentRequiredException,
    EmailAlreadyRegisteredException, InvalidCredentialsException,
} from '../../application/exception/auth.exceptions';

const STATUS = new Map<Function, HttpStatus>([
    [InvalidCredentialsException, HttpStatus.UNAUTHORIZED],
    [AccountBlockedException, HttpStatus.FORBIDDEN],
    [EmailAlreadyRegisteredException, HttpStatus.CONFLICT],
    [ConsentRequiredException, HttpStatus.BAD_REQUEST],
    [AccountNotFoundException, HttpStatus.NOT_FOUND],
]);

@Catch(InvalidCredentialsException, AccountBlockedException, EmailAlreadyRegisteredException, ConsentRequiredException, AccountNotFoundException)
export class AuthExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const status = STATUS.get(exception.constructor) ?? HttpStatus.INTERNAL_SERVER_ERROR;
        ctx.getResponse<Response>().status(status).json({
            statusCode: status,
            message: exception.message,
            path: ctx.getRequest<Request>().path,
            timestamp: new Date().toISOString(),
        });
    }
}
