import { JobPostDTO } from '../models/JobPostDTO';

export class JobFilter {
  // Filter jobs based on selected category
  static filterByCategory(jobs: JobPostDTO[], category: string): JobPostDTO[] {
    if (category === 'All') return jobs;
    return jobs.filter((job) => job.category === category);
  }

  // Filter jobs based on the search query (job title)
  static filterBySearchQuery(jobs: JobPostDTO[], query: string): JobPostDTO[] {
    if (!query) return jobs;
    return jobs.filter((job) =>
      job.title.toLowerCase().includes(query.toLowerCase())
    );
  }
}
