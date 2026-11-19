import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';

export class CitiesQueryDTO extends PaginationQueryDTO {
    /** Id del departamento para filtrar sus ciudades. */
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    departamento?: number;
}
