'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  category: string;
  isActive: boolean;
  isApproved: boolean;
  isFlagged: boolean;
  flagReason?: string;
  createdAt: string;
  postedBy: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  _count: {
    applications: number;
    jobViews: number;
  };
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'unapproved'>('all');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, [filter, pagination.page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        filter,
        page: pagination.page.toString(),
        limit: '20'
      });

      const res = await fetch(`/api/admin/jobs?${params}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      
      const data = await res.json();
      setJobs(data.jobs);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (error) {
      console.error(error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = async (jobId: number, action: string, flagReason?: string) => {
    setActionLoading(jobId);
    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, action, flagReason })
      });

      if (!res.ok) throw new Error('Failed to update job');

      const data = await res.json();
      toast.success(data.message);
      
      // Update local state
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, ...data.job } : job
      ));
    } catch (error) {
      console.error(error);
      toast.error('Failed to update job');
    } finally {
      setActionLoading(null);
    }
  };

  const handleFlagJob = (jobId: number) => {
    const reason = prompt('Enter flag reason:');
    if (reason) {
      handleJobAction(jobId, 'flag', reason);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const res = await fetch(`/api/admin/jobs?id=${jobId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete job');

      toast.success('Job deleted successfully');
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete job');
    }
  };

  if (loading && jobs.length === 0) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Job Moderation</h1>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          All Jobs ({pagination.totalCount})
        </button>
        <button
          onClick={() => setFilter('flagged')}
          className={`px-4 py-2 rounded-md ${
            filter === 'flagged' ? 'bg-red-600 text-white' : 'bg-gray-200'
          }`}
        >
          Flagged Jobs
        </button>
        <button
          onClick={() => setFilter('unapproved')}
          className={`px-4 py-2 rounded-md ${
            filter === 'unapproved' ? 'bg-yellow-600 text-white' : 'bg-gray-200'
          }`}
        >
          Unapproved Jobs
        </button>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow">
        {jobs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No jobs found for this filter.
          </div>
        ) : (
          <div className="divide-y">
            {jobs.map(job => (
              <div key={job.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      {job.isFlagged && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          🚩 Flagged
                        </span>
                      )}
                      {!job.isApproved && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Pending Approval
                        </span>
                      )}
                      {!job.isActive && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          Archived
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">
                      {job.company} • {job.location} • {job.category}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Posted by: {job.postedBy.name} ({job.postedBy.email})
                    </p>
                    {job.flagReason && (
                      <p className="text-sm text-red-600 mt-2">
                        <strong>Flag Reason:</strong> {job.flagReason}
                      </p>
                    )}
                    <div className="flex gap-4 text-sm text-gray-600 mt-2">
                      <span>📊 {job._count.applications} applications</span>
                      <span>👁️ {job._count.jobViews} views</span>
                      <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {!job.isApproved && (
                      <button
                        onClick={() => handleJobAction(job.id, 'approve')}
                        disabled={actionLoading === job.id}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                      >
                        Approve
                      </button>
                    )}
                    {job.isApproved && !job.isFlagged && (
                      <button
                        onClick={() => handleFlagJob(job.id)}
                        disabled={actionLoading === job.id}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50 text-sm"
                      >
                        Flag Job
                      </button>
                    )}
                    {job.isFlagged && (
                      <button
                        onClick={() => handleJobAction(job.id, 'unflag')}
                        disabled={actionLoading === job.id}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                      >
                        Unflag
                      </button>
                    )}
                    {job.isActive ? (
                      <button
                        onClick={() => handleJobAction(job.id, 'archive')}
                        disabled={actionLoading === job.id}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 text-sm"
                      >
                        Archive
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJobAction(job.id, 'activate')}
                        disabled={actionLoading === job.id}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => router.push(`/job/${job.id}`)}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{jobs.length}</span> of{' '}
              <span className="font-medium">{pagination.totalCount}</span> jobs
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
