import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
import { ProposalStatus } from 'src/shared/domain/proposal-status';

// Listado de administración (GET /offices/admin): locales en cualquier estado.
export class AdminOfficesQueryDTO extends PaginationQueryDTO {
    /** Estado del local. Sin este filtro, todos. */
    @IsOptional()
    @IsEnum(ProposalStatus)
    estado?: ProposalStatus;

    /** Id de la empresa. */
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    empresa?: number;
}
