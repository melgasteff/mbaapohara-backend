import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateSalaryEvlDto } from './dto/create-salaryEvl.dto';
import { SalariesEvlService } from './salariesEvl.service';
import { UpdateSalaryEvlDto } from './dto/update-salaryEvl.dto';


@Controller('salariesEvl')
export class SalariesController {
  constructor(private readonly salariesService: SalariesEvlService) {}

  @Post()
  create(@Body() salaryEvl: CreateSalaryEvlDto) {
    return this.salariesService.createSalaryEvl(salaryEvl);
  }

  @Get()
  getAllSalariesEvl() {
    return this.salariesService.getAllSalariesEvl();
  }

  @Get(':id')
  getSalaryEvlById(@Param('id', ParseIntPipe) id: number) {
    return this.salariesService.getSalaryEvlById(id);
  }

  @Patch(':id')
  updateSalaryEvl(@Param('id', ParseIntPipe) id: number, @Body() salaryEvl: UpdateSalaryEvlDto) {
    return this.salariesService.updateSalaryEvl(id, salaryEvl);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salariesService.remove(+id);
  }
}
