import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Office } from 'src/offices/entities/office.entity';
import { City } from 'src/cities/entities/city.entity';
import { CreateCompany } from './use-cases/create.use-case';
import { UpdateCompany } from './use-cases/update.use-case';
import { DeleteCompany } from './use-cases/delete.use-case';
import { GetCompanyById } from './use-cases/getById.use-case';
import { GetAllCompanies } from './use-cases/getAll.use-case';

@Module({
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    CreateCompany,
    UpdateCompany, 
    DeleteCompany,
    GetCompanyById,
    GetAllCompanies,
  ],
  exports : [CompaniesService],
  imports: [TypeOrmModule.forFeature([Company,  Office, City])]
})
export class CompaniesModule {}
