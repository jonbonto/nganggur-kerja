'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JobPostDTO } from '@/models/JobPostDTO';
import { JobPostValidator } from '@/services/JobPostValidator';
import { JobPostAPI } from '@/services/JobPostApi';

const JobPostForm: React.FC = () => {
  const [jobDetails, setJobDetails] = useState<Partial<JobPostDTO>>({
    title: '',
    company: '',
    category: '',
    description: '',
    salary: '',
    location: '',
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobDetails({
      ...jobDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input using the Validator service
    const validationError = JobPostValidator.validate(jobDetails as JobPostDTO);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Call the API to submit the job using JobPostAPI service
    const isSuccess = await JobPostAPI.postJob(jobDetails as JobPostDTO);
    if (isSuccess) {
      router.push('/jobs');
    } else {
      setError('Failed to post job. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-semibold text-center mb-8">Post a Job</h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg" htmlFor="title">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={jobDetails.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter the job title"
          />
        </div>

        <div>
          <label className="block text-lg" htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={jobDetails.company}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter the company name"
          />
        </div>

        <div>
          <label className="block text-lg" htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={jobDetails.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter job category"
          />
        </div>

        <div>
          <label className="block text-lg" htmlFor="description">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={jobDetails.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter job description"
          />
        </div>

        <div>
          <label className="block text-lg" htmlFor="salary">Salary</label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={jobDetails.salary}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter the salary range"
          />
        </div>

        <div>
          <label className="block text-lg" htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={jobDetails.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter job location"
          />
        </div>

        <div className="text-center">
          <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md">
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPostForm;
