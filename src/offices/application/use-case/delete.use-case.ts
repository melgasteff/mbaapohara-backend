import { OfficeRepository } from "src/offices/domain/repository/office.repository";
import { OfficeNotFoundException } from "../exception/office-not-found.exception";
import { OfficeInUseException } from "../exception/office-in-use.exception";

export class DeleteOfficeUseCase {
  constructor(
    private readonly officeRepo: OfficeRepository
  ) { }

  async execute(id: number): Promise<void> {
    try {
      const office = await this.officeRepo.getById(id);

      if (!office) {throw new OfficeNotFoundException(id); }

      await this.officeRepo.delete(id);

    } catch (error) {
      console.error("Error al eliminar la sucursal:", error);
      if (error instanceof Error && error.message.includes('foreign key'))  throw new OfficeInUseException(id);
      throw new error
    }
  }
}