import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page, PageRequest } from 'src/shared/domain/page';
import { findPage } from 'src/shared/infrastructure/database/find-page';
import { isForeignKeyViolation, isUniqueViolation } from 'src/shared/infrastructure/database/pg-errors';
import { Job } from './job.entity';

@Injectable()
export class JobsService {
    constructor(@InjectRepository(Job) private readonly repo: Repository<Job>) { }

    findPage(request: PageRequest): Promise<Page<Job>> {
        return findPage(this.repo, request, { order: { descripcion: 'ASC' } });
    }

    async findOne(id: number): Promise<Job> {
        const job = await this.repo.findOneBy({ id });
        if (!job) throw new NotFoundException(`No existe el cargo ${id}`);
        return job;
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

    private async saveOrConflict(job: Job): Promise<Job> {
        try {
            return await this.repo.save(job);
        } catch (error) {
            if (isUniqueViolation(error)) throw new ConflictException(`Ya existe el cargo «${job.descripcion}»`);
            throw error;
        }
    }
}
