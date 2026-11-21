import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogsModule } from './catalogs/catalogs.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/infrastructure/module/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { CriteriaModule } from './criteria/criteria.module';
import { ReviewsModule } from './reviews/infrastructure/module/reviews.module';
import { CompanyRequestsModule } from './company-requests/company-requests.module';
import { EnvironmentVariables, validateEnv } from './shared/infrastructure/config/env.validation';
import { AllExceptionsFilter } from './shared/infrastructure/rest/all-exceptions.filter';
import { ModerationModule } from './moderation/infrastructure/module/moderation.module';

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
    CatalogsModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    ModerationModule,
    CriteriaModule,
    ReviewsModule,
    CompanyRequestsModule
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule { }
