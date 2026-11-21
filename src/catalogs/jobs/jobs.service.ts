import { ProposalStatus } from 'src/shared/domain/proposal-status';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Page, PageRequest } from 'src/shared/domain/page';
import { findPage } from 'src/shared/infrastructure/database/find-page';
import { isForeignKeyViolation, isUniqueViolation } from 'src/shared/infrastructure/database/pg-errors';
import { Job } from './job.entity';

@Injectable()
export class JobsService {
    constructor(@InjectRepository(Job) private readonly repo: Repository<Job>) { }

    // Lista pública: solo cargos aprobados. Los propuestos desde una reseña los revisa el administrador (3.9).
    findPage(request: PageRequest): Promise<Page<Job>> {
        return findPage(this.repo, request, { where: { estado: ProposalStatus.Approved }, order: { descripcion: 'ASC' } });
    }

    // Administración: cargos en cualquier estado (por ejemplo, los propuestos desde una reseña, pendientes).
    findAdminPage(request: PageRequest, estado?: ProposalStatus): Promise<Page<Job>> {
        return findPage(this.repo, request, { where: estado ? { estado } : {}, order: { descripcion: 'ASC' } });
    }

    /** Aprueba un cargo propuesto: pasa a la lista pública y se muestra en sus reseñas. */
    approve(id: number): Promise<Job> {
        return this.resolve(id, ProposalStatus.Approved);
    }

    /** Rechaza un cargo propuesto: no entra en la lista y sus reseñas siguen mostrando «Otro cargo». */
    reject(id: number): Promise<Job> {
        return this.resolve(id, ProposalStatus.Rejected);
    }

    async findOne(id: number): Promise<Job> {
        const job = await this.repo.findOneBy({ id, estado: ProposalStatus.Approved });
        if (!job) throw new NotFoundException(`No existe el cargo ${id}`);
        return job;
    }

    /**
     * Cargo que una persona propone al escribir una reseña: si ya existe uno con esa descripción (sin distinguir
     * mayúsculas), se usa ese; si no, se crea pendiente hasta que el administrador lo apruebe (como D10).
     * Recibe el `EntityManager` de la transacción de la reseña. Devuelve el id.
     */
    async propose(descripcion: string, manager: EntityManager): Promise<number> {
        // ON CONFLICT sobre el índice «UQ_cargos_descripcion»: dos propuestas iguales a la vez no hacen fallar la transacción.
        await manager.query(
            `INSERT INTO cargos (descripcion, estado) VALUES ($1, $2) ON CONFLICT ((lower(descripcion))) DO NOTHING`,
            [descripcion, ProposalStatus.Pending]);
        const [{ id }] = await manager.query('SELECT id FROM cargos WHERE lower(descripcion) = lower($1)', [descripcion]);
        return id;
    }

    // El duplicado lo detecta la restricción UNIQUE de la base, no una búsqueda previa.
    async create(descripcion: string): Promise<Job> {
        return this.saveOrConflict(this.repo.create({ descripcion }));
    }

    async update(id: number, descripcion: string): Promise<Job> {
        const job = await this.findOne(id);
        job.descripcion = descripcion;
        return this.saveOrConflict(job);
    }

    async remove(id: number): Promise<void> {
        const job = await this.findOne(id);
        try {
            await this.repo.remove(job);
        } catch (error) {
            if (isForeignKeyViolation(error)) throw new ConflictException(`El cargo ${id} está en uso y no se puede eliminar`);
            throw error;
        }
    }

    private async resolve(id: number, estado: ProposalStatus.Approved | ProposalStatus.Rejected): Promise<Job> {
        const job = await this.repo.findOneBy({ id });
        if (!job) throw new NotFoundException(`No existe el cargo ${id}`);
        if (job.estado !== ProposalStatus.Pending) throw new ConflictException(`El cargo ${id} ya está ${job.estado}`);
        job.estado = estado;
        return this.repo.save(job);
    }

    private async saveOrConflict(job: Job): Promise<Job> {
        try {
            return await this.repo.save(job);
        } catch (error) {
            if (isUniqueViolation(error)) throw new ConflictException(`Ya existe el cargo «${job.descripcion}»`);
            throw error;
        }
    }
}
