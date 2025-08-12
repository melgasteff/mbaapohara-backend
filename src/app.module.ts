import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from './cities/infrastructure/module/city.module';
import { CountryModule } from './countries/infrastructure/module/country.module';
import { UserModule } from './users/infrastructure/module/user.module';
import { CompanyModule } from './companies/infrastructure/module/company.module';
import { OfficeModule } from './offices/infrastructure/module/office.module';
import { JobModule } from './jobs/infrastructure/module/job.module';
import { LoginModule } from './session-manager/infrastructure/module/login.module';
import { CategoryModule } from './categories/infrastructure/module/category.module';
import { ReasonModule } from './reasons/infrastructure/module/reason.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345678',
      database: 'mbaapohara',
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
    ReasonModule
  ],
})
export class AppModule { }
