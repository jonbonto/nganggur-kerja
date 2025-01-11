'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';// Assuming you're using Prisma for DB access
import { JobPostDTO } from '@/models/JobPostDTO'; // Assuming you have a DTO for Job Posts

const EmployerDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const [postedJobs, setPostedJobs] = useState<JobPostDTO[]>([]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchJobs = async () => {
        const response = await fetch(`/api/jobs?userId=${session.user.id}`);
        const data = await response.json();
        setPostedJobs(data.jobs); // This will be a list of jobs posted by the employer
      };

      fetchJobs();
    }
  }, [status, session?.user?.id]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Please sign in to view your dashboard.</p>;

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Employer Dashboard</h2>

        <div className="mb-8">
          <h3 className="text-2xl font-medium mb-4">Your Posted Jobs</h3>
          {postedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postedJobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-gray-800 mt-2">{job.description}</p>
                  <Link href={`/jobs/${job.id}/applications`} className="text-blue-600 mt-4 inline-block">
                    View Applications
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>You have not posted any jobs yet.</p>
          )}
        </div>

        <div className="mb-8">
          <Link href="/jobs/post" className="bg-blue-600 text-white py-2 px-6 rounded-md">
            Post a New Job
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EmployerDashboard;
