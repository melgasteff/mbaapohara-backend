import { OfficeRepository } from "src/offices/domain/repository/office.repository";

export class CountOfficesUseCase {
    constructor(
        private officeRepo : OfficeRepository
    ){}

    execute(){
        return this.officeRepo.count();
    }
}