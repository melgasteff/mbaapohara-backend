import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OfficeRepository } from "src/evaluations/domain/repository/office.repository";
import { OfficeTypeORMModel } from "../model/office.typeorm.model";
import { Repository } from "typeorm";
import { Office } from "src/evaluations/domain/model/office.entity";
import { OfficeMapper } from "../../mapper/office.mapper";


@Injectable()
export class OfficeTypeORMRepository implements OfficeRepository {

    constructor(
        @InjectRepository(OfficeTypeORMModel)
        private readonly officeRepo: Repository<OfficeTypeORMModel>
    ) { }
    async getByName(officeName: string): Promise<number> {
        const office = await this.officeRepo.findOneBy({ nombre: officeName })
        const officeId = office.id
        return officeId
    }

    async getAll(): Promise<Office[]> {
        return (await this.officeRepo.find()).map(officeTypeOrm => OfficeMapper.toDomain(officeTypeOrm));
    }

    async getById(id: number): Promise<Office | null> {
        const OfficeTypeOrm = await this.officeRepo.findOne({ where: { id } });
        console.log("En el office repository",OfficeMapper.toDomain(OfficeTypeOrm) )
        return OfficeTypeOrm ? OfficeMapper.toDomain(OfficeTypeOrm) : null;
    }
    
    count(): Promise<number> {
        return this.officeRepo.count();
    }


}