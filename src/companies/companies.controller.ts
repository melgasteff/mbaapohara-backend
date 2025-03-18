import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  createCompany(@Body() company: CreateCompanyDto) {
    return this.companiesService.createCompany(company)
  }

  @Get()
  getAllCompanies() {
    return this.companiesService.getAllCompanies();
  }

  @Get(':id')
  getCompanyById(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.getCompanyById(id);
  }

  @Patch(':id')
  updateCompany(@Param('id', ParseIntPipe) id: number, @Body() company: UpdateCompanyDto) {
    return this.companiesService.updateCompany(id, company);
  }

  @Delete(':id')
  deleteCompany(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.deleteCompany(id);
  }
}
