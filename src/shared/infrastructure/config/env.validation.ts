import { plainToInstance, Transform } from 'class-transformer';
import { ArrayNotEmpty, IsIn, IsInt, IsNotEmpty, IsString, IsUrl, Max, Min, validateSync } from 'class-validator';

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
