import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page, PageRequest } from 'src/shared/domain/page';
import { findPage } from 'src/shared/infrastructure/database/find-page';
import { WorkMode } from './work-mode.entity';

@Injectable()
export class WorkModesService {
    constructor(@InjectRepository(WorkMode) private readonly repo: Repository<WorkMode>) { }

    findPage(request: PageRequest): Promise<Page<WorkMode>> {
        return findPage(this.repo, request, { order: { id: 'ASC' } });
    }

    async findOne(id: number): Promise<WorkMode> {
        const entity = await this.repo.findOneBy({ id });
        if (!entity) throw new NotFoundException(`No existe la modalidad ${id}`);
        return entity;
    }
}
