import { Office } from "src/offices/domain/model/office.entity";
import { OfficeRepository } from "src/offices/domain/repository/office.repository";
import { OfficeNotFoundException } from "../exception/office-not-found.exception";
import { off } from "process";

export class GetOfficeByIdUseCase {
    constructor(
        private readonly officeRepo: OfficeRepository
    ) { }

    async execute(id: number): Promise<Office> {
        try {
            const officeFound = await this.officeRepo.getById(id)
            if (!officeFound) throw new OfficeNotFoundException(id)
            return officeFound
        } catch (error) {
            console.error("Error al obtener la sucursal", error);
            throw error;
        }

    }
}