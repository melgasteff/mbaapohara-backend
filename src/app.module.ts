import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { CountriesModule } from './countries/countries.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ProfileReviewsModule } from './profile-reviews/profile-reviews.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { JobsModule } from './jobs/jobs.module';
import { CompaniesModule } from './companies/companies.module';
import { OfficesModule } from './offices/offices.module';
import { SalariesEvlModule } from './salariesEvl/salariesEvl.module';
import { CompanyReviewsModule } from './company-reviews/company-reviews.module';
import { InterviewsEvlModule } from './interviewsEvl/interviews-evl.module';
import { InterviewQuestionsModule } from './interview-questions/interview-questions.module';
import { CityModule } from './cities/infraesructure/module/city.module';



@Module({
  imports: [ 
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432, 
      username: 'postgres',
      password: '12345678',
      database: 'mbaapohara',
      autoLoadEntities: true 
      //synchronize: true
      
    }),
    CityModule,
    CountriesModule,
    PostsModule,
    ProfileReviewsModule,
    EvaluationsModule,
    JobsModule,
    CompaniesModule,
    OfficesModule,
    SalariesEvlModule,
    CompanyReviewsModule,
    InterviewsEvlModule,
    InterviewQuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
