/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const BetaJobAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [criteria, setCriteria] = useState({ category: '', location: '' });

  const fetchAlerts = async () => {
    const res = await fetch('/api/job-alerts');
    const data = await res.json();
    setAlerts(data || []);
  };

  const createAlert = async () => {
    await fetch('/api/job-alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ criteria }),
    });
    setCriteria({ category: '', location: '' });
    fetchAlerts();
  };

  const deleteAlert = async (id: number) => {
    await fetch('/api/job-alerts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchAlerts();
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Job Alerts</h1>

      {/* Create New Alert */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Alert</CardTitle>
          <CardDescription>Set criteria to receive notifications for matching jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createAlert();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Input
                id="category"
                type="text"
                placeholder="e.g., Software Development"
                value={criteria.category}
                onChange={(e) => setCriteria({ ...criteria, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., Remote or New York"
                value={criteria.location}
                onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
              />
            </div>
            <Button type="submit">Save Alert</Button>
          </form>
        </CardContent>
      </Card>

      {/* Your Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Your Alerts</CardTitle>
          <CardDescription>Manage your active job alerts</CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No alerts configured yet
            </p>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert: any) => (
                <Card key={alert.id}>
                  <CardContent className="flex justify-between items-center pt-6">
                    <div>
                      <p className="font-medium">
                        Category: {alert.criteria.category || 'Any'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Location: {alert.criteria.location || 'Any'}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteAlert(alert.id)}
                    >
                      Delete
                    </Button>
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

export default BetaJobAlerts;
