import { Item } from "src/items/domain/model/item.entity";
import { ItemRepository } from "src/items/domain/repository/item.repository";
import { ItemNotFoundException } from "../exception/item-not-found.exception";

export class GetItemByIdUseCase {
    constructor(
        private readonly itemRepo: ItemRepository
    ) { }

    async execute(id: number): Promise<Item> {
        try {
            const itemFound = await this.itemRepo.getById(id)
            if (!itemFound) throw new ItemNotFoundException(id)
            return itemFound
        } catch (error) {
            console.error("Error al obtener el item", error);
            throw error;
        }

    }
}