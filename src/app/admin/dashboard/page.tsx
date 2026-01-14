'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

interface DashboardData {
  overview: {
    users: {
      total: number;
      jobSeekers: number;
      employers: number;
      admins: number;
      newThisMonth: number;
      growth: number;
    };
    jobs: {
      total: number;
      active: number;
      archived: number;
      flagged: number;
      newThisMonth: number;
      growth: number;
    };
    applications: {
      total: number;
      pending: number;
      accepted: number;
      rejected: number;
    };
  };
  recent: {
    users: Array<{
      id: number;
      name: string;
      email: string;
      role: string;
      createdAt: string;
      isActive: boolean;
    }>;
    jobs: Array<{
      id: number;
      title: string;
      company: string;
      createdAt: string;
      postedBy: {
        name: string;
        email: string;
      };
      _count: {
        applications: number;
      };
    }>;
  };
  analytics: {
    jobsByCategory: Array<{
      category: string;
      count: number;
    }>;
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/unauthorized');
          return;
        }
        throw new Error('Failed to fetch dashboard data');
      }
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="container mx-auto py-10">Failed to load dashboard</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Overview Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Platform Overview</h2>
        
        {/* User Statistics */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-gray-700">Users</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Total Users</h4>
              <p className="text-3xl font-bold mt-2">{data.overview.users.total}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Job Seekers</h4>
              <p className="text-3xl font-bold mt-2 text-blue-600">{data.overview.users.jobSeekers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Employers</h4>
              <p className="text-3xl font-bold mt-2 text-green-600">{data.overview.users.employers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Admins</h4>
              <p className="text-3xl font-bold mt-2 text-purple-600">{data.overview.users.admins}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">New This Month</h4>
              <p className="text-3xl font-bold mt-2">{data.overview.users.newThisMonth}</p>
              <p className={`text-sm mt-1 ${data.overview.users.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.overview.users.growth >= 0 ? '↑' : '↓'} {Math.abs(data.overview.users.growth).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Job Statistics */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-gray-700">Jobs</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Total Jobs</h4>
              <p className="text-3xl font-bold mt-2">{data.overview.jobs.total}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Active</h4>
              <p className="text-3xl font-bold mt-2 text-green-600">{data.overview.jobs.active}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Archived</h4>
              <p className="text-3xl font-bold mt-2 text-gray-600">{data.overview.jobs.archived}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Flagged</h4>
              <p className="text-3xl font-bold mt-2 text-red-600">{data.overview.jobs.flagged}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">New This Month</h4>
              <p className="text-3xl font-bold mt-2">{data.overview.jobs.newThisMonth}</p>
              <p className={`text-sm mt-1 ${data.overview.jobs.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.overview.jobs.growth >= 0 ? '↑' : '↓'} {Math.abs(data.overview.jobs.growth).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Application Statistics */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-gray-700">Applications</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Total Applications</h4>
              <p className="text-3xl font-bold mt-2">{data.overview.applications.total}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Pending</h4>
              <p className="text-3xl font-bold mt-2 text-yellow-600">{data.overview.applications.pending}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Accepted</h4>
              <p className="text-3xl font-bold mt-2 text-green-600">{data.overview.applications.accepted}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Rejected</h4>
              <p className="text-3xl font-bold mt-2 text-red-600">{data.overview.applications.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Manage Users
          </button>
          <button
            onClick={() => router.push('/admin/jobs')}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
          >
            Moderate Jobs
          </button>
          <button
            onClick={() => router.push('/admin/analytics')}
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700"
          >
            View Analytics
          </button>
          <button
            onClick={() => router.push('/admin/settings')}
            className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700"
          >
            Settings
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Recent Users</h3>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {data.recent.users.map(user => (
              <div key={user.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{user.name || 'No name'}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'employer' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                    {!user.isActive && (
                      <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Recent Jobs</h3>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {data.recent.jobs.map(job => (
              <div key={job.id} className="p-4 hover:bg-gray-50">
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-gray-600">{job.company}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Posted by {job.postedBy.name} • {job._count.applications} applications
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs by Category */}
      {data.analytics.jobsByCategory.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Jobs by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {data.analytics.jobsByCategory.map((item, index) => (
              <div key={index} className="border p-4 rounded-md">
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="text-2xl font-bold mt-1">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
