'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { AppSession } from '@/types';

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
  const [isSaved, setIsSaved] = useState(false);

  const {id: jobId} = useParams();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) throw new Error('Failed to fetch job details');
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      const session = await getSession() as AppSession;
      if (session && session.user?.role) {
        setUserRole(session.user?.role);
      }
    };

    const trackUniqueView = async () => {
      try {
        await fetch(`/api/jobs/${jobId}/track-views`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to track unique job view:', error);
      }
    };

    if (jobId) {
      fetchJobDetails();
      fetchUserRole()
      trackUniqueView();
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
  
  const handleSaveJob = async () => {
    const response = await fetch('/api/jobs/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobId: job?.id }),
    });

    const data = await response.json();

    if (response.ok) {
      setIsSaved(true);
      alert('Job saved successfully');
    } else {
      alert(data.message || 'Error saving job');
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
    <div className="container mx-auto py-16 px-6 max-w-4xl">
  {/* Job Header with Save Job Button */}
  <div className="flex justify-between items-center mb-6">
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-1">{job.title}</h1>
      <p className="text-lg font-medium text-gray-700">{job.company} | {job.location}</p>
    </div>
    {userRole === 'user' && (
      <div>
        {/* Save Job Button */}
        {!isSaved ? (
          <button
            onClick={handleSaveJob}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Save Job
          </button>
        ) : (
          <button className="px-6 py-3 bg-gray-600 text-white rounded-md cursor-not-allowed">
            Job Saved
          </button>
        )}
      </div>
    )}
  </div>

  {/* Job Description Section */}
  <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Job Description</h2>
    <p className="text-gray-700 leading-relaxed">{job.description}</p>
  </div>

  {/* Requirements & Benefits Section */}
  <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Requirements</h3>
        <ul className="list-disc ml-6 space-y-2">
          {job.requirements.map((req, index) => (
            <li key={index} className="text-gray-600">{req}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Benefits</h3>
        <ul className="list-disc ml-6 space-y-2">
          {job.benefits.map((benefit, index) => (
            <li key={index} className="text-gray-600">{benefit}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>

  {/* Application Section for Users */}
  {userRole === 'user' && (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">Apply for this Job</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Cover Letter</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full p-4 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            rows={4}
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Resume URL</label>
          <input
            type="text"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            className="w-full p-4 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleApply}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300 mt-4"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Employer Section */}
    <div className="mt-8 flex justify-end items-center">
  {userRole === 'employer' && (
      <button
        onClick={() => router.push(`/jobs/${jobId}/applications`)}
        className="me-auto bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
      >
        See Applications
      </button>
  )}
    <button
      onClick={() => router.push('/jobs')}
      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
    >
      Back to Listings
    </button>
    </div>

</div>

  )
    
};

export default JobDetailsPage;
