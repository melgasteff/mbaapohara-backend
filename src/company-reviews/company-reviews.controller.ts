import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CompanyReviewsService } from './company-reviews.service';
import { CreateCompanyReviewDto } from './dto/create-company-review.dto';
import { UpdateCompanyReviewDto } from './dto/update-company-review.dto';

@Controller('company-reviews')
export class CompanyReviewsController {
  constructor(private readonly companyReviewsService: CompanyReviewsService) {}

  @Post()
  createCompanyReview(@Body() companyReview: CreateCompanyReviewDto) {
    return this.companyReviewsService.createCompanyReview(companyReview);
  }

  @Get()
  getAllCompanyReviews() {
    return this.companyReviewsService.getAllCompanyReviews();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyReviewsService.getCompanyReviewById(id);
  }

  @Patch(':id')
  updateCompanyReview(@Param('id', ParseIntPipe) id: number, @Body() companyReview: UpdateCompanyReviewDto) {
    return this.companyReviewsService.updateCompanyReview(id, companyReview);
  }

  @Delete(':id')
  deleteCompanyReview(@Param('id', ParseIntPipe) id: number) {
    return this.companyReviewsService.deleteCompanyRview(id);
  }
}
