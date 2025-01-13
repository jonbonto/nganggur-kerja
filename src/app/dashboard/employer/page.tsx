'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f'];

const EmployerDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/jobs/analytics');
        const result = await response.json();
        if (result.data) {
          setAnalyticsData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      }
    };

    fetchAnalytics();
  }, []);

  if (analyticsData.length === 0) {
    return <p>Loading analytics...</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-8">Employer Dashboard</h1>

      {analyticsData.map((job, index) => (
        <div key={index} className="mb-10">
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
                {job.devices.map((entry, idx) => (
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
      ))}
    </div>
  );
};

export default EmployerDashboard;
