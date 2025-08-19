import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from './cities/infrastructure/module/city.module';
import { CountryModule } from './countries/infrastructure/module/country.module';
import { UserModule } from './users/infrastructure/module/user.module';
import { CompanyModule } from './companies/infrastructure/module/company.module';
import { OfficeModule } from './offices/infrastructure/module/office.module';
import { JobModule } from './jobs/infrastructure/module/job.module';
import { LoginModule } from './session-manager/infrastructure/module/login.module';
import datasource from './shared/infrastructure/database/data-source';
import { CategoryModule } from './categories/infrastructure/module/category.module';
import { ReasonModule } from './reasons/infrastructure/module/reason.module';
import { EvaluationModule } from './evaluations/infrastructure/module/evaluation.module';
import { ItemModule } from './items/infrastructure/module/item.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...datasource.options,
      autoLoadEntities: true,
    }),
    CityModule,
    CountryModule,
    UserModule,
    CompanyModule,
    OfficeModule,
    JobModule,
    LoginModule,
    CategoryModule, 
    ReasonModule, 
    EvaluationModule, 
    ItemModule
  ],
})
export class AppModule { }
