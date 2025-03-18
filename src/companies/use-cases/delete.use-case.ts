import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "../entities/company.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class DeleteCompany {
    constructor(
        @InjectRepository(Company) private companyRepository: Repository<Company>
    ) { }

    async execute(id: number) {
        const result = await this.companyRepository.delete({ id })
        if (result.affected === 0) throw new HttpException('Error al eliminar la compañia', HttpStatus.INTERNAL_SERVER_ERROR)

        return result
    }
}