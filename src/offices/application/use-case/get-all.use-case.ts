import { Office } from "src/offices/domain/model/office.entity";
import { OfficeRepository } from "src/offices/domain/repository/office.repository";

export class GetAllOfficesUseCase {
    constructor(
        private officeRepo: OfficeRepository
    ) { }

    execute(): Promise<Office[]> {
        try {
            return this.officeRepo.getAll()
        } catch (error) {
            console.error("Error al obtener las sucursales:", error);
            throw error;
        }

    }
}