import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { NumericType } from 'typeorm';

@Controller('offices')
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Post()
  createOffice (@Body() office: CreateOfficeDto) {
    return this.officesService.createOffice(office);
  }

  @Get()
  getAllOffices() {
    return this.officesService.getAllOffices();
  }

  @Get(':id')
  getOfficeById(@Param('id', ParseIntPipe) id: number) {
    return this.officesService.getOfficeById(id);
  }

  @Get('/company/:id_empresa')
  getOfficesByCompany(@Param('id_empresa') id_empresa : number){
    return this.officesService.getOfficesByCompany(id_empresa)
  }

  @Patch(':id')
  updateOffice(
    @Param('id', ParseIntPipe) id: number,
    @Body() office: UpdateOfficeDto) {
    return this.officesService.updateOffice(id, office);
  }

  @Delete(':id')
  deleteOffice(@Param('id', ParseIntPipe) id: number) {
    return this.officesService.deleteOffice(id);
  }
}
