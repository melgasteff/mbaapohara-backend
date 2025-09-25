import { NewReason } from "src/reasons/domain/model/new-reason.entity";
import { ReasonTypeORMModel } from "../typeorm/model/reason.typeorm.model";
import { Reason } from "src/evaluations/domain/model/reason.entity";

export class ReasonMapper{
    static toDomain(ReasonTypeOrm: ReasonTypeORMModel): Reason{
        return new Reason(ReasonTypeOrm.id, ReasonTypeOrm.description, ReasonTypeOrm.rating, ReasonTypeOrm.deleted);
    }

    static toTypeORMModel(newReason: NewReason): ReasonTypeORMModel{
        const reasonTypeORM = new ReasonTypeORMModel();
        reasonTypeORM.description = newReason.getDescription();
        reasonTypeORM.rating = newReason.getRating();
        reasonTypeORM.deleted = newReason.isDeleted()
        return reasonTypeORM;
    }
}