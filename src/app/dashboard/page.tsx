'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JobPostDTO } from '@/models/JobPostDTO';
// import { JobApplicationDTO } from '@/models/JobApplicationDTO'; // Assuming you have a DTO for Job Applications

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<JobPostDTO[]>([]);
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.role === 'employer') {
        router.push('/dashboard/employer')
    }
    if (status === 'authenticated' && session?.user?.id) {
      const fetchApplications = async () => {
        const response = await fetch(`/api/applications`);
        const data = await response.json();
        setApplications(data.applications); // This could be a list of job applications
      };

      const fetchSavedJobs = async () => {
        const response = await fetch('/api/users/saved-jobs');
        const data = await response.json();
        setSavedJobs(data.savedJobs);
      };
  
      fetchApplications();
      fetchSavedJobs();
    }
  }, [status, session?.user?.id]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Please sign in to view your dashboard.</p>;

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Welcome to Your Dashboard</h2>

        <div className="mb-8">
          <h3 className="text-2xl font-medium mb-4">Your Job Applications</h3>
          {applications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {applications.map((application) => (
                <div key={application.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
                  <h3 className="text-xl font-semibold">{application.job.title}</h3>
                  <p className="text-gray-600">{application.job.company}</p>
                  <p className="text-gray-800 mt-2">{application.status}</p>
                  <Link href={`/applications/${application.id}`} className="text-blue-600 mt-4 inline-block">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>You have not applied to any jobs yet.</p>
          )}
        </div>
<div className="mb-8">
        <h3 className="text-2xl font-medium">Your Saved Jobs</h3>
      <div className="mt-4">
        {savedJobs.length > 0 ? (
          savedJobs.map((job) => (
            <div key={job.id} className="saved-job-item">
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <Link href={`/jobs/${job.id}`} className="text-blue-600 mt-4 inline-block">
                    View job
                  </Link>
            </div>
          ))
        ) : (
          <p>You haven't saved any jobs yet.</p>
        )}
      </div>
      </div>

        <div className="mb-8">
          <h3 className="text-2xl font-medium mb-4">Profile</h3>
          <Link href="/profile" className="text-blue-600 inline-block">Edit Profile</Link>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
