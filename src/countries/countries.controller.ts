import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) { }

  @Post()
  createCountry(@Body() newCountry: CreateCountryDto) {
    return this.countriesService.createCountry(newCountry);
  }

  @Get()
  getAllCountries() {
    return this.countriesService.getAllCountries();
  }

  @Get(':id')
  getCountryById(@Param('id', ParseIntPipe) id: number) {
    return this.countriesService.getCountryById(id);
  }

  @Patch(':id')
  updateCountry(@Param('id', ParseIntPipe) id: number, @Body() country: UpdateCountryDto) {
    return this.countriesService.updateCountry(id, country);
  }

  @Delete(':id')
  deleteCountry(@Param('id', ParseIntPipe) id: number) {
    return this.countriesService.deleteCountry(id);
  }

  @Get('/cities/:id')
  getCountryCities(@Param('id', ParseIntPipe) id: number) {
    return this.countriesService.getCountryCities(id)
  }
}
