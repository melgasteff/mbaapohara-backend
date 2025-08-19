import { Item } from "src/items/domain/model/item.entity";
import { NewItem } from "src/items/domain/model/new-item.entity";
import { ItemRepository } from "src/items/domain/repository/item.repository";
import { ItemAlreadyExistsException } from "../exception/item-already-exists.exception";


export class CreateItemUseCase {
  constructor(
    private readonly itemRepo: ItemRepository
  ) { }

  async execute(descripcion: string, idcategory: number): Promise<Item> {
      const allItemns = await this.itemRepo.getAll();
      const itemFound = allItemns.find((item) => item.getDescripcion().toLowerCase() === descripcion.toLowerCase());
      if (itemFound) throw new ItemAlreadyExistsException(descripcion);
      
      const newItem = new NewItem(descripcion, idcategory);
      return await this.itemRepo.create(newItem);
  }
}

