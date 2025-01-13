'use client';

import { useState, useEffect } from 'react';
import JobCard from '@/components/JobCard';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Modal from '@/components/Modal';

const JobListingsPage = () => {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', location: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [alertCriteria, setAlertCriteria] = useState({ category: '', location: '' });

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

  // Function to trigger the modal
  const handleAlertClick = () => {
    setShowModal(true);
  };

  const handleAlertClose = () => {
    setShowModal(false);
  };

  const handleAlertSubmit = async () => {
    // Send the alert criteria to the backend
    await fetch('/api/job-alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ criteria: alertCriteria }),
    });
    setShowModal(false); // Close the modal after submitting
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className='flex justify-between'>
      <h1 className="text-4xl font-semibold text-center mb-8">
        {session?.user.role === 'employer' ? 'Your Posted Jobs' : 'Available Jobs'}
      </h1>

      {/* Post Job Button for Employers */}
      {session?.user.role === 'employer' && (
        <div>
        <Link href="/jobs/post">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Post Job
          </button>
        </Link>
        <Link href="/jobs/bulk">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Bulk Job
          </button>
        </Link>
        </div>
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

        {/* Set Alert Button */}
        <button
            className="bg-blue-600 text-white p-3 rounded-md"
            onClick={handleAlertClick}
          >
            Set Job Alert
          </button>
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
      {/* Modal for Setting Alerts */}
      {showModal && (
          <Modal onClose={handleAlertClose}>
            <h3 className="text-xl font-semibold mb-4">Set Job Alert</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Category"
                value={alertCriteria.category}
                onChange={(e) => setAlertCriteria({ ...alertCriteria, category: e.target.value })}
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Location"
                value={alertCriteria.location}
                onChange={(e) => setAlertCriteria({ ...alertCriteria, location: e.target.value })}
                className="p-2 border rounded-md"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-md"
                onClick={handleAlertSubmit}
              >
                Save Alert
              </button>
            </div>
          </Modal>
        )}
    </div>
  );
};

export default JobListingsPage;
