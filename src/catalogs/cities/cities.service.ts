import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page, PageRequest } from 'src/shared/domain/page';
import { findPage } from 'src/shared/infrastructure/database/find-page';
import { City } from './city.entity';

@Injectable()
export class CitiesService {
    constructor(@InjectRepository(City) private readonly repo: Repository<City>) { }

    findPage(request: PageRequest, idDepartamento?: number): Promise<Page<City>> {
        return findPage(this.repo, request, {
            where: idDepartamento ? { idDepartamento } : {},
            order: { nombre: 'ASC' },
        });
    }

    async findOne(id: number): Promise<City> {
        const city = await this.repo.findOneBy({ id });
        if (!city) throw new NotFoundException(`No existe la ciudad ${id}`);
        return city;
    }
}
