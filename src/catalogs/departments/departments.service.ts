import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page, PageRequest } from 'src/shared/domain/page';
import { findPage } from 'src/shared/infrastructure/database/find-page';
import { Department } from './department.entity';

@Injectable()
export class DepartmentsService {
    constructor(@InjectRepository(Department) private readonly repo: Repository<Department>) { }

    findPage(request: PageRequest): Promise<Page<Department>> {
        return findPage(this.repo, request, { order: { codigoIne: 'ASC' } });
    }

    async findOne(id: number): Promise<Department> {
        const department = await this.repo.findOneBy({ id });
        if (!department) throw new NotFoundException(`No existe el departamento ${id}`);
        return department;
    }
}
