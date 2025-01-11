'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const { id } = useParams();
  const router = useRouter()

  useEffect(() => {
    const fetchApplications = async () => {
      if (id) {
        const res = await fetch(`/api/jobs/${id}/applications`);
        if (res.status === 401) {
            return router.push('/')
        }
        const data = await res.json();
        setApplications(data.applications);
    }
    };

    fetchApplications();
  }, [id, router]);

  const updateApplicationStatus = async (applicationId: number, status: string) => {
    const res = await fetch(`/api/applications/${applicationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    alert(data.message);
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status } : app
      )
    );
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Job Applications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {applications.map((application: any) => (
            <div key={application.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{application.user.name}</h3>
              <p>Cover Letter: {application.coverLetter}</p>
              <p>Resume: <a href={application.resumeUrl} className="text-blue-600">View Resume</a></p>
              <p>Status: {application.status}</p>

              {application.status === 'pending' && <div className="mt-4">
                <button
                  onClick={() => updateApplicationStatus(application.id, 'accepted')}
                  className="bg-green-600 text-white p-2 rounded-md"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateApplicationStatus(application.id, 'rejected')}
                  className="bg-red-600 text-white p-2 rounded-md ml-4"
                >
                  Reject
                </button>
              </div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobApplications;
