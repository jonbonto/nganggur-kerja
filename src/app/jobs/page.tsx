'use client';

import { useState, useEffect } from 'react';
import JobCard from '@/components/JobCard';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const JobListingsPage = () => {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState([]);
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
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className='flex justify-between'>
      <h1 className="text-4xl font-semibold text-center mb-8">
        {session?.user.role === 'employer' ? 'Your Posted Jobs' : 'Available Jobs'}
      </h1>

      {/* Post Job Button for Employers */}
      {session?.user.role === 'employer' && (
        <Link href="/jobs/post">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Post Job
          </button>
        </Link>
      )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Search jobs..."
          className="p-3 border rounded-md flex-1"
        />

        <select
          name="category"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="p-3 border rounded-md flex-1"
        >
          <option value="">All Categories</option>
          {/* Add category options */}
        </select>

        <select
          name="location"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="p-3 border rounded-md flex-1"
        >
          <option value="">All Locations</option>
          {/* Add location options */}
        </select>
      </div>

      {/* Job Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} title={job.title} href={`/jobs/${job.id}`} company={job.company} location={job.location} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobListingsPage;
