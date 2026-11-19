import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page, PageRequest } from 'src/shared/domain/page';
import { findPage } from 'src/shared/infrastructure/database/find-page';
import { Sector } from './sector.entity';

@Injectable()
export class SectorsService {
    constructor(@InjectRepository(Sector) private readonly repo: Repository<Sector>) { }

    findPage(request: PageRequest): Promise<Page<Sector>> {
        return findPage(this.repo, request, { order: { codigoCiiu: 'ASC' } });
    }

    async findOne(id: number): Promise<Sector> {
        const entity = await this.repo.findOneBy({ id });
        if (!entity) throw new NotFoundException(`No existe el rubro ${id}`);
        return entity;
    }
}
