import { Module } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { Evaluation } from './entities/evaluation.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [EvaluationsController],
  imports: [TypeOrmModule.forFeature([User, Evaluation])],
  providers: [EvaluationsService],
  exports : []
})
export class EvaluationsModule {}
