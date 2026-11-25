import { PickType } from '@nestjs/swagger';
import { CompanyFiltersDTO } from 'src/companies/dto/companies-query.dto';

/** Filtros del panel (GET /insights): rubro o grupo de rubro de la empresa, y departamento o ciudad del local reseñado. */
export class InsightsQueryDTO extends PickType(CompanyFiltersDTO, ['rubro', 'grupo', 'departamento', 'ciudad'] as const) { }
