import JobCard from './JobCard';

const mockJobs = [
  { id: 1, title: 'Full-Stack Developer', company: 'TechCorp', location: 'Remote' },
  { id: 2, title: 'Graphic Designer', company: 'DesignHub', location: 'New York, NY' },
  { id: 3, title: 'Digital Marketer', company: 'MarketMinds', location: 'San Francisco, CA' },
  { id: 4, title: 'Content Writer', company: 'WriteRight', location: 'Remote' },
  { id: 5, title: 'UX/UI Designer', company: 'CreativeSolutions', location: 'Austin, TX' },
];

const FeaturedJobs: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Jobs</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockJobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              href={`/job/${job.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
