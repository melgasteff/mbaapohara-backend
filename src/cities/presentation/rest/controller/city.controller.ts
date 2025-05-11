import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete, Put, UseFilters } from "@nestjs/common";
import { CityDTOMapper } from "../mapper/city-dto.mapper";
import { CountCitiesUseCase } from "src/cities/application/use-case/count.use-case";
import { ResponseModel } from "src/shared/infrasctructure/rest/response-model.dto";
import { NewCityDTO } from "../dto/new-city.dto";
import { CreateCityUseCase } from "src/cities/application/use-case/create.use-case";
import { UpdateCityUseCase } from "src/cities/application/use-case/update.use-case";
import { DeleteCityUseCase } from "src/cities/application/use-case/delete.use-case";
import { GetCityByIdUseCase } from "src/cities/application/use-case/getCityById.use-case";
import { GetAllCitiesUseCase } from "src/cities/application/use-case/getAll.use-case";
import { CityDTO } from "../dto/city.dto";

@Controller('cities')
export class CityController {
    constructor(
        private readonly createCityUC: CreateCityUseCase,
        private readonly updateCityUC: UpdateCityUseCase,
        private readonly deleteCityUC: DeleteCityUseCase,
        private readonly getCityByIdUC: GetCityByIdUseCase,
        private readonly getAllCitiesUC: GetAllCitiesUseCase,
        private readonly countCitiesUC : CountCitiesUseCase
    ) { }

    @Post()
    async createCity(@Body() cityDto: NewCityDTO): Promise<CityDTO>{
        console.log("Hola controller",cityDto)
        console.log("cityDto.descripcion:", cityDto.descripcion);
console.log("cityDto.idpais:", cityDto.idpais);

        return CityDTOMapper.toDTO(await this.createCityUC.execute(cityDto.descripcion, cityDto.idpais));
    }
    @Get()
    async getAllCities (): Promise<ResponseModel<CityDTO>> {
        console.log('controlador')
        const cityDto = (await this.getAllCitiesUC.execute()).map(ciudad => CityDTOMapper.toDTO(ciudad));
        console.log(cityDto)
        return {
            count: await this.countCitiesUC.execute(),
            data: cityDto
        }
    }

    @Get(':id')
    async getCityById(@Param('id', ParseIntPipe) id: number): Promise<CityDTO> {
        return CityDTOMapper.toDTO(await this.getCityByIdUC.execute(id));
    }

    @Put(':id')
    async updateCity(@Param('id', ParseIntPipe) id: number, @Body() city: CityDTO) : Promise<CityDTO> {
        const cityToUpdate = CityDTOMapper.toDomain(city);
        const updatedCity = await this.updateCityUC.execute(id, cityToUpdate);
        return CityDTOMapper.toDTO(updatedCity);
    }

    @Delete(':id')
    deleteCity(@Param('id', ParseIntPipe) id: number): Promise<void>{
        return this.deleteCityUC.execute(id);
    }
}