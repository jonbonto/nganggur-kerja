/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';

const JobAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [criteria, setCriteria] = useState({ category: '', location: '' });

  const fetchAlerts = async () => {
    const res = await fetch('/api/job-alerts');
    const data = await res.json();
    setAlerts(data);
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
    <section className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Job Alerts</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create New Alert</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createAlert();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Category"
            value={criteria.category}
            onChange={(e) => setCriteria({ ...criteria, category: e.target.value })}
            className="w-full p-3 border rounded-md"
          />
          <input
            type="text"
            placeholder="Location"
            value={criteria.location}
            onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
            className="w-full p-3 border rounded-md"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md">
            Save Alert
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Alerts</h2>
        <ul className="space-y-4">
          {alerts.map((alert: any) => (
            <li key={alert.id} className="bg-white p-4 rounded-md shadow">
              <p>Category: {alert.criteria.category || 'Any'}</p>
              <p>Location: {alert.criteria.location || 'Any'}</p>
              <button
                onClick={() => deleteAlert(alert.id)}
                className="text-red-500 mt-2"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default JobAlerts;
