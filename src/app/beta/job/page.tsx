import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const jobs = [
  { id: 1, title: 'Web Developer', company: 'TechCorp', location: 'Remote' },
  { id: 2, title: 'Graphic Designer', company: 'DesignHub', location: 'New York, NY' },
];

export default function BetaJobList() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Job Listings</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.company}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">📍 {job.location}</p>
              <Link href={`/beta/jobs/${job.id}`}>
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
