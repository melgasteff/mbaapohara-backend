import { Category } from "src/categories/domain/model/category.entity";
import { CategoryRepository } from "src/categories/domain/repository/category.repository";
import { CategoryNotFoundException } from "../exception/category-not-found.exception";

export class GetCategoryByIdUseCase {
    constructor(
        private readonly categoryRepo: CategoryRepository
    ) { }

    async execute(id: number): Promise<Category> {
        try {
            const categoryFound = await this.categoryRepo.getById(id)
            if (!categoryFound) throw new CategoryNotFoundException(id)
            return categoryFound
        } catch (error) {
            console.error("No se ha podido encontrar la categoria")
            throw error;
        }
    }
}