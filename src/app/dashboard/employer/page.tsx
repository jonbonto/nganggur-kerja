'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f'];

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  isActive: boolean;
  createdAt: string;
  stats: {
    totalApplications: number;
    pendingApplications: number;
    acceptedApplications: number;
    rejectedApplications: number;
    totalViews: number;
  };
}

const EmployerDashboard: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'analytics'>('overview');
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, jobsRes] = await Promise.all([
        fetch('/api/jobs/analytics'),
        fetch('/api/employers/jobs')
      ]);

      if (analyticsRes.ok) {
        const analyticsResult = await analyticsRes.json();
        if (analyticsResult.data) {
          setAnalyticsData(analyticsResult.data);
        }
      }

      if (jobsRes.ok) {
        const jobsResult = await jobsRes.json();
        setJobs(jobsResult.jobs || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const totalStats = jobs.reduce(
    (acc, job) => ({
      totalJobs: acc.totalJobs + 1,
      activeJobs: acc.activeJobs + (job.isActive ? 1 : 0),
      totalApplications: acc.totalApplications + job.stats.totalApplications,
      pendingApplications: acc.pendingApplications + job.stats.pendingApplications
    }),
    { totalJobs: 0, activeJobs: 0, totalApplications: 0, pendingApplications: 0 }
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Employer Dashboard</h1>
        <button
          onClick={() => router.push('/jobs/post')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Post New Job
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Total Jobs</h3>
          <p className="text-3xl font-bold mt-2">{totalStats.totalJobs}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Active Jobs</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{totalStats.activeJobs}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Total Applications</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">{totalStats.totalApplications}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Pending Reviews</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{totalStats.pendingApplications}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'jobs', 'analytics'].map(tab => (
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
            <h3 className="text-xl font-semibold mb-4">Recent Jobs</h3>
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No jobs posted yet.</p>
                <button
                  onClick={() => router.push('/jobs/post')}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.slice(0, 5).map(job => (
                  <div
                    key={job.id}
                    className="border p-4 rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/jobs/${job.id}/applications`)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.location}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-4 text-sm text-gray-600">
                      <span>{job.stats.totalApplications} applications</span>
                      <span>{job.stats.pendingApplications} pending</span>
                      <span>{job.stats.totalViews} views</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="bg-white rounded-lg shadow">
          {jobs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No jobs posted yet.</p>
              <button
                onClick={() => router.push('/jobs/post')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {jobs.map(job => (
                <div key={job.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{job.title}</h4>
                      <p className="text-gray-600">{job.company} • {job.location}</p>
                      <div className="mt-2 flex gap-4 text-sm text-gray-600">
                        <span>📊 {job.stats.totalApplications} applications</span>
                        <span>⏳ {job.stats.pendingApplications} pending</span>
                        <span>👁️ {job.stats.totalViews} views</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/jobs/${job.id}/applications`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                      >
                        View Applications
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          {analyticsData.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
              <p>No analytics data available yet.</p>
            </div>
          ) : (
            analyticsData.map((job, index) => (
              <div key={index} className="mb-10 bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">{job.jobTitle}</h2>

                {/* Device Usage Chart */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Device Usage</h3>
                  <PieChart width={400} height={300}>
                    <Pie
                      data={job.devices}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {job.devices.map((entry: { type: string; count: number }, idx: number) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>

                {/* Location Bar Chart */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Views by Location</h3>
                  <BarChart width={500} height={300} data={job.locations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="place" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
