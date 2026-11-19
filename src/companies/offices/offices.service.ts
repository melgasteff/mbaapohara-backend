import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CitiesService } from 'src/catalogs/cities/cities.service';
import { Page, PageRequest } from 'src/shared/domain/page';
import { findPage } from 'src/shared/infrastructure/database/find-page';
import { isForeignKeyViolation, isUniqueViolation } from 'src/shared/infrastructure/database/pg-errors';
import { ensureCatalogRef } from '../catalog-refs';
import { Company } from '../company.entity';
import { ProposalStatus } from '../proposal-status';
import { SaveOfficeDTO } from './dto/save-office.dto';
import { Office } from './office.entity';

@Injectable()
export class OfficesService {
    constructor(
        @InjectRepository(Office) private readonly repo: Repository<Office>,
        @InjectRepository(Company) private readonly companies: Repository<Company>,
        private readonly cities: CitiesService,
    ) { }

    findByCompany(idEmpresa: number, request: PageRequest, estado = ProposalStatus.Approved): Promise<Page<Office>> {
        return findPage(this.repo, request, {
            where: { idEmpresa, estado },
            relations: { ciudad: true },
            order: { nombre: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Office> {
        const office = await this.repo.findOne({ where: { id }, relations: { ciudad: true } });
        if (!office) throw new NotFoundException(`No existe el local ${id}`);
        return office;
    }

    // Un local nuevo queda pendiente, aunque su empresa ya esté aprobada.
    async propose(idEmpresa: number, data: SaveOfficeDTO, manager?: EntityManager): Promise<Office> {
        const companies = manager?.getRepository(Company) ?? this.companies;
        const company = await companies.findOneBy({ id: idEmpresa });
        if (!company) throw new NotFoundException(`No existe la empresa ${idEmpresa}`);
        if (company.estado === ProposalStatus.Rejected) {
            throw new ConflictException(`La empresa ${idEmpresa} fue rechazada: no se le pueden agregar locales`);
        }
        await this.ensureCity(data.idCiudad);
        const repo = manager?.getRepository(Office) ?? this.repo;
        const office = repo.create({
            idEmpresa,
            nombre: data.nombre,
            idCiudad: data.idCiudad,
            direccionReferencia: data.direccionReferencia ?? null,
            estado: ProposalStatus.Pending,
        });
        const saved = await this.saveOrConflict(office, repo);
        return manager ? saved : this.findOne(saved.id);
    }

    async update(id: number, data: SaveOfficeDTO): Promise<Office> {
        const office = await this.findOne(id);
        if (data.idCiudad !== office.idCiudad) await this.ensureCity(data.idCiudad);
        Object.assign(office, {
            nombre: data.nombre,
            idCiudad: data.idCiudad,
            direccionReferencia: data.direccionReferencia ?? null,
            ciudad: undefined,
        });
        await this.saveOrConflict(office, this.repo);
        return this.findOne(id);
    }

    // Un local se aprueba solo si su empresa ya está aprobada.
    async approve(id: number): Promise<Office> {
        const office = await this.findPending(id);
        const company = await this.companies.findOneBy({ id: office.idEmpresa });
        if (company.estado !== ProposalStatus.Approved) {
            throw new ConflictException(`Primero hay que aprobar la empresa ${company.id}`);
        }
        await this.repo.update(id, { estado: ProposalStatus.Approved });
        return this.findOne(id);
    }

    async reject(id: number): Promise<Office> {
        await this.findPending(id);
        await this.repo.update(id, { estado: ProposalStatus.Rejected });
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        try {
            await this.repo.delete(id);
        } catch (error) {
            if (isForeignKeyViolation(error)) throw new ConflictException(`El local ${id} tiene evaluaciones y no se puede eliminar`);
            throw error;
        }
    }

    private async findPending(id: number): Promise<Office> {
        const office = await this.findOne(id);
        if (office.estado !== ProposalStatus.Pending) {
            throw new ConflictException(`El local ${id} ya está ${office.estado}`);
        }
        return office;
    }

    private ensureCity(idCiudad: number): Promise<void> {
        return ensureCatalogRef(() => this.cities.findOne(idCiudad), `No existe la ciudad ${idCiudad}`);
    }

    private async saveOrConflict(office: Office, repo: Repository<Office>): Promise<Office> {
        try {
            return await repo.save(office);
        } catch (error) {
            if (isUniqueViolation(error)) {
                throw new ConflictException(`La empresa ya tiene un local llamado «${office.nombre}»`);
            }
            throw error;
        }
    }
}
