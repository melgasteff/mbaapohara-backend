import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/presentation/decorator/auth.decorators';
import { InsightsQueryDTO } from './dto/insights-query.dto';
import { InsightsDTO } from './dto/insights.dto';
import { InsightsService } from './insights.service';

@ApiTags('Indicadores')
@Controller('insights')
export class InsightsController {
    constructor(private readonly service: InsightsService) { }

    /** Panel público: cumplimiento por categoría y por criterio, con los filtros dados. */
    @Public()
    @Get()
    find(@Query() filters: InsightsQueryDTO): Promise<InsightsDTO> {
        return this.service.find(filters);
    }
}
