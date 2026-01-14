'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
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

interface Skill {
  id: number;
  name: string;
  level?: string;
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
  skills: Skill[];
}

export default function FreelancerDashboard() {
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

  if (loading) return <LoadingSpinner />;
  if (!profile) return <div className="container mx-auto py-10">Failed to load profile</div>;

  const stats = {
    totalApplications: profile.applications.length,
    pendingApplications: profile.applications.filter(a => a.status === 'pending').length,
    acceptedApplications: profile.applications.filter(a => a.status === 'accepted').length,
    savedJobs: profile.savedJobs.length
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Job Seeker Dashboard</h2>
      
      {/* Profile completion banner */}
      {(!profile.phone || !profile.bio || !profile.resumeUrl) && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="font-bold">Complete your profile to increase your chances!</p>
          <button 
            onClick={() => router.push('/profile')}
            className="text-sm underline mt-2"
          >
            Update profile
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Total Applications</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalApplications}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Pending</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{stats.pendingApplications}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Accepted</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{stats.acceptedApplications}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Saved Jobs</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">{stats.savedJobs}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'applications', 'saved'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/jobs')}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Browse Jobs
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700"
              >
                Update Profile
              </button>
              <button
                onClick={() => router.push('/dashboard/job-alerts')}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
              >
                Manage Alerts
              </button>
            </div>
          </div>

          {profile.skills && profile.skills.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Your Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span
                    key={skill.id}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill.name} {skill.level && `(${skill.level})`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="bg-white rounded-lg shadow">
          {profile.applications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>You haven't applied to any jobs yet.</p>
              <button
                onClick={() => router.push('/jobs')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {profile.applications.map(app => (
                <div key={app.id} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/job/${app.job.id}`)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{app.job.title}</h4>
                      <p className="text-gray-600">{app.job.company} • {app.job.location}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        app.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : app.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="bg-white rounded-lg shadow">
          {profile.savedJobs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>You haven't saved any jobs yet.</p>
              <button
                onClick={() => router.push('/jobs')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {profile.savedJobs.map(saved => (
                <div key={saved.id} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/job/${saved.job.id}`)}>
                  <h4 className="font-semibold text-lg">{saved.job.title}</h4>
                  <p className="text-gray-600">{saved.job.company} • {saved.job.location}</p>
                  {saved.job.salary && <p className="text-blue-600 font-medium mt-1">{saved.job.salary}</p>}
                  <p className="text-sm text-gray-500 mt-1">
                    Saved {new Date(saved.savedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

  