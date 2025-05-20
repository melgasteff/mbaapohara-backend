import { Company } from "src/offices/domain/model/ company.entity";
import { OfficeRepository } from "src/offices/domain/repository/office.repository";
import { OfficeAlreadyExistsException } from "../exception/office-already-exists.exception";
import { NewOffice } from "src/offices/domain/model/new-office.entity";
import { Office } from "src/offices/domain/model/office.entity";
import { CompanyRepository } from "src/offices/domain/repository/company.respository";

export class CreateOfficeUseCase {
  constructor(
    private readonly officeRepo: OfficeRepository,
    private readonly companyRepo: CompanyRepository
  ) { }

  async execute(nombre: string, email: string, telefono: string, cantEmpleados: number, idciudad: number, idempresa: number): Promise<Office> {
    try {
      const allOffices = await this.officeRepo.getAll();
      const officeFound = await allOffices.find((office) => office.getNombre().toLowerCase() === nombre.toLowerCase());
      const companyFound = await allOffices.find((company) => company.getEmpresa().getId() == idempresa)
      if (officeFound && companyFound) throw new OfficeAlreadyExistsException(nombre);

      const empresa = await this.companyRepo.findById(idempresa)
      if (!empresa) {
        console.error('Empresa no encontrada con id:', idempresa);
        throw new Error(`No se encontró la empresa con id ${idempresa}`);
      }

      const newOffice = await new NewOffice(nombre, email, telefono, cantEmpleados, idciudad, empresa);
      return await this.officeRepo.create(newOffice);

    } catch (error) {
      console.error("Error al crear la sucursal:", error);
      throw error;
    }
  }
}