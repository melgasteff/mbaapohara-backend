import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { InterviewQuestionsService } from './interview-questions.service';
import { CreateInterviewQuestionDto } from './dto/create-interview-question.dto';
import { UpdateInterviewQuestionDto } from './dto/update-interview-question.dto';

@Controller('interviewQuestions')
export class InterviewQuestionsController {
  constructor(private readonly interviewQuestionsService: InterviewQuestionsService) {}

  @Post()
  createInterviewQuestion (@Body() interviewQuestion: CreateInterviewQuestionDto) {
    return this.interviewQuestionsService.createInterviewQuestion(interviewQuestion);
  }

  @Get()
  getAllInterviewQuestion() {
    return this.interviewQuestionsService.getAllInterviewQuestions();
  }

  @Get(':id')
  getInterviewQuestionById(@Param('id', ParseIntPipe) id: number) {
    return this.interviewQuestionsService.getInterviewQuestionById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() interviewQuestion: UpdateInterviewQuestionDto) {
    return this.interviewQuestionsService.updateInterviewQuestion(id, interviewQuestion);
  }

  @Delete(':id')
  deleteInterviewQuestion(@Param('id' , ParseIntPipe) id: number) {
    return this.interviewQuestionsService.deleteInterviewQuestion(id);
  }
}
