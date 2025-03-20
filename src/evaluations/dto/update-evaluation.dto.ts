import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluationDto } from './create-evaluation.dto';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity';
import { Office } from 'src/offices/entities/office.entity';

export class UpdateEvaluationDto extends PartialType(CreateEvaluationDto) {
    job?: number;
    user?: number;
    company?: number;
    office?: number;
}
