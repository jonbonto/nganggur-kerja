'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface Application {
  id: number;
  status: string;
  appliedAt: string;
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
  };
}

interface SavedJob {
  id: number;
  savedAt: string;
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    salary?: string;
  };
}

interface Profile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  resumeUrl?: string;
  applications: Application[];
  savedJobs: SavedJob[];
  skills: { id: number; name: string; level?: string }[];
}

export default function BetaFreelancerDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'saved'>('overview');
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/job-seekers/profile');
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setProfile(data.profile);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mx-auto py-10">Loading...</div>;
  if (!profile) return <div className="container mx-auto py-10">Failed to load profile</div>;

  const stats = {
    totalApplications: profile.applications.length,
    pendingApplications: profile.applications.filter(a => a.status === 'pending').length,
    acceptedApplications: profile.applications.filter(a => a.status === 'accepted').length,
    savedJobs: profile.savedJobs.length
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">Job Seeker Dashboard</h1>
      
      {/* Profile completion banner */}
      {(!profile.phone || !profile.bio || !profile.resumeUrl) && (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="font-semibold mb-2">Complete your profile to increase your chances!</p>
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => router.push('/beta/profile')}
            >
              Update profile
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.acceptedApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.savedJobs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={activeTab === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button 
          variant={activeTab === 'applications' ? 'default' : 'outline'}
          onClick={() => setActiveTab('applications')}
        >
          Applications
        </Button>
        <Button 
          variant={activeTab === 'saved' ? 'default' : 'outline'}
          onClick={() => setActiveTab('saved')}
        >
          Saved Jobs
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest job applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.applications.slice(0, 5).map((app) => (
                <div key={app.id} className="flex justify-between items-start border-b pb-2">
                  <div>
                    <h4 className="font-semibold">{app.job.title}</h4>
                    <p className="text-sm text-muted-foreground">{app.job.company}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Jobs</CardTitle>
              <CardDescription>Jobs you saved for later</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.savedJobs.slice(0, 5).map((saved) => (
                <div key={saved.id} className="border-b pb-2">
                  <h4 className="font-semibold">{saved.job.title}</h4>
                  <p className="text-sm text-muted-foreground">{saved.job.company}</p>
                  {saved.job.salary && (
                    <p className="text-sm text-muted-foreground">{saved.job.salary}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'applications' && (
        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
            <CardDescription>Manage your job applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.applications.map((app) => (
              <Card key={app.id}>
                <CardContent className="flex justify-between items-center pt-6">
                  <div>
                    <h4 className="font-semibold">{app.job.title}</h4>
                    <p className="text-sm text-muted-foreground">{app.job.company} • {app.job.location}</p>
                    <p className="text-xs text-muted-foreground">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {app.status}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/beta/jobs/${app.job.id}`)}
                    >
                      View Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === 'saved' && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Jobs</CardTitle>
            <CardDescription>Jobs you saved for later review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.savedJobs.map((saved) => (
              <Card key={saved.id}>
                <CardContent className="flex justify-between items-center pt-6">
                  <div>
                    <h4 className="font-semibold">{saved.job.title}</h4>
                    <p className="text-sm text-muted-foreground">{saved.job.company} • {saved.job.location}</p>
                    {saved.job.salary && (
                      <p className="text-sm text-muted-foreground">{saved.job.salary}</p>
                    )}
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => router.push(`/beta/jobs/${saved.job.id}`)}
                  >
                    View Job
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
