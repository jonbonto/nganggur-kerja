import { useState, useEffect } from 'react';

export interface Job {
  id: number;
  title: string;
  category: string;
  location: string;
  salary: string;
}

interface UseJobListingsProps {
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}

interface UseJobListingsReturn {
  jobs: Job[];
  totalJobs: number;
  isLoading: boolean;
  error: string;
}

const useJobListings = ({ category, location, page = 1, limit = 5 }: UseJobListingsProps): UseJobListingsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(
          `/api/jobs?category=${category || ''}&location=${location || ''}&page=${page}&limit=${limit}`
        );

        if (!res.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data = await res.json();
        setJobs(data.jobs);
        setTotalJobs(data.total);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [category, location, page, limit]);

  return { jobs, totalJobs, isLoading, error };
};

export default useJobListings;
