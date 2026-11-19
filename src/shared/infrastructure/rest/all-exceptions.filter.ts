import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

// Filtro global: recibe lo que los filtros de cada módulo no traducen.
// - HttpException (validación, 404 de ruta, etc.): responde su código y mensaje.
// - Cualquier otro error: responde 500 con un mensaje genérico y registra el detalle una sola vez.
// Nunca registra el body de la petición, para no guardar contraseñas ni datos personales.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger('ExceptionFilter');

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: unknown = 'Error interno del servidor';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const body = exception.getResponse();
            message = typeof body === 'object' && body !== null && 'message' in body
                ? (body as { message: unknown }).message
                : body;
        } else {
            const error = exception instanceof Error ? exception : new Error(String(exception));
            this.logger.error(`${request.method} ${request.path} -> ${error.name}: ${error.message}`, error.stack);
        }

        response.status(status).json({
            statusCode: status,
            message,
            path: request.path,
            timestamp: new Date().toISOString(),
        });
    }
}
