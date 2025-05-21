import { Job } from "../model/job.entity";
import { NewJob } from "../model/new-job.entity";

export abstract class JobRepository {
  abstract create(newJob: NewJob): Promise<Job>;
  abstract getAll(): Promise<Job[]>;
  abstract getById(id: number): Promise<Job | null>;
  abstract update(id: number, office: Partial<Job>): Promise<Job>;
  abstract delete(id: number): Promise<void>;
  abstract count(): Promise<number>;
}
