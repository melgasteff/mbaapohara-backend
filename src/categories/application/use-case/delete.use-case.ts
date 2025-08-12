import { CategoryRepository } from "src/categories/domain/repository/category.repository";
import { CategoryNotFoundException } from "../exception/category-not-found.exception";
import { CategoryInUseException } from "../exception/category-in-use.exception";

export class DeleteCategoryUseCase {
    constructor(
        private readonly categoryRepo: CategoryRepository
    ) { }

    async execute(id: number) {
        try {
            const category = await this.categoryRepo.getById(id)
            if (!category) throw new CategoryNotFoundException(id)
            await this.categoryRepo.delete(id)
        } catch (error) {
            console.error("Error al eliminar la Categoria", error)
            if (error instanceof Error && error.message.includes('foreign key')) throw new CategoryInUseException(id);
            throw new error
        }

    }
}