import { CategoryRepository } from "src/categories/domain/repository/category.repository";
import { CategoryAlreadyExistsException } from "../exception/category-already-exists.exception";
import { NewCategory } from "src/categories/domain/model/new-category.entity";
import { Category } from "src/categories/domain/model/category.entity";

export class CreateCategoryUseCase {
    constructor(
        private readonly categoryRepo: CategoryRepository
    ) { }

    async execute(description: string): Promise<Category> {
        const allCategories = await this.categoryRepo.getAll();
        if (allCategories != null) {
            const categoryFound = await allCategories.find((category) => category.getDescription().toLocaleLowerCase() === description.toLocaleLowerCase());

            if (categoryFound) throw new CategoryAlreadyExistsException(description)
        }
        const newCategory = await new NewCategory(description)
        return await this.categoryRepo.create(newCategory)

    
    }
}