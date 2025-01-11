// src/app/jobs/post/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import JobPostForm from './components/JobPostForm';

const PostJobPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/auth/signin'); // Redirect to sign-in page if not logged in
    return null;
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold">Post a Job</h2>
      <JobPostForm />
    </div>
  );
};

export default PostJobPage;
