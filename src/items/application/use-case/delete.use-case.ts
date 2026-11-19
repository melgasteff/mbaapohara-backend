import { ItemRepository } from "src/items/domain/repository/item.repository";
import { ItemNotFoundException } from "../exception/item-not-found.exception";
import { ItemInUseException } from "../exception/item-in-use.exception";

export class DeleteItemUseCase {
  constructor(
    private readonly itemRepo: ItemRepository
  ) { }

  async execute(id: number): Promise<void> {
    try {
      const item = await this.itemRepo.getById(id);

      if (!item) {throw new ItemNotFoundException(id); }

      await this.itemRepo.delete(id);

    } catch (error) {
      if (error instanceof Error && error.message.includes('foreign key'))  throw new ItemInUseException(id);
      throw error
    }
  }
}