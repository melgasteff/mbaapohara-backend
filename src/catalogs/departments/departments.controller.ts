import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { mapPage } from 'src/shared/domain/page';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
import { DepartmentsService } from './departments.service';
import { DepartmentDTO, DepartmentPageDTO } from './dto/department.dto';

@ApiTags('Catálogos')
@Controller('departments')
export class DepartmentsController {
    constructor(private readonly service: DepartmentsService) { }

    @Get()
    async findAll(@Query() query: PaginationQueryDTO): Promise<DepartmentPageDTO> {
        return mapPage(await this.service.findPage(query), DepartmentDTO.from);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<DepartmentDTO> {
        return DepartmentDTO.from(await this.service.findOne(id));
    }
}
