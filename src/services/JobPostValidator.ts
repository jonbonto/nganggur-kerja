import { JobPostDTO } from '../models/JobPostDTO';

export class JobPostValidator {
  static validate(jobDetails: JobPostDTO): string | null {
    if (!jobDetails.title || !jobDetails.company || !jobDetails.category || !jobDetails.description || !jobDetails.salary || !jobDetails.location) {
      return 'All fields are required.';
    }
    return null;
  }
}
