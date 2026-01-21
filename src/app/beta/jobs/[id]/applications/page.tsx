'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Application } from '@/types';

const BetaJobApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError('');

      if (id) {
        try {
          const res = await fetch(`/api/jobs/${id}/applications?status=${filter}`);

          if (res.status === 401) {
            return router.push('/beta/auth/signin');
          }

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'Failed to fetch applications');
          }

          setApplications(data.applications || []);
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchApplications();
  }, [id, filter, router]);

  const updateApplicationStatus = async (applicationId: number, status: string) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      toast.success(`${status.charAt(0).toUpperCase() + status.slice(1)} application success`);

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
    } catch (error) {
      toast.error((error as Error).message || 'An error occurred while updating status');
    }
  };

  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <span className="text-lg font-semibold text-destructive">{error}</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Job Applications</h1>

      {/* Filter Controls */}
      <div className="flex gap-2 mb-8">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button 
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pending
        </Button>
        <Button 
          variant={filter === 'accepted' ? 'default' : 'outline'}
          onClick={() => setFilter('accepted')}
        >
          Accepted
        </Button>
        <Button 
          variant={filter === 'rejected' ? 'default' : 'outline'}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </Button>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({applications.length})</CardTitle>
          <CardDescription>Manage applications for this job posting</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No applications found for this filter
            </p>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{app.applicant?.name || 'Unknown Applicant'}</h4>
                        <p className="text-sm text-muted-foreground">{app.applicant?.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                        {app.coverLetter && (
                          <p className="mt-2 text-sm">{app.coverLetter}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <span className={`px-2 py-1 rounded text-xs text-center ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {app.status}
                        </span>
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateApplicationStatus(app.id, 'accepted')}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateApplicationStatus(app.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BetaJobApplications;
