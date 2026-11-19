import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { mapPage } from 'src/shared/domain/page';
import { CitiesService } from './cities.service';
import { CitiesQueryDTO } from './dto/cities-query.dto';
import { CityDTO, CityPageDTO } from './dto/city.dto';

@ApiTags('Catálogos')
@Controller('cities')
export class CitiesController {
    constructor(private readonly service: CitiesService) { }

    @Get()
    async findAll(@Query() query: CitiesQueryDTO): Promise<CityPageDTO> {
        return mapPage(await this.service.findPage(query, query.departamento), CityDTO.from);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<CityDTO> {
        return CityDTO.from(await this.service.findOne(id));
    }
}
