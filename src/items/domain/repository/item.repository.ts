import { Item } from "../model/item.entity";
import { NewItem } from "../model/new-item.entity";

export abstract class ItemRepository {
  abstract create(newItem: NewItem): Promise<Item>;
  abstract getAll(): Promise<Item[]>;
  abstract getById(id: number): Promise<Item | null>;
  abstract update(id: number, item: Partial<Item>): Promise<Item>;
  abstract delete(id: number): Promise<void>;
  abstract count(): Promise<number>;
}