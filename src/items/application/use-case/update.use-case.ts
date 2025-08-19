import { Item } from "src/items/domain/model/item.entity";
import { ItemRepository } from "src/items/domain/repository/item.repository";
import { ItemNotFoundException } from "../exception/item-not-found.exception";


export class UpdateItemUseCase {
  constructor(
    private readonly itemRepo: ItemRepository) { }

  async execute(id: number, item: Item): Promise<Item> {
    try {
      
      const allItems = await this.itemRepo.getAll();
      const itemFound = allItems.find((item) => item.getId() === id);
      if (!itemFound) { throw new ItemNotFoundException(id); }
      return this.itemRepo.update(id, item)
    
    } catch (error) {
      console.error("Error al obtener el item:", error);
      throw new error
    }

  }
}

