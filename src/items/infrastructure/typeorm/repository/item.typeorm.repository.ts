import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemRepository } from "src/items/domain/repository/item.repository";
import { ItemTypeORMModel } from "../model/item.typeorm.model";
import { Repository } from "typeorm";
import { NewItem } from "src/items/domain/model/new-item.entity";
import { Item } from "src/items/domain/model/item.entity";
import { ItemMapper } from "../../mapper/item.mapper";

@Injectable()
export class ItemTypeORMRepository implements ItemRepository {
  
  constructor(
    @InjectRepository(ItemTypeORMModel)
    private readonly itemRepo: Repository<ItemTypeORMModel>
  ) {}

  async create(newItem: NewItem): Promise<Item> {
    const cityTypeOrm = await this.itemRepo.save(ItemMapper.toTypeORMModel(newItem))
    return ItemMapper.toDomain(cityTypeOrm);
  }

  async getAll(): Promise<Item[]> {
    return (await this.itemRepo.find()).map(itemTypeOrm => ItemMapper.toDomain(itemTypeOrm));
  }

  async getById(id: number): Promise<Item | null> {
    const itemEntity = await this.itemRepo.findOne({ where: { id } });
    return itemEntity ? ItemMapper.toDomain(itemEntity) : null;
  }

  async update(id: number, data: Partial<Item>): Promise<Item> {
    const existingItem = await this.itemRepo.findOne({ where: { id } });
    if (!existingItem) {
      throw new Error(`Item with ID ${id} not found`);
    }

    const updated = Object.assign(existingItem, data);
    const saved = await this.itemRepo.save(updated);
    return ItemMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.itemRepo.delete(id);
  }

  async count(): Promise<number> {
    return this.itemRepo.count();
  }
}