'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getSession } from 'next-auth/react';

interface JobDetailsProps {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

const JobDetailsPage: React.FC = () => {
  const router = useRouter();
  const [job, setJob] = useState<JobDetailsProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  const {id: jobId} = useParams();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) throw new Error('Failed to fetch job details');
        const data = await response.json();
        setJob(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      const session = await getSession();
      if (session && session.user?.role) {
        setUserRole(session.user?.role);
      }
    };

    if (jobId) {
      fetchJobDetails();
      fetchUserRole()
    }
  }, [jobId]);

  const handleApply = async () => {
    const res = await fetch('/api/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId, coverLetter, resumeUrl }),
    });

    const data = await res.json();
    if (data.message) {
      alert(data.message); // Simple feedback to the user
    }
  };

  if (loading) {
    return <p className="text-center py-8">Loading job details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-8">{error}</p>;
  }

  if (!job) {
    return <p className="text-center py-8">Job not found</p>;
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <p className="text-lg text-gray-700 mb-2">{job.company}</p>
      <p className="text-md text-gray-600 mb-6">{job.location}</p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Job Description</h2>
        <p className="text-gray-800 mb-4">{job.description}</p>

        {/* <h3 className="text-lg font-semibold mb-2">Requirements</h3>
        <ul className="list-disc ml-6 mb-4">
          {job.requirements.map((req, index) => (
            <li key={index} className="text-gray-800">
              {req}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold mb-2">Benefits</h3>
        <ul className="list-disc ml-6">
          {job.benefits.map((benefit, index) => (
            <li key={index} className="text-gray-800">
              {benefit}
            </li>
          ))}
        </ul> */}
      </div>

      <div className="mt-8 flex justify-between items-center">
        {userRole === 'user' && (
          <div>
            <h4 className="mt-6 text-lg font-semibold">Apply for this job</h4>
            <div>
              <label>Cover Letter</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                rows={4}
              ></textarea>
            </div>
            <div className="mt-4">
              <label>Resume URL</label>
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              onClick={handleApply}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Apply Now
            </button>
          </div>
        )}

        { userRole === 'employer' &&
          <button
            onClick={() => router.push(`/jobs/${jobId}/applications`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            See Applications
          </button>
        }

        <button
          onClick={() => router.push('/jobs')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Listings
        </button>
      </div>
    </div>
  );
};

export default JobDetailsPage;
