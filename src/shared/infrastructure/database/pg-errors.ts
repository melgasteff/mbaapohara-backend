import { QueryFailedError } from 'typeorm';

// Códigos de error de PostgreSQL que la API traduce a respuestas HTTP.
// https://www.postgresql.org/docs/current/errcodes-appendix.html
const UNIQUE_VIOLATION = '23505';
const FOREIGN_KEY_VIOLATION = '23503';

function pgCode(error: unknown): string | undefined {
    return error instanceof QueryFailedError ? (error.driverError as { code?: string })?.code : undefined;
}

// Se violó una restricción UNIQUE (registro duplicado).
export const isUniqueViolation = (error: unknown) => pgCode(error) === UNIQUE_VIOLATION;

// Se violó una clave foránea (por ejemplo, borrar un registro que otro usa).
export const isForeignKeyViolation = (error: unknown) => pgCode(error) === FOREIGN_KEY_VIOLATION;
