import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from './cities/infrastructure/module/city.module';
import { CountryModule } from './countries/infrastructure/module/country.module';
import { UserModule } from './users/infrastructure/module/user.module';
import { CompanyModule } from './companies/infrastructure/module/company.module';
import { OfficeModule } from './offices/infrastructure/module/office.module';
import { JobModule } from './jobs/infrastructure/module/job.module';
import { LoginModule } from './session-manager/infrastructure/module/login.module';
import { CategoryModule } from './categories/infrastructure/module/category.module';
import { EvaluationModule } from './evaluations/infrastructure/module/evaluation.module';
import { ItemModule } from './items/infrastructure/module/item.module';
import { EnvironmentVariables, validateEnv } from './shared/infrastructure/config/env.validation';
import { AllExceptionsFilter } from './shared/infrastructure/rest/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => ({
        type: 'postgres',
        host: config.get('DB_HOST', { infer: true }),
        port: config.get('DB_PORT', { infer: true }),
        username: config.get('DB_USER', { infer: true }),
        password: config.get('DB_PASS', { infer: true }),
        database: config.get('DB_NAME', { infer: true }),
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    CityModule,
    CountryModule,
    UserModule,
    CompanyModule,
    OfficeModule,
    JobModule,
    LoginModule,
    CategoryModule,
    EvaluationModule,
    ItemModule
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule { }
