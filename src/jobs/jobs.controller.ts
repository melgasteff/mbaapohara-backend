import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  createJob(@Body() job: CreateJobDto) {
    return this.jobsService.createJob(job);
  }

  @Get()
  getAllJobs() {
    return this.jobsService.getAllJobs();
  }

  //Solo funciona cuando esta sobre el getjobbyid
  @Get('search')
  getJobByName(@Query('job') job: string) {
    console.log(job)
    return this.jobsService.getJobByName(job);
  }

  @Get(':id')
  getJobById(@Param('id', ParseIntPipe) id: number) {
    console.log('dididdd')
    return this.jobsService.getJobById(id);
  }

  @Patch(':id')
  updateJob(@Param('id', ParseIntPipe) id: number, @Body() job: UpdateJobDto) {
    return this.jobsService.updateJob(id, job);
  }

  @Delete(':id')
  deleteJob(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.deleteJob(id);
  }
}
