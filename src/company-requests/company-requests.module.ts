import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from 'src/companies/companies.module';
import { ReviewsModule } from 'src/reviews/infrastructure/module/reviews.module';
import { CompanyRequest } from './company-request.entity';
import { CompanyRequestsAdminController, CompanyRequestsController } from './company-requests.controller';
import { CompanyRequestsService } from './company-requests.service';

// Módulo liviano: dueño de la tabla solicitudes_empresa. Usa companies y reviews por los servicios que exportan.
@Module({
    imports: [TypeOrmModule.forFeature([CompanyRequest]), CompaniesModule, ReviewsModule],
    controllers: [CompanyRequestsController, CompanyRequestsAdminController],
    providers: [CompanyRequestsService],
})
export class CompanyRequestsModule { }
