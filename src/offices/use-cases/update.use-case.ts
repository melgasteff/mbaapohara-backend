import { InjectRepository } from "@nestjs/typeorm";
import { Office } from "../entities/office.entity";
import { Repository } from "typeorm";
import { UpdateOfficeDto } from "../dto/update-office.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

export class UpdateOffice {
    constructor(
        @InjectRepository(Office) private officeRepository: Repository<Office>
    ) { }

    async execute(id: number, office: UpdateOfficeDto) {
        const officeFound = await this.officeRepository.findOne({ where: { id }, relations: ['ciudad', 'empresa'] })
        if (!officeFound) throw new HttpException('No se ha encontrado la sucursal', HttpStatus.NOT_FOUND)

        const empresaId = Number(office.empresa)
        const ciudadId = Number(office.ciudad)

        if (empresaId && officeFound.empresa !== office.empresa ||
            ciudadId && officeFound.ciudad !== office.ciudad) {
            const repeatedOffice = await this.officeRepository.findOne({
                where: {
                    ciudad: { id: ciudadId }, empresa: { id: empresaId }
                }, relations: ['ciudad', 'empresa']
            })

            if (repeatedOffice && repeatedOffice.id !== id) throw new HttpException('La sucursal ya existe', HttpStatus.CONFLICT)
        }

        const updatedOffice = Object.assign(officeFound, office)
        return await this.officeRepository.save(updatedOffice)
    }
}