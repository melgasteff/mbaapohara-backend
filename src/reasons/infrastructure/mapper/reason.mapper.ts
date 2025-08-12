import { NewReason } from "src/reasons/domain/model/new-reason.entity";
import { Reason } from "src/reasons/domain/model/reason.entity";
import { ReasonTypeORMModel } from "../typeorm/model/reason.typeorm.model";

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