import { Item } from "src/items/domain/model/item.entity";
import { ItemRepository } from "src/items/domain/repository/item.repository";
import { Page, PageRequest } from "src/shared/domain/page";

export class GetAllItemsUseCase {
    constructor(
        private itemRepo: ItemRepository
    ) { }

    async execute(request: PageRequest): Promise<Page<Item>> {
        return this.itemRepo.getPage(request);
    }
}
