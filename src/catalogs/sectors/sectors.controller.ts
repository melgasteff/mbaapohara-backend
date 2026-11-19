import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { mapPage } from 'src/shared/domain/page';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
import { SectorsService } from './sectors.service';
import { SectorDTO, SectorPageDTO } from './dto/sector.dto';

@ApiTags('Catálogos')
@Controller('sectors')
export class SectorsController {
    constructor(private readonly service: SectorsService) { }

    @Get()
    async findAll(@Query() query: PaginationQueryDTO): Promise<SectorPageDTO> {
        return mapPage(await this.service.findPage(query), SectorDTO.from);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<SectorDTO> {
        return SectorDTO.from(await this.service.findOne(id));
    }
}
