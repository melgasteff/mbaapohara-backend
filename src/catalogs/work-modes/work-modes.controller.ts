import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { mapPage } from 'src/shared/domain/page';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
import { WorkModesService } from './work-modes.service';
import { WorkModeDTO, WorkModePageDTO } from './dto/work-mode.dto';

@ApiTags('Catálogos')
@Controller('work-modes')
export class WorkModesController {
    constructor(private readonly service: WorkModesService) { }

    @Get()
    async findAll(@Query() query: PaginationQueryDTO): Promise<WorkModePageDTO> {
        return mapPage(await this.service.findPage(query), WorkModeDTO.from);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<WorkModeDTO> {
        return WorkModeDTO.from(await this.service.findOne(id));
    }
}
