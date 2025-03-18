import { Module } from '@nestjs/common';
import { ProfileReviewsService } from './profile-reviews.service';
import { ProfileReviewsController } from './profile-reviews.controller';
import { ProfileReview } from './entities/profile-review.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateProfileReview } from './use-cases/create.use-case';
import { UpdateProfileReview } from './use-cases/updateProfileReview.use-case';
import { GetProfileReviews } from './use-cases/getProfileReviews.use-case';
import { DeleteProfileReview } from './use-cases/delete.use-case';

@Module({
  controllers: [ProfileReviewsController],
  providers: [
    ProfileReviewsService,
    CreateProfileReview,
    UpdateProfileReview,
    GetProfileReviews, 
    DeleteProfileReview
  ],
  imports: [TypeOrmModule.forFeature([ProfileReview, User])],
  exports :[ProfileReviewsService]
})
export class ProfileReviewsModule {}
