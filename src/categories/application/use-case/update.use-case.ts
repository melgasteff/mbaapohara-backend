import { Category } from "src/categories/domain/model/category.entity";
import { CategoryRepository } from "src/categories/domain/repository/category.repository";
import { CategoryNotFoundException } from "../exception/category-not-found.exception";

export class UpdateCategoryUseCase {
    constructor(
        private readonly categoryRepo: CategoryRepository
    ) { }

    async execute(id: number, category: Category): Promise<Category> {
        try {
            const allCategories = await this.categoryRepo.getAll();
            const officeFound = await allCategories.find((category) => category.getId() === id)
            if (!officeFound) throw new CategoryNotFoundException(id)

            return this.categoryRepo.update(id, category)
        } catch (error) {
            console.error("Error al actualizar la categoria", error)
            throw new error
        }
    }
}