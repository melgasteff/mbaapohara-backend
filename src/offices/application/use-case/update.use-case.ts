import { Office } from "src/offices/domain/model/office.entity";
import { OfficeRepository } from "src/offices/domain/repository/office.repository";
import { OfficeNotFoundException } from "../exception/office-not-found.exception";
import { CompanyRepository } from "src/offices/domain/repository/company.respository";

export class UpdateOfficeUseCase {
  constructor(

    private readonly officeRepo: OfficeRepository,
    private readonly companyRepo: CompanyRepository) { }


  async execute(
    id: number,
    nombre: string,
    email: string,
    telefono: string,
    cantEmpleados: number,
    idciudad: number,
    empresa: number
  ): Promise<Office> {
    try {
      const allOffices = await this.officeRepo.getAll();

      const officeFound = allOffices.find((office) => office.getId() === id);

      if (!officeFound) { throw new OfficeNotFoundException(id); }
      const empresaFound = await this.companyRepo.findById(empresa)
      const partialOffice = new Office(id, nombre, email, telefono, cantEmpleados, idciudad, empresaFound)

      return this.officeRepo.update(id, partialOffice)
    } catch (error) {
      console.error("Error al actualizar la sucursal:", error);
      throw new error
    }

  }
}