import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public, Roles } from 'src/auth/presentation/decorator/auth.decorators';
import { UserRole } from 'src/shared/domain/user-role';
import { CriteriaService } from './criteria.service';
import { AdminCriteriaCategoryDTO, AdminCriterionDTO, CriteriaCategoryDTO } from './dto/criteria.dto';
import { CreateCategoryDTO, CreateCriterionDTO, UpdateCategoryDTO, UpdateCriterionDTO } from './dto/save-criteria.dto';

// Sin listado paginado: los criterios son la configuración de la reseña (unas pocas decenas) y se piden enteros.
// Sin DELETE: un criterio se desactiva, para que las respuestas guardadas sigan apuntando a él.
@ApiTags('Criterios')
@Controller('criteria')
export class CriteriaController {
    constructor(private readonly service: CriteriaService) { }

    /** Categorías activas con sus ítems activos, en orden: lo que se responde al escribir una reseña. */
    @Public()
    @Get()
    async findActive(): Promise<CriteriaCategoryDTO[]> {
        return (await this.service.findActive()).map(CriteriaCategoryDTO.from);
    }

    /** Administración: todo, activo o no, con la cantidad de respuestas de cada ítem. */
    @Roles(UserRole.Admin)
    @Get('admin')
    async findAll(): Promise<AdminCriteriaCategoryDTO[]> {
        const [categories, answers] = await Promise.all([this.service.findAll(), this.service.answerCounts()]);
        return categories.map(category => AdminCriteriaCategoryDTO.from(category, answers));
    }

    @Roles(UserRole.Admin)
    @Post('categories')
    async createCategory(@Body() body: CreateCategoryDTO): Promise<AdminCriteriaCategoryDTO> {
        return AdminCriteriaCategoryDTO.from(await this.service.createCategory(body));
    }

    @Roles(UserRole.Admin)
    @Patch('categories/:id')
    async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateCategoryDTO): Promise<AdminCriteriaCategoryDTO> {
        const category = await this.service.updateCategory(id, body);
        return AdminCriteriaCategoryDTO.from(category, await this.service.answerCounts());
    }

    @Roles(UserRole.Admin)
    @Post('items')
    async createCriterion(@Body() body: CreateCriterionDTO): Promise<AdminCriterionDTO> {
        return AdminCriterionDTO.from(await this.service.createCriterion(body));
    }

    @Roles(UserRole.Admin)
    @Patch('items/:id')
    async updateCriterion(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateCriterionDTO): Promise<AdminCriterionDTO> {
        const item = await this.service.updateCriterion(id, body);
        return AdminCriterionDTO.from(item, await this.service.answersOf(id));
    }
}
