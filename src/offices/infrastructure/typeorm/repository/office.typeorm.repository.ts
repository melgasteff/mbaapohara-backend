import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OfficeRepository } from "src/offices/domain/repository/office.repository";
import { OfficeTypeORMModel } from "../model/office.typeorm.model";
import { Repository } from "typeorm";
import { NewOffice } from "src/offices/domain/model/new-office.entity";
import { Office } from "src/offices/domain/model/office.entity";
import { OfficeMapper } from "../../mapper/office.mapper";

@Injectable()
export class OfficeTypeORMRepository implements OfficeRepository {

    constructor(
        @InjectRepository(OfficeTypeORMModel)
        private readonly officeRepo: Repository<OfficeTypeORMModel>
    ) { }

    async create(newOffice: NewOffice): Promise<Office> {
        const officeTypeOrm = await this.officeRepo.save(OfficeMapper.toTypeORMModel(newOffice))
        return OfficeMapper.toDomain(officeTypeOrm);
    }

    async getAll(): Promise<Office[]> {
        return (await this.officeRepo.find()).map(officeTypeOrm => OfficeMapper.toDomain(officeTypeOrm));
    }

    async getById(id: number): Promise<Office | null> {
        const OfficeTypeOrm = await this.officeRepo.findOne({ where: { id } });
        return OfficeTypeOrm ? OfficeMapper.toDomain(OfficeTypeOrm) : null;
    }
    async update(id: number, office: Partial<Office>): Promise<Office> {
        const existingOffice = await this.officeRepo.findOne({ where: { id } });
        const updatedOffice = Object.assign(existingOffice, office);
        const savedOffice = await this.officeRepo.save(updatedOffice);
        return OfficeMapper.toDomain(savedOffice);
    }

    async delete(id: number): Promise<void> {
        await this.officeRepo.delete(id);
    }
    count(): Promise<number> {
        return this.officeRepo.count();
    }


}