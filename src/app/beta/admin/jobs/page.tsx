'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  company: string;
  status: string;
  flagged: boolean;
}

const BetaAdminJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState({ status: '', search: '' });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const query = new URLSearchParams(filter);
        const response = await fetch(`/api/admin/jobs?${query}`);
        const data = await response.json();
        if (response.ok) {
          setJobs(data.jobs || []);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, [filter]);

  const handleApprove = async (jobId: string) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });

      if (response.ok) {
        setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'approved' } : j));
      }
    } catch (error) {
      console.error('Error approving job:', error);
    }
  };

  const handleFlag = async (jobId: string) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'flag' }),
      });

      if (response.ok) {
        setJobs(jobs.map(j => j.id === jobId ? { ...j, flagged: true } : j));
      }
    } catch (error) {
      console.error('Error flagging job:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Job Moderation</h1>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter jobs by status or search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search by title or company..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">All Jobs</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="flagged">Flagged</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
          <CardDescription>Moderate all job postings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="flex justify-between items-center pt-6">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                      <p className="text-sm">
                        <span className="font-medium">Status:</span> {job.status}
                        {job.flagged && <span className="text-destructive ml-2">• Flagged</span>}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/beta/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      {job.status === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => handleApprove(job.id)}
                        >
                          Approve
                        </Button>
                      )}
                      {!job.flagged && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleFlag(job.id)}
                        >
                          Flag
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No jobs found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BetaAdminJobs;
