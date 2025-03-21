import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { CitiesModule } from './cities/cities.module';
import { CountriesModule } from './countries/countries.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ProfileReviewsModule } from './profile-reviews/profile-reviews.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { JobsModule } from './jobs/jobs.module';
import { CompaniesModule } from './companies/companies.module';
import { OfficesModule } from './offices/offices.module';
import { SalariesEvlModule } from './salariesEvl/salariesEvl.module';


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
      entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      //synchronize: true
      
    }),
    CitiesModule,
    CountriesModule,
    PostsModule,
    ProfileReviewsModule,
    EvaluationsModule,
    JobsModule,
    CompaniesModule,
    OfficesModule,
    SalariesEvlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
