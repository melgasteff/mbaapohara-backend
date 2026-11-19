import { Category } from "src/categories/domain/model/category.entity";
import { CategoryRepository } from "src/categories/domain/repository/category.repository";
import { Page, PageRequest } from "src/shared/domain/page";

export class GetAllCategoriesUseCase {
    constructor(
        private categoryRepo: CategoryRepository
    ) { }

    async execute(request: PageRequest): Promise<Page<Category>> {
        return this.categoryRepo.getPage(request);
    }
}
