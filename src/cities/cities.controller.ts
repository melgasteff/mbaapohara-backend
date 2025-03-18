import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) { }

  @Post()
  createCity(@Body() city: CreateCityDto) {
    return this.citiesService.createCity(city);
  }

  @Get()
  getCities() {
    return this.citiesService.getCities();
  }

  @Get(':id')
  getCity(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.getCityById(id);
  }

  @Patch(':id')
  updateCity(@Param('id', ParseIntPipe) id: number, @Body() city: UpdateCityDto) {
    return this.citiesService.updateCity(id, city);
  }

  @Delete(':id')
  deleteCity(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.deleteCity(id);
  }
}
