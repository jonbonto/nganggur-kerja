'use client';

import React, { useState, useEffect } from 'react';

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handlePromoteUser = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/promoteUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Failed to promote user.');
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
                <button onClick={() => handleDeleteUser(user.id)} className="bg-red-600 text-white px-4 py-2 rounded-md">
                  Delete
                </button>
                {user.role !== 'admin' && 
                    <button
                        onClick={handlePromoteUser}
                        disabled={isLoading}
                        className="bg-blue-600 text-white py-2 px-6 rounded-md disabled:opacity-50"
                    >
                        {isLoading ? 'Promoting...' : 'Make Admin'}
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
