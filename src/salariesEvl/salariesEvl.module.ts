import { Module } from '@nestjs/common';
import { SalariesEvlService } from './salariesEvl.service';
import { SalariesController } from './salariesEvl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaryEvl } from './entities/salaryEvl.entity';
import { CreateSalaryEvl } from './use-cases/create.use-case';
import { Evaluation } from 'src/evaluations/entities/evaluation.entity';
import { GetAllSalariesEvl } from './use-cases/getAll.use-cases';
import { UpdateSalatyEvl } from './use-cases/update.use-case';
import { GetSalaryEvlById } from './use-cases/getById.use-case';

@Module({
  controllers: [SalariesController],
  providers: [
    SalariesEvlService,
    CreateSalaryEvl, 
    GetAllSalariesEvl, 
    UpdateSalatyEvl, 
    GetSalaryEvlById
  ],
  imports: [TypeOrmModule.forFeature([SalaryEvl, Evaluation])],
  exports: [SalariesEvlService]
})
export class SalariesEvlModule {}
