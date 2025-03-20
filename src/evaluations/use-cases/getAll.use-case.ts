import { InjectRepository } from "@nestjs/typeorm";
import { Evaluation } from "../entities/evaluation.entity";
import { Repository } from "typeorm";

export class GetAllEvaluations {
    constructor(
        @InjectRepository(Evaluation) private evaluationRepository : Repository <Evaluation>
    ){}

    execute(){
        return this.evaluationRepository.find({relations: ['company', 'job', 'user', 'office']})
    }
}