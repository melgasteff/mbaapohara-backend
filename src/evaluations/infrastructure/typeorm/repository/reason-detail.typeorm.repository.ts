import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReasonDetailRepository } from "src/evaluations/domain/repository/reason-detail.repository";
import { ReasonDetailTypeORMModel } from "../model/reason-detail.typeorm.model";
import { Repository } from "typeorm";
import { ReasonDetail } from "src/evaluations/domain/model/reason-detail.entity";
import { ReasonDetailMapper } from "../../mapper/reason-detail.mapper";

@Injectable()
export class ReasonDetailTypeORMRepository implements ReasonDetailRepository {
    constructor(
        @InjectRepository(ReasonDetailTypeORMModel)
        private readonly reasonDetailRepo: Repository<ReasonDetailTypeORMModel>,
    ) { }
    async create(newReasonDetail: ReasonDetail): Promise<ReasonDetail> {
        const reasonDetailTypeOrm = await this.reasonDetailRepo.save(ReasonDetailMapper.toTypeORMModel(newReasonDetail))
        const fullAttributes = await this.reasonDetailRepo.findOne({
            where: {
                idEvaluation: reasonDetailTypeOrm.idEvaluation,
                idReason: reasonDetailTypeOrm.idReason,
            },
            relations: ['evaluationDetail', 'reason']
        })
        return ReasonDetailMapper.toDomain(fullAttributes)
    }
    async getById(idEvaluation: number, idReason: number): Promise<ReasonDetail> {
        const reasonDetailORM = await this.reasonDetailRepo.findOne({
            where: { idEvaluation, idReason },
            relations: ['evaluationDetail', 'reason'],
        });
        return reasonDetailORM ? ReasonDetailMapper.toDomain(reasonDetailORM) : null
    }
    async getAll(idEvaluation: number, idReason: number): Promise<ReasonDetail[]> {
        return (await this.reasonDetailRepo.find(
            {
                where: { idEvaluation, idReason },
                relations: ['reason', 'evaluationDetail']
            }
        )).map(evaluationTypeOrm => ReasonDetailMapper.toDomain(evaluationTypeOrm));
    }

    //Revisar
    async delete(idEvaluation: number, idReason: number): Promise<void> {
        await this.reasonDetailRepo.delete({ idEvaluation })
    }
    count(): Promise<number> {
        return this.reasonDetailRepo.count()
    }

}