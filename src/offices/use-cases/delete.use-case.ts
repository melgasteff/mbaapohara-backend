import { InjectRepository } from "@nestjs/typeorm";
import { Office } from "../entities/office.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class DeleteOffice {
    constructor(
        @InjectRepository(Office) private officeRepository: Repository<Office>
    ) { }

    async execute(id: number) {
        const result = await this.officeRepository.delete(id)
        if (result.affected === 0) throw new HttpException('No se ha encontrado la sucursal', HttpStatus.NOT_FOUND)

        return result
    }
}