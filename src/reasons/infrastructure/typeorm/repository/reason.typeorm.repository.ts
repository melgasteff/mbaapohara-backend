import { Injectable } from "@nestjs/common";
import { NewReason } from "src/reasons/domain/model/new-reason.entity";
import { Reason } from "src/reasons/domain/model/reason.entity";
import { ReasonRepository } from "src/reasons/domain/repository/reason.repository";
import { Repository } from "typeorm";
import { ReasonMapper } from "../../mapper/reason.mapper";
import { ReasonTypeORMModel } from "../model/reason.typeorm.model";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ReasonTypeORMRepository implements ReasonRepository {
    constructor(
        @InjectRepository(ReasonTypeORMModel)
        private readonly reasonRepo: Repository<ReasonTypeORMModel>
    ) { }

    async create(newReason: NewReason): Promise<Reason> {
        const reasonOrm = await this.reasonRepo.save(ReasonMapper.toTypeORMModel(newReason))
        return ReasonMapper.toDomain(reasonOrm)
    }
    async getAll(): Promise<Reason[]> {
        const allReasons = await this.reasonRepo.find({ where: { deleted: false } })
        return allReasons.map(reasonOrm => ReasonMapper.toDomain(reasonOrm))
    }
    async getById(id: number): Promise<Reason | null> {
        const reasonEntity = await this.reasonRepo.findOne({ where: { id, deleted: false }})
        return reasonEntity ? ReasonMapper.toDomain(reasonEntity) : null
    }
    async update(id: number, reason: Partial<Reason>): Promise<Reason> {
        const reasonFound = await this.reasonRepo.findOne({ where: { id } })
        const reasonToUpdate = Object.assign(reasonFound, reason)
        const updatedReason = await this.reasonRepo.save(reasonToUpdate)
        return ReasonMapper.toDomain(updatedReason)
    }
    async delete(id: number): Promise<void> {
        const reasonFound = await this.reasonRepo.findOne({ where: { id } })
        reasonFound.deleted = true
        await this.reasonRepo.save(reasonFound)
    }
    count(): Promise<number> {
        return this.reasonRepo.count();
    }

}