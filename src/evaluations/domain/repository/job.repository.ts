import { Job } from "../model/job.entity";

export abstract class JobRepository {
  abstract getAll(): Promise<Job[]>;
  abstract getById(id: number): Promise<Job | null>;
  abstract count(): Promise<number>;
}
