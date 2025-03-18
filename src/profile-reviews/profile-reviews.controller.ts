import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProfileReviewsService } from './profile-reviews.service';
import { CreateProfileReviewDto } from './dto/create-profile-review.dto';
import { UpdateProfileReviewDto } from './dto/update-profile-review.dto';

@Controller('profile-reviews')
export class ProfileReviewsController {
  constructor(
    private readonly profileReviewsService: ProfileReviewsService
  ) {}

  @Post(':id')
  reviewUser(@Param('id', ParseIntPipe) id: number, @Body() review: CreateProfileReviewDto){
    return this.profileReviewsService.createProfileReview(id, review)
  }

  @Get(':id')
  getUserReviews(@Param('id', ParseIntPipe) id: number){
    return this.profileReviewsService.getProfileReviews(id)
  }

  @Patch(':id')
  updateReview(@Param('id', ParseIntPipe) id: number, @Body() review: UpdateProfileReviewDto){
    return this.profileReviewsService.updateProfileReview(id, review)
  }

  @Delete(':id')
  DeleteProfileReview(@Param('id', ParseIntPipe) id: number){
    return this.profileReviewsService.deleteProfileReview(id)
  }
}
