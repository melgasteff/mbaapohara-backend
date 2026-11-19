import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page, PageRequest } from 'src/shared/domain/page';
import { findPage } from 'src/shared/infrastructure/database/find-page';
import { ContractType } from './contract-type.entity';

@Injectable()
export class ContractTypesService {
    constructor(@InjectRepository(ContractType) private readonly repo: Repository<ContractType>) { }

    findPage(request: PageRequest): Promise<Page<ContractType>> {
        return findPage(this.repo, request, { order: { id: 'ASC' } });
    }

    async findOne(id: number): Promise<ContractType> {
        const entity = await this.repo.findOneBy({ id });
        if (!entity) throw new NotFoundException(`No existe el tipo de contrato ${id}`);
        return entity;
    }
}
