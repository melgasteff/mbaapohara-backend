import { Module } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { OfficesController } from './offices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { Office } from './entities/office.entity';
import { City } from 'src/cities/entities/city.entity';
import { CreateOffice } from './use-cases/create.use-case';
import { UpdateOffice } from './use-cases/update.use-case';
import { DeleteOffice } from './use-cases/delete.use-case';
import { GetAllOffices } from './use-cases/getAll.use-case';
import { GetOfficeById } from './use-cases/getById.use-case';
import { GetOfficesByCompany } from './use-cases/getByCompany.use-case';

@Module({
  controllers: [OfficesController],
  providers: [
    OfficesService, 
    CreateOffice,
    UpdateOffice, 
    DeleteOffice, 
    GetAllOffices, 
    GetOfficeById, 
    GetOfficesByCompany
  ],
  exports: [OfficesService], 
  imports: [TypeOrmModule.forFeature([Company, Office, City])]
})
export class OfficesModule {}
