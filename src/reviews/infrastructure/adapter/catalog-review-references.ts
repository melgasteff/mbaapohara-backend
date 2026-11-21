import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractTypesService } from 'src/catalogs/contract-types/contract-types.service';
import { JobsService } from 'src/catalogs/jobs/jobs.service';
import { WorkModesService } from 'src/catalogs/work-modes/work-modes.service';
import { CompaniesService } from 'src/companies/companies.service';
import { CriteriaService } from 'src/criteria/criteria.service';
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

// Adaptador de ReviewReferences con los servicios que exportan `companies`, `catalogs` y `criteria` (docs/arquitectura.md, regla 2).
@Injectable()
export class CatalogReviewReferences extends ReviewReferences {
    constructor(
        private readonly offices: OfficesService,
        private readonly companies: CompaniesService,
        private readonly jobs: JobsService,
        private readonly contractTypes: ContractTypesService,
        private readonly workModes: WorkModesService,
        private readonly criteria: CriteriaService,
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

    activeCriteria(): Promise<ActiveCriterion[]> {
        return this.criteria.activeCriteria();
    }
}
