import JobCard from '@/components/JobCard';

const jobs = [
  { id: 1, title: 'Web Developer', company: 'TechCorp', location: 'Remote' },
  { id: 2, title: 'Graphic Designer', company: 'DesignHub', location: 'New York, NY' },
];

export default function JobList() {
  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6">Job Listings</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            href=""
          />
        ))}
      </div>
    </div>
  );
}
