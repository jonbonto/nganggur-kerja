'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppSession } from '@/types';
import Image from 'next/image';

const BetaDashboard: React.FC = () => {
  const { data, status } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [applications, setApplications] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
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
        setApplications(data.applications || []);
      };

      const fetchSavedJobs = async () => {
        const response = await fetch('/api/users/saved-jobs');
        const data = await response.json();
        setSavedJobs(data.savedJobs || []);
      };

      fetchApplications();
      fetchSavedJobs();
    }
  }, [status, session?.user, router]);

  if (status === 'loading') return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (status === 'unauthenticated') return <div className="container mx-auto px-4 py-8">Please sign in to view your dashboard.</div>;

  const latestApplications = applications.slice(-3);
  const latestSavedJobs = savedJobs.slice(-3);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Your Dashboard</h1>

      {/* Profile Section */}
      <Card className="mb-8 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-center items-center">
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
                <p className="font-semibold">Name:</p>
                <p className="text-muted-foreground">{session?.user?.name}</p>
              </div>
              <div>
                <p className="font-semibold">Email:</p>
                <p className="text-muted-foreground">{session?.user?.email}</p>
              </div>
              <Link href="/beta/profile">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Saved Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Your Saved Jobs</CardTitle>
            <CardDescription>Jobs you&apos;ve saved for later</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestSavedJobs.length > 0 ? (
              latestSavedJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>{job.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/beta/jobs/${job.id}`}>
                      <Button variant="link" className="p-0">View Job</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">You haven&apos;t saved any jobs yet.</p>
            )}
            <Link href="/saved-jobs">
              <Button variant="outline" className="w-full">Show More</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Job Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Your Applications</CardTitle>
            <CardDescription>Track your job applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestApplications.length > 0 ? (
              latestApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{application.job?.title}</CardTitle>
                    <CardDescription>{application.job?.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Status: {application.status}</p>
                    <Link href={`/applications/${application.id}`}>
                      <Button variant="link" className="p-0">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">You have not applied to any jobs yet.</p>
            )}
            <Link href="/job-applications">
              <Button variant="outline" className="w-full">Show More</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BetaDashboard;
