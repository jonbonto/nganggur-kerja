'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ProfileManagement = () => {
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    profilePicture: '',
  });
  const [editing, setEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Fetch user data from API (replace with actual endpoint)
    const fetchUserData = async () => {
      const res = await fetch('/api/users/me');
      const data = await res.json();
      setUser(data.user);
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = async () => {
    if (!user.name || !user.email) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch(`/api/users/${user.id}/update-profile`, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`/api/users/${user.id}/change-password`, {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Password changed successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message || 'Failed to change password');
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8">Profile Management</h1>

      {/* Profile Picture Section */}
      {/* <div className="flex justify-center mb-8">
        <div className="relative">
          <Image
            src={user.profilePicture || '/default-profile.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-600 object-cover"
            width={128}
            height={128}
          />
          <button
            onClick={() => document.getElementById('profile-picture-input')?.click()}
            className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full border-2 border-white hover:bg-blue-700 transition duration-300"
          >
            <i className="fas fa-camera"></i>
          </button>
          <input
            type="file"
            id="profile-picture-input"
            className="hidden"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
      </div> */}

      {/* Personal Information Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="text-blue-600 hover:underline font-medium"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <label htmlFor="name" className="w-32 text-gray-700">Name</label>
            <input
              id="name"
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              disabled={!editing}
              className="flex-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 transition duration-300"
            />
          </div>

          <div className="flex items-center space-x-6">
            <label htmlFor="email" className="w-32 text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              disabled={!editing}
              className="flex-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 transition duration-300"
            />
          </div>

          {editing && (
            <div className="flex justify-end mt-8">
              <button
                onClick={handleProfileUpdate}
                className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <label htmlFor="current-password" className="w-32 text-gray-700">Current Password</label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="flex-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 transition duration-300"
            />
          </div>

          <div className="flex items-center space-x-6">
            <label htmlFor="new-password" className="w-32 text-gray-700">New Password</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 transition duration-300"
            />
          </div>

          <div className="flex items-center space-x-6">
            <label htmlFor="confirm-password" className="w-32 text-gray-700">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 transition duration-300"
            />
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={handlePasswordChange}
              className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
