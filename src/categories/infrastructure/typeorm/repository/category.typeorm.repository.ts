import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/categories/domain/model/category.entity";
import { NewCategory } from "src/categories/domain/model/new-category.entity";
import { CategoryRepository } from "src/categories/domain/repository/category.repository";
import { CategoryTypeORMModel } from "../model/category.typeorm.model";
import { Repository } from "typeorm";
import { CategoryMapper } from "../../mapper/category.mapper";

@Injectable()
export class CategoryTypeORMRepository implements CategoryRepository {
    constructor(
        @InjectRepository(CategoryTypeORMModel)
        private readonly categoryRepo: Repository<CategoryTypeORMModel>
    ) { }
    async create(newCategory: NewCategory): Promise<Category> {
        const categoryTypeOrm = await this.categoryRepo.save(CategoryMapper.toTypeORMModel(newCategory))
        return CategoryMapper.toDomain(categoryTypeOrm)
    }
    async getAll(): Promise<Category[]> {
        return (await this.categoryRepo.find()).map(categoryTypeOrm => CategoryMapper.toDomain(categoryTypeOrm))


    }
    async getById(id: number): Promise<Category | null> {
        const categoryEntity = await this.categoryRepo.findOne({ where: { id } })
        return categoryEntity ? CategoryMapper.toDomain(categoryEntity) : null;
    }
    async update(id: number, category: Category): Promise<Category> {
        await this.categoryRepo.update(id, {
            description: category.getDescription()
        });

        const updated = await this.categoryRepo.findOneBy({ id });
        return CategoryMapper.toDomain(updated);
    }


    async delete(id: number): Promise<void> {
        await this.categoryRepo.delete(id)
    }
    async count(): Promise<number> {
        return this.categoryRepo.count()
    }
}