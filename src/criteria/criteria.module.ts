import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriteriaController } from './criteria.controller';
import { CriteriaService } from './criteria.service';
import { CriteriaCategory } from './entities/category.entity';
import { Criterion } from './entities/criterion.entity';

// Módulo liviano (docs/arquitectura.md, tarea 3.8): dueño de las tablas categorias e items. Reemplaza a los heredados
// `categories` e `items`. `reviews` usa el servicio que exporta para saber qué criterios hay que responder.
@Module({
    imports: [TypeOrmModule.forFeature([CriteriaCategory, Criterion])],
    controllers: [CriteriaController],
    providers: [CriteriaService],
    exports: [CriteriaService],
})
export class CriteriaModule { }
