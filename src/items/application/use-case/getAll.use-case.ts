import { Item } from "src/items/domain/model/item.entity";
import { ItemRepository } from "src/items/domain/repository/item.repository";

export class GetAllItemsUseCase {
    
    constructor(
        private itemRepo: ItemRepository
    ){}

    public async execute(): Promise<Item[]>{
        return this.itemRepo.getAll();
    }
}