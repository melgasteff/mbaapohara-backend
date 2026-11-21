import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ContractTypesService } from 'src/catalogs/contract-types/contract-types.service';
import { JobsService } from 'src/catalogs/jobs/jobs.service';
import { WorkModesService } from 'src/catalogs/work-modes/work-modes.service';
import { CompaniesService } from 'src/companies/companies.service';
import { OfficesService } from 'src/companies/offices/offices.service';
import { ProposalStatus } from 'src/shared/domain/proposal-status';
import { ActiveCriterion } from '../../domain/model/review';
import { ReviewReferences } from '../../domain/port/review-references.port';

/** `true` si la consulta encuentra el registro; un 404 del servicio dueño es `false`. */
async function exists(find: () => Promise<unknown>): Promise<boolean> {
    try {
        await find();
        return true;
    } catch (error) {
        if (error instanceof NotFoundException) return false;
        throw error;
    }
}

// Adaptador de ReviewReferences con los servicios que exportan `companies` y `catalogs` (docs/arquitectura.md, regla 2).
@Injectable()
export class CatalogReviewReferences extends ReviewReferences {
    constructor(
        private readonly offices: OfficesService,
        private readonly companies: CompaniesService,
        private readonly jobs: JobsService,
        private readonly contractTypes: ContractTypesService,
        private readonly workModes: WorkModesService,
        private readonly dataSource: DataSource,
    ) {
        super();
    }

    async isOfficeOpen(officeId: number): Promise<boolean> {
        try {
            const office = await this.offices.findApproved(officeId);
            return (await this.companies.findOne(office.idEmpresa)).estado === ProposalStatus.Approved;
        } catch (error) {
            if (error instanceof NotFoundException) return false;
            throw error;
        }
    }

    isJobAvailable(jobId: number): Promise<boolean> {
        return exists(() => this.jobs.findOne(jobId));
    }

    contractTypeExists(id: number): Promise<boolean> {
        return exists(() => this.contractTypes.findOne(id));
    }

    workModeExists(id: number): Promise<boolean> {
        return exists(() => this.workModes.findOne(id));
    }

    // Lee las tablas de los módulos heredados `categories` e `items`, que no conocen el código, el orden ni el estado
    // activo. Es provisorio hasta que la 3.8 cree el módulo `criteria` y su servicio.
    activeCriteria(): Promise<ActiveCriterion[]> {
        return this.dataSource.query(
            `SELECT i.id, i.codigo AS code
             FROM items i JOIN categorias c ON c.id = i.id_categoria
             WHERE i.activo AND c.activo AND i.codigo IS NOT NULL
             ORDER BY c.orden, c.id, i.orden, i.id`);
    }
}
