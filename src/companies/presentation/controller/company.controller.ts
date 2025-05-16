import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { CountCompaniesUseCase } from "src/companies/application/use-case/count.use-case";
import { CreateCompanyUseCase } from "src/companies/application/use-case/create.use-case";
import { DeleteCompanyUseCase } from "src/companies/application/use-case/delete.use-case";
import { GetAllCompaniesUseCase } from "src/companies/application/use-case/get-all.use-case";
import { GetCompanyByIdUseCase } from "src/companies/application/use-case/get-by-id.use-case";
import { UpdateCompanyUseCase } from "src/companies/application/use-case/update.use-case";
import { GlobalExceptionFilter } from "src/companies/infrastructure/exception-filter/exception-filter";
import { ResponseModel } from "src/shared/infrasctructure/rest/response-model.dto";
import { CompanyDTOMapper } from "../mapper/company-dto.mapper";
import { CompanyDTO } from "../dto/company.dto";
import { NewCommpanyDTO } from "../dto/new-company.dto";

@UseFilters(GlobalExceptionFilter)
@Controller('companies')
export class CompanyController {
    constructor(
        private readonly createCompanyUC: CreateCompanyUseCase,
        private readonly updateCompanyUC: UpdateCompanyUseCase,
        private readonly deleteCompanyUC: DeleteCompanyUseCase,
        private readonly getCompanyByIdUC: GetCompanyByIdUseCase,
        private readonly getAllCompaniesUC: GetAllCompaniesUseCase,
        private readonly countCompaniesUC : CountCompaniesUseCase
    ) { }

    @Post()
    async createCompany(@Body() companyDto: NewCommpanyDTO): Promise<CompanyDTO>{
        return CompanyDTOMapper.toDTO(await this.createCompanyUC.execute(companyDto.nombre, companyDto.rubro));
    }
    @Get()
    async getAllCompanies (): Promise<ResponseModel<CompanyDTO>> {
        const companyDto = (await this.getAllCompaniesUC.execute()).map(company => CompanyDTOMapper.toDTO(company));
        return {
            count: await this.countCompaniesUC.execute(),
            data: companyDto
        }
    }

    @Get(':id')
    async getCompanyById(@Param('id', ParseIntPipe) id: number): Promise<CompanyDTO> {
        return CompanyDTOMapper.toDTO(await this.getCompanyByIdUC.execute(id));
    }

    @Put(':id')
    async updateCompany(@Param('id', ParseIntPipe) id: number, @Body() company: CompanyDTO) : Promise<CompanyDTO> {
        const companyToUpdate = CompanyDTOMapper.toDomain(company);
        const updatedComppany = await this.updateCompanyUC.execute(id, companyToUpdate);
        return CompanyDTOMapper.toDTO(updatedComppany);
    }

    @Delete(':id')
    deleteCompany(@Param('id', ParseIntPipe) id: number): Promise<void>{
        return this.deleteCompanyUC.execute(id);
    }
}