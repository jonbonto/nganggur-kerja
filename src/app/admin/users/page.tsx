'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  _count?: {
    postedJobs: number;
    applications: number;
  };
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean | number>(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ role: 'all', status: 'all', search: '' });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });

  useEffect(() => {
    fetchUsers();
  }, [filter.role, filter.status, filter.search, pagination.page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '20'
      });
      if (filter.role !== 'all') params.append('role', filter.role);
      if (filter.status !== 'all') params.append('status', filter.status);
      if (filter.search) params.append('search', filter.search);

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
        setPagination(prev => ({ ...prev, ...data.pagination }));
      } else {
        toast.error(data.error || 'Failed to fetch users');
      }
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: number) => async () => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        toast.success('User deleted successfully');
        setUsers(users.filter(user => user.id !== userId));
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete user');
      }
    } catch (error) {
      toast.error('Failed to delete user');
      console.error(error);
    }
  };

  const handleToggleActive = (userId: number, currentStatus: boolean) => async () => {
    setIsLoading(userId);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action: currentStatus ? 'deactivate' : 'activate'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        setUsers(users.map(user => 
          user.id === userId ? { ...user, isActive: !currentStatus } : user
        ));
      } else {
        toast.error(data.error || 'Failed to update user');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = (userId: number, currentRole: string) => async () => {
    const newRole = prompt(`Change role for user (current: ${currentRole})\nEnter new role (user/employer/admin):`, currentRole);
    
    if (!newRole || newRole === currentRole) return;
    if (!['user', 'employer', 'admin'].includes(newRole)) {
      toast.error('Invalid role. Must be user, employer, or admin');
      return;
    }

    setIsLoading(userId);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'changeRole', role: newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('User role updated successfully');
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        toast.error(data.error || 'Failed to update role');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update role';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading && users.length === 0) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Manage Users</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={filter.role}
              onChange={(e) => setFilter({ ...filter, role: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="all">All Roles</option>
              <option value="user">Job Seekers</option>
              <option value="employer">Employers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{user.name || 'No name'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'employer' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user._count && (
                      <div>
                        <div>{user._count.postedJobs} jobs</div>
                        <div>{user._count.applications} applications</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleToggleActive(user.id, user.isActive)}
                        disabled={!!isLoading}
                        className={`px-3 py-1 rounded text-xs ${
                          user.isActive
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white disabled:opacity-50`}
                      >
                        {isLoading === user.id ? '...' : user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={handleChangeRole(user.id, user.role)}
                        disabled={!!isLoading}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                      >
                        Change Role
                      </button>
                      <button
                        onClick={handleDeleteUser(user.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{users.length}</span> of{' '}
              <span className="font-medium">{pagination.totalCount}</span> users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
