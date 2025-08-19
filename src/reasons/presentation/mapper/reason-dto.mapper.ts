import { Reason } from "src/reasons/domain/model/reason.entity";
import { ReasonDTO } from "../dto/reason.dto";

export class ReasonDTOMapper {
    static toDTO (reason: Reason): ReasonDTO{
        return {
            id: reason.getId(),
            description: reason.getDescription(),
            rating : reason.getRating()
        }
    }

    static toDomain(reasonDto: ReasonDTO): Reason{
        return new Reason(
            reasonDto.id,
            reasonDto.description,
            reasonDto.rating
        )
    }
}