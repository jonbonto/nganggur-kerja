'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AppSession } from '@/types';

const BetaJobListingsPage = () => {
  const { data } = useSession();
  const session = data as AppSession;
  const [jobs, setJobs] = useState<{ id: string; title: string; company: string; location: string }[]>([]);
  const [filters, setFilters] = useState({ search: '', category: '', location: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!session) return;

    const fetchJobs = async () => {
      const query = new URLSearchParams({
        ...filters,
        page: String(page),
        limit: '10',
      });

      const response = await fetch(`/api/jobs?${query}`);
      const data = await response.json();

      if (response.ok) {
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
      }
    };

    fetchJobs();
  }, [filters, page, session]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          {session?.user?.role === 'employer' ? 'Your Posted Jobs' : 'Available Jobs'}
        </h1>

        {session?.user.role === 'employer' && (
          <div className="flex gap-2">
            <Link href="/beta/jobs/post">
              <Button>Post Job</Button>
            </Link>
            <Link href="/beta/jobs/bulk-upload">
              <Button variant="outline">Bulk Upload</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Input
          type="text"
          name="search"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Search jobs..."
          className="md:col-span-2"
        />

        <select
          name="category"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">All Categories</option>
          <option value="technology">Technology</option>
          <option value="design">Design</option>
          <option value="marketing">Marketing</option>
        </select>

        <select
          name="location"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">All Locations</option>
          <option value="remote">Remote</option>
          <option value="onsite">On-site</option>
        </select>
      </div>

      {/* Job Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.company}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{job.location}</p>
              <Link href={`/beta/jobs/${job.id}`}>
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4">
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          variant="outline"
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default BetaJobListingsPage;
