import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SectorsService } from 'src/catalogs/sectors/sectors.service';
import { Page, PageRequest, pageOffset } from 'src/shared/domain/page';
import { isForeignKeyViolation, isUniqueViolation } from 'src/shared/infrastructure/database/pg-errors';
import { ensureCatalogRef, escapeLike } from './catalog-refs';
import { Company } from './company.entity';
import { ProposeCompanyDTO, SaveCompanyDTO } from './dto/save-company.dto';
import { Office } from './offices/office.entity';
import { OfficesService } from './offices/offices.service';
import { ProposalStatus } from './proposal-status';

export interface CompanyFilters {
    q?: string;
    rubro?: number;
    ciudad?: number;
    estado?: ProposalStatus;
}

@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Company) private readonly repo: Repository<Company>,
        private readonly dataSource: DataSource,
        private readonly sectors: SectorsService,
        private readonly offices: OfficesService,
    ) { }

    // Directorio: por defecto solo empresas aprobadas. La búsqueda por nombre no distingue mayúsculas ni
    // tildes (ILIKE + unaccent, según el recorte del plan; pg_trgm queda como mejora).
    async findPage(request: PageRequest, filters: CompanyFilters): Promise<Page<Company>> {
        const qb = this.repo.createQueryBuilder('empresa')
            .leftJoinAndSelect('empresa.rubro', 'rubro')
            .where('empresa.estado = :estado', { estado: filters.estado ?? ProposalStatus.Approved });

        if (filters.q) {
            qb.andWhere('lower(f_unaccent(empresa.nombre)) LIKE lower(f_unaccent(:q))', { q: `%${escapeLike(filters.q)}%` });
        }
        if (filters.rubro) {
            qb.andWhere('empresa.idRubro = :rubro', { rubro: filters.rubro });
        }
        if (filters.ciudad) {
            qb.andWhere(`EXISTS (
                SELECT 1 FROM sucursales local
                WHERE local.id_empresa = empresa.id AND local.id_ciudad = :ciudad AND local.estado = :aprobada)`,
                { ciudad: filters.ciudad, aprobada: ProposalStatus.Approved });
        }

        const [data, total] = await qb
            .orderBy('empresa.nombre', 'ASC')
            .skip(pageOffset(request))
            .take(request.pageSize)
            .getManyAndCount();
        return { data, total, page: request.page, pageSize: request.pageSize };
    }

    async findOne(id: number): Promise<Company> {
        const company = await this.repo.findOne({ where: { id }, relations: { rubro: true } });
        if (!company) throw new NotFoundException(`No existe la empresa ${id}`);
        return company;
    }

    // Detalle con los locales aprobados (como mucho 100; una empresa con más se recorre con /offices).
    async findDetail(id: number): Promise<{ company: Company; offices: Office[] }> {
        const company = await this.findOne(id);
        const offices = await this.offices.findByCompany(id, { page: 1, pageSize: 100 });
        return { company, offices: offices.data };
    }

    // Propuesta de empresa nueva con su primer local, ambos pendientes, en una sola transacción (D10).
    async propose(data: ProposeCompanyDTO): Promise<Company> {
        await this.ensureSector(data.idRubro);
        const id = await this.dataSource.transaction(async manager => {
            const company = await this.saveOrConflict(
                manager.getRepository(Company).create({ nombre: data.nombre, idRubro: data.idRubro, estado: ProposalStatus.Pending }),
                manager.getRepository(Company),
            );
            await this.offices.propose(company.id, data.local, manager);
            return company.id;
        });
        return this.findOne(id);
    }

    async update(id: number, data: SaveCompanyDTO): Promise<Company> {
        const company = await this.findOne(id);
        if (data.idRubro !== company.idRubro) await this.ensureSector(data.idRubro);
        Object.assign(company, { nombre: data.nombre, idRubro: data.idRubro, rubro: undefined });
        await this.saveOrConflict(company, this.repo);
        return this.findOne(id);
    }

    // Aprobar o rechazar la empresa aplica lo mismo a sus locales pendientes.
    approve(id: number): Promise<Company> {
        return this.resolve(id, ProposalStatus.Approved);
    }

    reject(id: number): Promise<Company> {
        return this.resolve(id, ProposalStatus.Rejected);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        try {
            await this.repo.delete(id);
        } catch (error) {
            if (isForeignKeyViolation(error)) {
                throw new ConflictException(`La empresa ${id} tiene locales o evaluaciones y no se puede eliminar; se puede rechazar`);
            }
            throw error;
        }
    }

    private async resolve(id: number, estado: ProposalStatus.Approved | ProposalStatus.Rejected): Promise<Company> {
        const company = await this.findOne(id);
        if (company.estado !== ProposalStatus.Pending) {
            throw new ConflictException(`La empresa ${id} ya está ${company.estado}`);
        }
        await this.dataSource.transaction(async manager => {
            await manager.update(Company, { id }, { estado });
            await manager.update(Office, { idEmpresa: id, estado: ProposalStatus.Pending }, { estado });
        });
        return this.findOne(id);
    }

    private ensureSector(idRubro: number): Promise<void> {
        return ensureCatalogRef(() => this.sectors.findOne(idRubro), `No existe el rubro ${idRubro}`);
    }

    // El duplicado lo detecta el índice UNIQUE; el mensaje dice en qué estado está la empresa existente.
    private async saveOrConflict(company: Company, repo: Repository<Company>): Promise<Company> {
        try {
            return await repo.save(company);
        } catch (error) {
            if (!isUniqueViolation(error)) throw error;
            const existing = await this.repo.createQueryBuilder('empresa')
                .where('lower(f_unaccent(empresa.nombre)) = lower(f_unaccent(:nombre))', { nombre: company.nombre })
                .getOne();
            const estado = existing ? ` (está ${existing.estado})` : '';
            throw new ConflictException(`Ya existe una empresa llamada «${existing?.nombre ?? company.nombre}»${estado}`);
        }
    }
}
