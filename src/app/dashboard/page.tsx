/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JobPostDTO } from '@/models/JobPostDTO';
import { AppSession } from '@/types';
import Image from 'next/image';

const Dashboard: React.FC = () => {
  const { data, status } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<JobPostDTO[]>([]);
  const router = useRouter();
  const session = data as AppSession & { user: { profilePicture: string } };

  useEffect(() => {
    if (session?.user?.role === 'employer') {
      router.push('/dashboard/employer');
    }

    if (status === 'authenticated' && session?.user?.id) {
      const fetchApplications = async () => {
        const response = await fetch(`/api/applications`);
        const data = await response.json();
        setApplications(data.applications);
      };

      const fetchSavedJobs = async () => {
        const response = await fetch('/api/users/saved-jobs');
        const data = await response.json();
        setSavedJobs(data.savedJobs);
      };

      fetchApplications();
      fetchSavedJobs();
    }
  }, [status, session?.user, router]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Please sign in to view your dashboard.</p>;

  // Show only the last 3 jobs/applications
  const latestApplications = applications.slice(-3);
  const latestSavedJobs = savedJobs.slice(-3);

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">Welcome to Your Dashboard</h2>

        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-medium text-gray-800 mb-6">Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-center items-center">
              {/* Profile Image */}
              <div className="relative w-32 h-32">
                <Image
                  src={session?.user?.profilePicture || '/default-profile.png'}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                  width={300}
                  height={300}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-800">Name:</p>
                <p className="text-gray-700">{session?.user?.name}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Email:</p>
                <p className="text-gray-700">{session?.user?.email}</p>
              </div>
              <div>
                <Link href="/profile" className="text-blue-600 hover:underline">Edit Profile</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Jobs and Job Applications Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Saved Jobs Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-medium text-gray-800 mb-4">Your Saved Jobs</h3>
            <div className="space-y-6">
              {latestSavedJobs.length > 0 ? (
                latestSavedJobs.map((job) => (
                  <div key={job.id} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-xl transition-all">
                    <h4 className="text-xl font-semibold text-gray-800">{job.title}</h4>
                    <p className="text-gray-600">{job.company}</p>
                    <Link href={`/jobs/${job.id}`} className="text-blue-600 mt-2 inline-block hover:underline">
                      View Job
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-700">You haven&apos;t saved any jobs yet.</p>
              )}
            </div>
            <Link href="/saved-jobs" className="text-blue-600 mt-4 inline-block hover:underline">Show More</Link>
          </div>

          {/* Job Applications Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-medium text-gray-800 mb-4">Your Job Applications</h3>
            <div className="space-y-6">
              {latestApplications.length > 0 ? (
                latestApplications.map((application) => (
                  <div key={application.id} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-xl transition-all">
                    <h4 className="text-xl font-semibold text-gray-800">{application.job.title}</h4>
                    <p className="text-gray-600">{application.job.company}</p>
                    <p className="text-gray-800 mt-2">{application.status}</p>
                    <Link href={`/applications/${application.id}`} className="text-blue-600 mt-4 inline-block hover:underline">
                      View Details
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-700">You have not applied to any jobs yet.</p>
              )}
            </div>
            <Link href="/job-applications" className="text-blue-600 mt-4 inline-block hover:underline">Show More</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
