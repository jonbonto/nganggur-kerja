'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppSession } from '@/types';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary?: string;
  type?: string;
}

const BetaJobDetailPage = () => {
  const params = useParams();
  const { data } = useSession();
  const session = data as AppSession;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`);
        const data = await response.json();
        if (response.ok) {
          setJob(data);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const handleApply = async () => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: params.id }),
      });

      if (response.ok) {
        alert('Application submitted successfully!');
      }
    } catch (error) {
      console.error('Error applying:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!job) {
    return <div className="container mx-auto px-4 py-8">Job not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{job.title}</CardTitle>
          <CardDescription className="text-lg">{job.company}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>📍 {job.location}</span>
            {job.type && <span>💼 {job.type}</span>}
            {job.salary && <span>💰 {job.salary}</span>}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Requirements</h3>
            <p className="text-muted-foreground whitespace-pre-line">{job.requirements}</p>
          </div>

          {session?.user?.role !== 'employer' && (
            <div className="flex gap-4">
              <Button onClick={handleApply} size="lg">
                Apply Now
              </Button>
              <Button variant="outline" size="lg">
                Save Job
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BetaJobDetailPage;
