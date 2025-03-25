import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { InterviewsEvlService } from './interviews-evl.service';
import { CreateInterviewsEvlDto } from './dto/create-interviews-evl.dto';
import { UpdateInterviewsEvlDto } from './dto/update-interviews-evl.dto';

@Controller('interviewsEvl')
export class InterviewsEvlController {
  constructor(private readonly interviewsEvlService: InterviewsEvlService) {}

  @Post()
  createInterviewEvl(@Body() interviewEvl: CreateInterviewsEvlDto) {
    return this.interviewsEvlService.createInterviewEvl(interviewEvl);
  }

  @Get()
  getAllInterviewEvl() {
    return this.interviewsEvlService.getAllInterviewEvl();
  }

  @Get(':id')
  getInterviewEvlById(@Param('id', ParseIntPipe) id: number) {
    return this.interviewsEvlService.getInterviewEvlById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() interviewEvl: UpdateInterviewsEvlDto) {
    return this.interviewsEvlService.updateInterviewEvl(id, interviewEvl);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.interviewsEvlService.deleteInterviewEvl(id);
  }
}
