import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesController } from './cities/cities.controller';
import { CitiesService } from './cities/cities.service';
import { City } from './cities/city.entity';
import { ContractTypesController } from './contract-types/contract-types.controller';
import { ContractTypesService } from './contract-types/contract-types.service';
import { ContractType } from './contract-types/contract-type.entity';
import { DepartmentsController } from './departments/departments.controller';
import { DepartmentsService } from './departments/departments.service';
import { Department } from './departments/department.entity';
import { JobsController } from './jobs/jobs.controller';
import { JobsService } from './jobs/jobs.service';
import { Job } from './jobs/job.entity';
import { SectorsController } from './sectors/sectors.controller';
import { SectorsService } from './sectors/sectors.service';
import { Sector } from './sectors/sector.entity';
import { WorkModesController } from './work-modes/work-modes.controller';
import { WorkModesService } from './work-modes/work-modes.service';
import { WorkMode } from './work-modes/work-mode.entity';

// Módulo liviano (docs/arquitectura.md): dueño de las tablas departamentos, ciudades, cargos, rubros,
// tipo_contrato y modalidades. Los demás módulos usan los servicios que exporta.
@Module({
    imports: [TypeOrmModule.forFeature([Department, City, Job, Sector, ContractType, WorkMode])],
    controllers: [
        DepartmentsController, CitiesController, JobsController,
        SectorsController, ContractTypesController, WorkModesController,
    ],
    providers: [
        DepartmentsService, CitiesService, JobsService,
        SectorsService, ContractTypesService, WorkModesService,
    ],
    exports: [
        DepartmentsService, CitiesService, JobsService,
        SectorsService, ContractTypesService, WorkModesService,
    ],
})
export class CatalogsModule { }
