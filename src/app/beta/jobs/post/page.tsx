'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { JobPostDTO } from '@/models/JobPostDTO';
import { JobPostValidator } from '@/services/JobPostValidator';
import { JobPostAPI } from '@/services/JobPostApi';

const BetaPostJobPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobDetails, setJobDetails] = useState<Partial<JobPostDTO>>({
    title: '',
    company: '',
    category: '',
    description: '',
    salary: '',
    location: '',
  });
  const [error, setError] = useState<string | null>(null);

  if (status === 'loading') {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  if (!session) {
    router.push('/beta/auth/signin');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobDetails({
      ...jobDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = JobPostValidator.validate(jobDetails as JobPostDTO);
    if (validationError) {
      setError(validationError);
      return;
    }

    const isSuccess = await JobPostAPI.postJob(jobDetails as JobPostDTO);
    if (isSuccess) {
      router.push('/beta/jobs');
    } else {
      setError('Failed to post job. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Post a Job</h1>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Fill in the details for your job posting</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Job Title
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                value={jobDetails.title}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                Company
              </label>
              <Input
                type="text"
                id="company"
                name="company"
                value={jobDetails.company}
                onChange={handleChange}
                placeholder="e.g., Tech Corp Inc."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Input
                type="text"
                id="category"
                name="category"
                value={jobDetails.category}
                onChange={handleChange}
                placeholder="e.g., Software Development"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                type="text"
                id="location"
                name="location"
                value={jobDetails.location}
                onChange={handleChange}
                placeholder="e.g., Remote or New York, NY"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="salary" className="text-sm font-medium">
                Salary
              </label>
              <Input
                type="text"
                id="salary"
                name="salary"
                value={jobDetails.salary}
                onChange={handleChange}
                placeholder="e.g., $80,000 - $120,000"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Job Description
              </label>
              <textarea
                id="description"
                name="description"
                value={jobDetails.description}
                onChange={handleChange}
                className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Describe the job responsibilities, requirements, and benefits..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">Post Job</Button>
              <Button type="button" variant="outline" onClick={() => router.push('/beta/jobs')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BetaPostJobPage;
