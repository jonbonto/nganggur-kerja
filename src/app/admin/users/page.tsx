'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UsersManagement: React.FC = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean | number>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = (userId: number) => async () => {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handlePromoteUser = (userId: number) => async () => {
    setIsLoading(userId);

    try {
      const response = await fetch('/api/admin/promoteUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('User promoted successfully');
      } else {
        toast.error(data.message || 'Failed to promote user');
      }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to promote user';
        toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border border-gray-300 px-4 py-2">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.role}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button onClick={handleDeleteUser(user.id)} className="bg-red-600 text-white px-4 py-2 rounded-md">
                  Delete
                </button>
                {user.role !== 'admin' && 
                    <button
                        onClick={handlePromoteUser(user.id)}
                        disabled={!!isLoading}
                        className="bg-blue-600 text-white py-2 px-6 rounded-md disabled:opacity-50 ms-1"
                    >
                        {isLoading === user.id ? 'Promoting..' : 'Make Admin'}
                    </button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManagement;
