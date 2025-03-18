import { Injectable } from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { CreateOffice } from './use-cases/create.use-case';
import { UpdateOffice } from './use-cases/update.use-case';
import { DeleteOffice } from './use-cases/delete.use-case';
import { GetAllOffices } from './use-cases/getAll.use-case';
import { GetOfficeById } from './use-cases/getById.use-case';
import { GetOfficesByCompany } from './use-cases/getByCompany.use-case';

@Injectable()
export class OfficesService {
  constructor(
    private createOfficeUC: CreateOffice, 
    private updateOfficeUC : UpdateOffice,
    private deleteOfficeUC : DeleteOffice, 
    private getAllOficesUC : GetAllOffices, 
    private getOfficeByIdUC : GetOfficeById,
    private getOfficesByCompanyUC : GetOfficesByCompany
    
    
  ){}
  createOffice(office: CreateOfficeDto) {
    return this.createOfficeUC.execute(office)
  }

  getAllOffices() {
    return this.getAllOficesUC.execute()
  }

  getOfficeById(id: number) {
    return this.getOfficeByIdUC.execute(id)
  }

  getOfficesByCompany(id: number){
    return this.getOfficesByCompanyUC.execute(id)
  }

  updateOffice(id:number, office: UpdateOfficeDto) {
    return this.updateOfficeUC.execute(id, office)
  }

  deleteOffice (id: number) {
    return this.deleteOfficeUC. execute(id)
  }
}
