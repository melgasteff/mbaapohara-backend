import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { CountCategoriesUseCase } from "src/categories/application/use-case/count.use-case";
import { CreateCategoryUseCase } from "src/categories/application/use-case/create.use-case";
import { DeleteCategoryUseCase } from "src/categories/application/use-case/delete.use-case";
import { GetCategoryByIdUseCase } from "src/categories/application/use-case/get-category-by-id.use-case";
import { GetAllCategoriesUseCase } from "src/categories/application/use-case/getAll.use-case";
import { UpdateCategoryUseCase } from "src/categories/application/use-case/update.use-case";
import { GlobalExceptionFilter } from "src/categories/infrastructure/exception-filter/exception-filter";
import { NewCategoryDTO } from "../dto/new-category.dto";
import { CategoryDTO } from "../dto/category.dto";
import { CategoryDTOMapper } from "../mapper/category-dto.mapper";
import { ResponseModel } from "src/shared/infrastructure/rest/response-model.dto";

@UseFilters(GlobalExceptionFilter)
@Controller('categories')
export class CategoryController {
    constructor(
        private readonly createCategoryUC: CreateCategoryUseCase,
        private readonly updateCategoryUC: UpdateCategoryUseCase,
        private readonly deleteCategoryUC: DeleteCategoryUseCase,
        private readonly getCategoryByIdUC: GetCategoryByIdUseCase,
        private readonly getAllCategoriesUC: GetAllCategoriesUseCase,
        private readonly countCategoriesUC: CountCategoriesUseCase
    ) { }

    @Post()
    async createCategory(@Body() categoryDto: NewCategoryDTO): Promise<CategoryDTO> {
        return CategoryDTOMapper.toDTO(await this.createCategoryUC.execute(categoryDto.description));
    }
    @Get()
    async getAllCategories(): Promise<ResponseModel<CategoryDTO>> {
        const categoryDTO = (await this.getAllCategoriesUC.execute()).map(category => CategoryDTOMapper.toDTO(category));
        return {
            count: await this.countCategoriesUC.execute(),
            data: categoryDTO
        }
    }

    @Get(':id')
    async getCategoryById(@Param('id', ParseIntPipe) id: number): Promise<CategoryDTO> {
        return CategoryDTOMapper.toDTO(await this.getCategoryByIdUC.execute(id));
    }

    @Put(':id')
    async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() category: CategoryDTO): Promise<CategoryDTO> {
        const categoryToUpdate = CategoryDTOMapper.toDomain(category);
        const updatedCategory = await this.updateCategoryUC.execute(id, categoryToUpdate);
        return CategoryDTOMapper.toDTO(updatedCategory);
    }

    @Delete(':id')
    deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteCategoryUC.execute(id);
    }
}