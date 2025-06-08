import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { ContractRepository } from "src/evaluations/domain/repository/contract.repository"
import { ContractTypeORMModel } from "../model/contract.typeorm.model"
import { Repository } from "typeorm"
import { Contract } from "src/evaluations/domain/model/contract.entity"
import { ContractMapper } from "../../mapper/contract.mapper"

@Injectable()
export class ContractTypeORMRepository implements ContractRepository{
    constructor(
        @InjectRepository(ContractTypeORMModel)
        private readonly contractRepo : Repository<ContractTypeORMModel>
    ){}

    async getAll(): Promise<Contract[]> {
        return (await this.contractRepo.find()).map(contractTypeOrm => ContractMapper.toDomain(contractTypeOrm)) 
    }

    async getById(id: number): Promise<Contract> {
        const contractTypeOrm = await this.contractRepo.findOneBy({id})
        return contractTypeOrm ? ContractMapper.toDomain(contractTypeOrm) : null
    }

    count(): Promise<number> {
        return this.contractRepo.count()
    }

}