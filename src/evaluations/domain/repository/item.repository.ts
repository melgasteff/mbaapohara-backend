import { Item } from "../model/item.entity";

export abstract class ItemRepository {
  abstract getAll(): Promise<Item[]>;
  abstract getById(id: number): Promise<Item | null>;
}