import { JobPostDTO } from '../models/JobPostDTO';

export class JobPostAPI {
  static async postJob(jobDetails: JobPostDTO): Promise<boolean> {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobDetails),
      });
      
      if (!response.ok) {
        throw new Error('Failed to post job.');
      }

      return true;
    } catch (error) {
      console.error('API Error:', error);
      return false;
    }
  }
}
