import { plainToInstance, Transform } from 'class-transformer';
import { ArrayNotEmpty, IsIn, IsInt, IsNotEmpty, IsString, IsUrl, Matches, Max, Min, MinLength, validateSync } from 'class-validator';

// Variables de entorno de la API. Si alguna falta o es inválida, la aplicación no arranca.
export class EnvironmentVariables {
    @IsIn(['development', 'production', 'test'])
    NODE_ENV: 'development' | 'production' | 'test' = 'development';

    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    @Max(65535)
    PORT: number = 3000;

    @IsString()
    @IsNotEmpty()
    DB_HOST: string;

    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    @Max(65535)
    DB_PORT: number;

    @IsString()
    @IsNotEmpty()
    DB_USER: string;

    @IsString()
    @IsNotEmpty()
    DB_PASS: string;

    @IsString()
    @IsNotEmpty()
    DB_NAME: string;

    // Lista separada por comas, por ejemplo: http://localhost:4200,https://mbaapohara.example
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.split(',').map(origin => origin.trim()).filter(origin => origin.length > 0)
            : value)
    @ArrayNotEmpty({ message: 'CORS_ORIGINS debe tener al menos un origen' })
    @IsUrl({ require_tld: false, require_protocol: true }, { each: true, message: 'CORS_ORIGINS tiene un origen inválido' })
    CORS_ORIGINS: string[];

    // Secreto para firmar los tokens. Al menos 32 caracteres; generar con: openssl rand -base64 48
    @IsString()
    @MinLength(32, { message: 'JWT_SECRET debe tener al menos 32 caracteres' })
    JWT_SECRET: string;

    // Vigencia del token de acceso, en el formato de jsonwebtoken: 2h, 30m, 1d...
    @Matches(/^\d+[smhd]$/, { message: 'JWT_EXPIRES_IN debe ser un número seguido de s, m, h o d (por ejemplo, 2h)' })
    JWT_EXPIRES_IN: string = '2h';
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
    const env = plainToInstance(EnvironmentVariables, config, { exposeDefaultValues: true });
    const errors = validateSync(env, { skipMissingProperties: false });

    if (errors.length > 0) {
        const detail = errors
            .map(error => `${error.property}: ${Object.values(error.constraints ?? {}).join(', ')}`)
            .join('\n  ');
        throw new Error(`Configuración inválida:\n  ${detail}`);
    }
    return env;
}
