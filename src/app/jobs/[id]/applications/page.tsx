'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [filter, setFilter] = useState<string>('all'); // Filter state for status
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null); // Reset error state before each fetch

      if (id) {
        try {
          // Fetch job applications based on filter
          const res = await fetch(`/api/jobs/${id}/applications?status=${filter}`);

          if (res.status === 401) {
            return router.push('/');
          }

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'Failed to fetch applications');
          }

          setApplications(data.applications);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchApplications();
  }, [id, filter, router]); // Refetch on filter change

  const updateApplicationStatus = async (applicationId: number, status: string) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      toast.success(`${status.charAt(0).toUpperCase() + status.slice(1)} application success`);

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
    } catch (error) {
      toast.error(error.message || 'An error occurred while updating status');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-16">
        <span className="text-xl font-semibold text-red-600">{error}</span>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Job Applications</h2>

        {/* Filter Controls */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          >
            All Applications
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-2 rounded-md ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-300'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-6 py-2 rounded-md ${filter === 'accepted' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
          >
            Accepted
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-6 py-2 rounded-md ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-300'}`}
          >
            Rejected
          </button>
        </div>

        {/* Application List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {applications.map((application: any) => (
            <div
              key={application.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold">{application.user.name}</h3>
              <p className="text-gray-600 mt-2">Cover Letter: {application.coverLetter}</p>
              <p className="text-gray-600 mt-2">
                Resume: <a href={application.resumeUrl} className="text-blue-600 hover:underline">View Resume</a>
              </p>
              <p className="mt-4">
                Status: 
                <span
                  className={`px-3 py-1 rounded-full ${
                    application.status === 'accepted' ? 'bg-green-500' :
                    application.status === 'rejected' ? 'bg-red-500' :
                    'bg-yellow-500'
                  } text-white`}
                >
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </p>

              {application.status === 'pending' && (
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => updateApplicationStatus(application.id, 'accepted')}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(application.id, 'rejected')}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobApplications;
