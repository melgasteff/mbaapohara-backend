import { Office } from "src/offices/domain/model/office.entity";
import { OfficeRepository } from "src/offices/domain/repository/office.repository";

export class GetAllOfficesUseCase {
    constructor(
        private officeRepo: OfficeRepository
    ) { }

    execute(): Promise<Office[]> {
        return this.officeRepo.getAll()
    

    }
}