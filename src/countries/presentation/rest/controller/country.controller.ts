import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { CountCountriesUseCase } from "src/countries/application/use-case/count.use-case";
import { CreateCountryUseCase } from "src/countries/application/use-case/create.use-case";
import { DeleteCountryUseCase } from "src/countries/application/use-case/delete.use-case";
import { GetAllCountriesUseCase } from "src/countries/application/use-case/get-all.use-case";
import { GetCountryByIdUseCase } from "src/countries/application/use-case/get-by-id.use-case";
import { UpdateCountryUseCase } from "src/countries/application/use-case/update.use-case";
import { ResponseModel } from "src/shared/infrasctructure/rest/response-model.dto";
import { CountryDTOMapper } from "../mapper/country-dto.mapper";
import { NewCountryDTO } from "../dto/new-country.dto";
import { CountryDTO } from "../dto/country.dto";

@Controller('countries')
export class CountryController {
    constructor(
        private readonly createCountryUC: CreateCountryUseCase,
        private readonly updateCountryUC: UpdateCountryUseCase,
        private readonly deleteCountryUC: DeleteCountryUseCase,
        private readonly getCountryByIdUC: GetCountryByIdUseCase,
        private readonly getAllCountriesUC: GetAllCountriesUseCase,
        private readonly countCountriesUC: CountCountriesUseCase
    ) { }

    @Post()
    async createCountry(@Body() countryDto: NewCountryDTO): Promise<CountryDTO> {
        return CountryDTOMapper.toDTO(await this.createCountryUC.execute(countryDto.descripcion));
    }
    @Get()
    async getAllCountries(): Promise<ResponseModel<CountryDTO>> {
        const cityDto = (await this.getAllCountriesUC.execute()).map(country => CountryDTOMapper.toDTO(country));
        return {
            count: await this.countCountriesUC.execute(),
            data: cityDto
        }
    }

    @Get(':id')
    async getCountryById(@Param('id', ParseIntPipe) id: number): Promise<CountryDTO> {
        return CountryDTOMapper.toDTO(await this.getCountryByIdUC.execute(id));
    }

    @Put(':id')
    async updateCountry(@Param('id', ParseIntPipe) id: number, @Body() country: CountryDTO): Promise<CountryDTO> {
        const countryToUpdate = CountryDTOMapper.toDomain(country);
        const updatedCity = await this.updateCountryUC.execute(id, countryToUpdate);
        return CountryDTOMapper.toDTO(updatedCity);
    }

    @Delete(':id')
    deleteCountry(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteCountryUC.execute(id);
    }
}