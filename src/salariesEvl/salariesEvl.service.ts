import { Injectable } from '@nestjs/common';
import { CreateSalaryEvlDto } from './dto/create-salaryEvl.dto';
import { UpdateSalaryEvlDto } from './dto/update-salaryEvl.dto';
import { CreateSalaryEvl } from './use-cases/create.use-case';
import { GetAllSalariesEvl } from './use-cases/getAll.use-cases';
import { UpdateSalatyEvl } from './use-cases/update.use-case';
import { GetSalaryEvlById } from './use-cases/getById.use-case';

@Injectable()
export class SalariesEvlService {
  constructor(
    private createSalaryEvlUC : CreateSalaryEvl,
    private getAllSalariesEvlUC : GetAllSalariesEvl, 
    private updateSalaryEvlUC : UpdateSalatyEvl, 
    private getSalaryEvlByIdUC : GetSalaryEvlById
    
  ){}
  createSalaryEvl(salaryEvl : CreateSalaryEvlDto) {
    return this.createSalaryEvlUC.execute(salaryEvl)
  }

  getAllSalariesEvl() {
    return this.getAllSalariesEvlUC.execute()
  }

  getSalaryEvlById(id_evaluacion: number) {
    return this.getSalaryEvlByIdUC.execute(id_evaluacion)
  }

  updateSalaryEvl(id: number, salaryEvl: UpdateSalaryEvlDto) {
    return this.updateSalaryEvlUC.execute(id, salaryEvl)
  }

  remove(id: number) {
    return `This action removes a #${id} salary`;
  }
}
