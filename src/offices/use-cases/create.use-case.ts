import { InjectRepository } from "@nestjs/typeorm";
import { Office } from "../entities/office.entity";
import { Repository } from "typeorm";
import { CreateOfficeDto } from "../dto/create-office.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Company } from "src/companies/entities/company.entity";
import { City } from "src/cities1/entities/city.entity";

export class CreateOffice {
    constructor(
        @InjectRepository(Office) private officeRepository: Repository<Office>,
        @InjectRepository(City) private cityRepository: Repository<City>,
        @InjectRepository(Company) private companyRepository: Repository<Company>
    ) { }

    async execute(office: CreateOfficeDto) {

        const id_company = Number(office.empresa)
        console.log(id_company,office.empresa )
        const companyFound = await this.companyRepository.findOne({ where: { id: id_company } })
        if (!companyFound) throw new HttpException('La empresa no existe', HttpStatus.NOT_FOUND)

        const id_city = Number(office.ciudad)
        const cityFound = await this.cityRepository.findOne({ where: { id: id_city } })
        if (!cityFound) throw new HttpException('La ciudad no existe', HttpStatus.NOT_FOUND)
        console.log(cityFound, companyFound)

        const officeFound = await this.officeRepository.findOne({ where: { ciudad: cityFound, empresa: companyFound} })

        if (officeFound) throw new HttpException('La sucursal ya existe', HttpStatus.CONFLICT)
        try {
            const newOffice = this.officeRepository.create(office)

            return this.officeRepository.save(newOffice)
        } catch (error) {
            throw new HttpException('No se ha podido crear la nueva sucursal', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}