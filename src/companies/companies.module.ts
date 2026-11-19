import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogsModule } from 'src/catalogs/catalogs.module';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './company.entity';
import { Office } from './offices/office.entity';
import { OfficesController } from './offices/offices.controller';
import { OfficesService } from './offices/offices.service';

// Módulo liviano (docs/arquitectura.md): dueño de las tablas empresas y sucursales (locales).
@Module({
    imports: [TypeOrmModule.forFeature([Company, Office]), CatalogsModule],
    controllers: [CompaniesController, OfficesController],
    providers: [CompaniesService, OfficesService],
    exports: [CompaniesService, OfficesService],
})
export class CompaniesModule { }
