import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { CountOfficesUseCase } from "src/offices/application/use-case/count.use-case";
import { CreateOfficeUseCase } from "src/offices/application/use-case/create.use-case";
import { DeleteOfficeUseCase } from "src/offices/application/use-case/delete.use-case";
import { GetAllOfficesUseCase } from "src/offices/application/use-case/get-all.use-case";
import { GetOfficeByIdUseCase } from "src/offices/application/use-case/get-by-id.use-case";
import { UpdateOfficeUseCase } from "src/offices/application/use-case/update.use-case";
import { GlobalExceptionFilter } from "src/offices/infrastructure/exception-filter/exception-filter";
import { NewOfficeDTO } from "../dto/new-office.dto";
import { OfficeDTO } from "../dto/office.dto";
import { OfficeDTOMapper } from "../mapper/office-dto.mapper";
import { ResponseModel } from "src/shared/infrastructure/rest/response-model.dto";
import { OfficeMapper } from "src/offices/infrastructure/mapper/office.mapper";

@UseFilters(GlobalExceptionFilter)
@Controller('offices')
export class OfficeController {
    constructor(
        private readonly createOfficeUC: CreateOfficeUseCase,
        private readonly updateOfficeUC: UpdateOfficeUseCase,
        private readonly deleteOfficeUC: DeleteOfficeUseCase,
        private readonly getOfficeByIdUC: GetOfficeByIdUseCase,
        private readonly getAllOfficesUC: GetAllOfficesUseCase,
        private readonly countOfficesUC : CountOfficesUseCase
    ) { }

    @Post()
    async createOffice(@Body() officeDTO: NewOfficeDTO): Promise<OfficeDTO>{
        const office = await this.createOfficeUC.execute(
            officeDTO.nombre, 
            officeDTO.email,
            officeDTO.telefono,
            officeDTO.cantEmpleados,
            officeDTO.idCiudad,
            officeDTO.idempresa
        );
        return OfficeDTOMapper.toDTO(office);
    }

    @Get()
    async getAllOffices (): Promise<ResponseModel<OfficeDTO>> {
        const officeDto = (await this.getAllOfficesUC.execute()).map(office => OfficeDTOMapper.toDTO(office));
        return {
            count: await this.countOfficesUC.execute(),
            data: officeDto
        }
    }

    @Get(':id')
    async getOfficeById(@Param('id', ParseIntPipe) id: number): Promise<OfficeDTO> {
        return OfficeDTOMapper.toDTO(await this.getOfficeByIdUC.execute(id));
    }

    @Put(':id')
    async updateOffice(@Param('id', ParseIntPipe) id: number, @Body() officeDTO: OfficeDTO) : Promise<OfficeDTO> {
        const updatedOffice =await this.updateOfficeUC.execute(
            id,
            officeDTO.nombre, 
            officeDTO.email,
            officeDTO.telefono,
            officeDTO.cantEmpleados,
            officeDTO.idCiudad,
            officeDTO.idempresa
        )
         return OfficeDTOMapper.toDTO(updatedOffice);
    }

    @Delete(':id')
    deleteOffice(@Param('id', ParseIntPipe) id: number): Promise<void>{
        return this.deleteOfficeUC.execute(id);
    }
}