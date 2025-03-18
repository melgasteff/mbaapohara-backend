import { InjectRepository } from "@nestjs/typeorm";
import { Office } from "../entities/office.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class GetOfficeById {
    constructor(
        @InjectRepository(Office) private officeRepository : Repository<Office>
    ){}

    async execute(id: number){
        const officeFound = await this.officeRepository.findOne({where : {id}})
        if(!officeFound) throw new HttpException('No se ha encontrado la sucursal ', HttpStatus.NOT_FOUND)
        return officeFound
    }
}