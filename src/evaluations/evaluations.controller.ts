import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post()
  createEvaluation(@Body() evaluation: CreateEvaluationDto) {
    return this.evaluationsService.createEvaluation(evaluation);
  }

  @Get()
  getAllEvaluations() {
    return this.evaluationsService.getAllEvaluations();
  }

  @Get(':id')
  getEvaluationById(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationsService.getEvaluationById(id);
  }

  @Patch(':id')
  updateEvaluation(@Param('id', ParseIntPipe) id: number, @Body() evaluation: UpdateEvaluationDto) {
    return this.evaluationsService.updateEvaluation(id, evaluation);
  }

  @Delete(':id')
  deleteEvaluation(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationsService.deleteEvauation(id);
  }
}
