import { InjectRepository } from "@nestjs/typeorm";
import { Evaluation } from "../entities/evaluation.entity";
import { Repository } from "typeorm";

export class GetCategoriesEvl{
    constructor(
        @InjectRepository(Evaluation) private evaluationRep : Repository<Evaluation>
    ){}
    execute(){

    }
}