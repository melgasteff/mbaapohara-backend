import { Public, Roles } from 'src/auth/presentation/decorator/auth.decorators';
import { UserRole } from 'src/shared/domain/user-role';
import { ApiTags } from "@nestjs/swagger";
import { Body, Query, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters } from "@nestjs/common";
import { mapPage, Page } from "src/shared/domain/page";
import { PaginationQueryDTO } from "src/shared/infrastructure/rest/pagination-query.dto";
import { CreateCategoryUseCase } from "src/categories/application/use-case/create.use-case";
import { DeleteCategoryUseCase } from "src/categories/application/use-case/delete.use-case";
import { GetCategoryByIdUseCase } from "src/categories/application/use-case/get-category-by-id.use-case";
import { GetAllCategoriesUseCase } from "src/categories/application/use-case/get-all.use-case";
import { UpdateCategoryUseCase } from "src/categories/application/use-case/update.use-case";
import { GlobalExceptionFilter } from "src/categories/infrastructure/exception-filter/exception-filter";
import { NewCategoryDTO } from "../dto/new-category.dto";
import { CategoryDTO } from "../dto/category.dto";
import { CategoryDTOMapper } from "../mapper/category-dto.mapper";

@UseFilters(GlobalExceptionFilter)
@ApiTags('Categorías')
@Controller('categories')
export class CategoryController {
    constructor(
        private readonly createCategoryUC: CreateCategoryUseCase,
        private readonly updateCategoryUC: UpdateCategoryUseCase,
        private readonly deleteCategoryUC: DeleteCategoryUseCase,
        private readonly getCategoryByIdUC: GetCategoryByIdUseCase,
        private readonly getAllCategoriesUC: GetAllCategoriesUseCase
    ) { }

    @Roles(UserRole.Admin)

    @Post()
    async createCategory(@Body() categoryDto: NewCategoryDTO): Promise<CategoryDTO> {
        return CategoryDTOMapper.toDTO(await this.createCategoryUC.execute(categoryDto.description));
    }
    @Public()

    @Get()
    async getAllCategories(@Query() query: PaginationQueryDTO): Promise<Page<CategoryDTO>> {
        return mapPage(await this.getAllCategoriesUC.execute(query), category => CategoryDTOMapper.toDTO(category));
    }

    @Public()

    @Get(':id')
    async getCategoryById(@Param('id', ParseIntPipe) id: number): Promise<CategoryDTO> {
        return CategoryDTOMapper.toDTO(await this.getCategoryByIdUC.execute(id));
    }

    @Roles(UserRole.Admin)

    @Put(':id')
    async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() category: CategoryDTO): Promise<CategoryDTO> {
        const categoryToUpdate = CategoryDTOMapper.toDomain(category);
        const updatedCategory = await this.updateCategoryUC.execute(id, categoryToUpdate);
        return CategoryDTOMapper.toDTO(updatedCategory);
    }

    @Roles(UserRole.Admin)

    @Delete(':id')
    deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.deleteCategoryUC.execute(id);
    }
}