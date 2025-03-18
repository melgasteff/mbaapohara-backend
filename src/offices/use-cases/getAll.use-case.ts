import { InjectRepository } from "@nestjs/typeorm";
import { Office } from "../entities/office.entity";
import { Repository } from "typeorm";

export class GetAllOffices {
    constructor(
        @InjectRepository(Office) private officeRepository : Repository<Office>
    ){}

    execute(){
        return this.officeRepository.find()
    }
}