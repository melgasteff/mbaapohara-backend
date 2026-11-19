import { Public } from 'src/auth/presentation/decorator/auth.decorators';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { mapPage } from 'src/shared/domain/page';
import { PaginationQueryDTO } from 'src/shared/infrastructure/rest/pagination-query.dto';
import { ContractTypesService } from './contract-types.service';
import { ContractTypeDTO, ContractTypePageDTO } from './dto/contract-type.dto';

@ApiTags('Catálogos')
@Public()
@Controller('contract-types')
export class ContractTypesController {
    constructor(private readonly service: ContractTypesService) { }

    @Get()
    async findAll(@Query() query: PaginationQueryDTO): Promise<ContractTypePageDTO> {
        return mapPage(await this.service.findPage(query), ContractTypeDTO.from);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<ContractTypeDTO> {
        return ContractTypeDTO.from(await this.service.findOne(id));
    }
}
