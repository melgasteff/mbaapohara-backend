import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Benefit } from "src/evaluations/domain/model/benefit.entity";
import { BenefitRepository } from "src/evaluations/domain/repository/benefit.repository";
import { BenefitTypeORMModel } from "../model/benefit.model";
import { In, Repository } from "typeorm";
import { BenefitsMapper } from "../../mapper/benefit.mapper";

@Injectable()
export class BenefitTypeORMRepository implements BenefitRepository {
    
    constructor(
        @InjectRepository(BenefitTypeORMModel)
        private benefitTypeORMRepository: Repository<BenefitTypeORMModel>
    ){}

    async getByIds(ids: number[]): Promise<Benefit[]> {
        return BenefitsMapper.toDomainList(await this.benefitTypeORMRepository.findBy({ id: In(ids) }))
    }

}