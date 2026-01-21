'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
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

const BetaEmployerDashboard: React.FC = () => {
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

  if (loading) return <div className="container mx-auto py-10">Loading...</div>;

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
        <h1 className="text-4xl font-bold">Employer Dashboard</h1>
        <Button onClick={() => router.push('/beta/jobs/post')}>
          Post New Job
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStats.totalJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totalStats.activeJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalStats.totalApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{totalStats.pendingApplications}</div>
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
          variant={activeTab === 'jobs' ? 'default' : 'outline'}
          onClick={() => setActiveTab('jobs')}
        >
          Jobs
        </Button>
        <Button 
          variant={activeTab === 'analytics' ? 'default' : 'outline'}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>Your latest job postings</CardDescription>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No jobs posted yet.</p>
                <Button onClick={() => router.push('/beta/jobs/post')}>
                  Post Your First Job
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.slice(0, 5).map(job => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.location}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                        <span>{job.stats.totalApplications} applications</span>
                        <span>{job.stats.pendingApplications} pending</span>
                        <span>{job.stats.totalViews} views</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => router.push(`/beta/jobs/${job.id}/applications`)}
                      >
                        View Applications
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'jobs' && (
        <Card>
          <CardHeader>
            <CardTitle>All Jobs</CardTitle>
            <CardDescription>Manage your job postings</CardDescription>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No jobs posted yet.</p>
                <Button onClick={() => router.push('/beta/jobs/post')}>
                  Post Your First Job
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <Card key={job.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{job.title}</h4>
                          <p className="text-muted-foreground">{job.company} • {job.location}</p>
                          <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                            <span>📊 {job.stats.totalApplications} applications</span>
                            <span>👁️ {job.stats.totalViews} views</span>
                            <span>⏳ {job.stats.pendingApplications} pending</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/beta/jobs/${job.id}`)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/beta/jobs/${job.id}/applications`)}
                          >
                            Applications
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Analytics</CardTitle>
              <CardDescription>Performance metrics for your jobs</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.length > 0 ? (
                <div className="flex justify-center">
                  <PieChart width={300} height={300}>
                    <Pie
                      data={analyticsData}
                      cx={150}
                      cy={150}
                      labelLine={false}
                      label
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No analytics data available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Trends</CardTitle>
              <CardDescription>Application statistics by job</CardDescription>
            </CardHeader>
            <CardContent>
              {jobs.length > 0 ? (
                <BarChart width={400} height={300} data={jobs.slice(0, 5).map(j => ({
                  name: j.title.substring(0, 15),
                  applications: j.stats.totalApplications
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#8884d8" />
                </BarChart>
              ) : (
                <p className="text-center text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BetaEmployerDashboard;
