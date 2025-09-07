import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemRepository } from "src/evaluations/domain/repository/item.repository";
import { ItemTypeORMModel } from "../model/item.typeorm.model";
import { Repository } from "typeorm";
import { Item } from "src/evaluations/domain/model/item.entity";
import { ItemMapper } from "../../mapper/item.mapper";


@Injectable()
export class ItemTypeORMRepository implements ItemRepository {
  
  constructor(
    @InjectRepository(ItemTypeORMModel)
    private readonly itemRepo: Repository<ItemTypeORMModel>
  ) {}
 
  async getAll(): Promise<Item[]> {
    return (await this.itemRepo.find()).map(itemTypeOrm => ItemMapper.toDomain(itemTypeOrm));
  }

  async getById(id: number): Promise<Item | null> {
    const itemEntity = await this.itemRepo.findOne({ where: { id } });
    return itemEntity ? ItemMapper.toDomain(itemEntity) : null;
  }
}