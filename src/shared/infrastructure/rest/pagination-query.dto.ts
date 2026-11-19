import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { PageRequest } from 'src/shared/domain/page';

// Parámetros de consulta comunes a todos los listados: ?page=1&pageSize=20
export class PaginationQueryDTO implements PageRequest {
    /** Número de página, desde 1. */
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    /** Elementos por página, entre 1 y 100. */
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    pageSize: number = 20;
}
