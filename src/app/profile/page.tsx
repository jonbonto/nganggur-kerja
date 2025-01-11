'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';// Assuming you're using Prisma for DB access

const Profile: React.FC = () => {
  const { data: session, status } = useSession();
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchUserDetails = async () => {
        const response = await fetch(`/api/users/${session.user.id}`);
        const data = await response.json();
        setUserDetails(data.user);
      };

      fetchUserDetails();
    }
  }, [status, session?.user?.id]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Please sign in to view your profile.</p>;

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Edit Your Profile</h2>

        {userDetails ? (
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-lg">Name</label>
              <input
                type="text"
                id="name"
                defaultValue={userDetails.name}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg">Email</label>
              <input
                type="email"
                id="email"
                defaultValue={userDetails.email}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div className="text-center">
              <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md">Save Changes</button>
            </div>
          </form>
        ) : (
          <p>No user data available.</p>
        )}
      </div>
    </section>
  );
};

export default Profile;
