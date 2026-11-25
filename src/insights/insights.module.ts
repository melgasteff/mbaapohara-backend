import { Module } from '@nestjs/common';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';

// Módulo liviano de solo lectura (docs/arquitectura.md): indicadores agregados de reseñas publicadas (3.6).
@Module({
    controllers: [InsightsController],
    providers: [InsightsService],
})
export class InsightsModule { }
