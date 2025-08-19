import { ItemRepository } from "src/items/domain/repository/item.repository";

export class CountItemsUseCase {
    constructor(
        private itemRepo: ItemRepository
    ){}

    public async execute(): Promise<number> {
        return this.itemRepo.count();
    }
}